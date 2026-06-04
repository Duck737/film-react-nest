import { FilmDto, FilmScheduleDto } from 'src/films/dto/films.dto';
import { OrderTicketDto } from 'src/order/dto/order.dto';

export interface FilmEntity extends FilmDto {
  schedule: FilmScheduleDto[];
}

export interface FilmRepository {
  findAll(): Promise<FilmDto[]>;
  findScheduleByFilmId(id: string): Promise<FilmScheduleDto[]>;
  takeTickets(tickets: OrderTicketDto[]): Promise<OrderTicketDto[]>;
}
