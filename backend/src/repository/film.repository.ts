import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FilmEntity, FilmRepository } from './film.repository.interface';
import { Connection, Model } from 'mongoose';
import { FilmSchema } from './film.schema';
import { FilmDto, FilmScheduleDto } from 'src/films/dto/films.dto';
import { OrderTicketDto } from 'src/order/dto/order.dto';

@Injectable()
export class MongoFilmRepository implements FilmRepository {
  private readonly filmModel: Model<FilmEntity>;

  constructor(@Inject('MONGO_CONNECTION') connection: Connection) {
    this.filmModel = connection.model<FilmEntity>('Film', FilmSchema);
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().lean();

    return films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
    }));
  }

  async findScheduleByFilmId(id: string): Promise<FilmScheduleDto[]> {
    const film = await this.filmModel.findOne({ id }).lean();

    return film?.schedule ?? [];
  }

  async takeTickets(tickets: OrderTicketDto[]): Promise<OrderTicketDto[]> {
    for (const ticket of tickets) {
      const place = `${ticket.row}:${ticket.seat}`;

      const film = await this.filmModel.findOne({
        id: ticket.film,
        'schedule.id': ticket.session,
      });

      if (!film) {
        throw new BadRequestException('Film or session not found');
      }

      const session = film.schedule.find((item) => item.id === ticket.session);

      if (!session) {
        throw new BadRequestException('Session not found');
      }

      if (session.taken.includes(place)) {
        throw new BadRequestException('Seat is already taken');
      }

      session.taken.push(place);
      await film.save();
    }

    return tickets;
  }
}
