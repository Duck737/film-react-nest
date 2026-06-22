import { BadRequestException, Injectable } from '@nestjs/common';
import { FilmRepository } from './film.repository.interface';
import { FilmDto, FilmScheduleDto } from 'src/films/dto/films.dto';
import { OrderTicketDto } from 'src/order/dto/order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { DataSource, Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';

const splitTextList = (value: string): string[] => {
  if (!value) {
    return [];
  }

  return value.split(',').filter(Boolean);
};

const joinTextList = (items: string[]): string => items.join(',');

@Injectable()
export class TypeOrmFilmRepository implements FilmRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,

    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find();

    return films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: splitTextList(film.tags),
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
    }));
  }

  async findScheduleByFilmId(id: string): Promise<FilmScheduleDto[]> {
    const schedules = await this.scheduleRepository.find({
      where: { filmId: id },
      order: {
        daytime: 'ASC',
        hall: 'ASC',
        id: 'ASC',
      },
    });

    return schedules.map((schedule) => ({
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: splitTextList(schedule.taken),
    }));
  }

  async takeTickets(tickets: OrderTicketDto[]): Promise<OrderTicketDto[]> {
    return this.dataSource.transaction(async (manager) => {
      const requestedPlaces = new Set<string>();

      for (const ticket of tickets) {
        const place = `${ticket.row}:${ticket.seat}`;
        const requestKey = `${ticket.film}:${ticket.session}:${place}`;

        if (requestedPlaces.has(requestKey)) {
          throw new BadRequestException('Seat is already taken');
        }

        requestedPlaces.add(requestKey);

        const schedule = await manager.findOne(Schedule, {
          where: {
            id: ticket.session,
            filmId: ticket.film,
          },
          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!schedule) {
          throw new BadRequestException('Film or session not found');
        }

        const taken = splitTextList(schedule.taken);

        if (taken.includes(place)) {
          throw new BadRequestException('Seat is already taken');
        }

        schedule.taken = joinTextList([...taken, place]);

        await manager.save(Schedule, schedule);
      }

      return tickets;
    });
  }
}
