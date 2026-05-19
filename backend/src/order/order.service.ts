import { Inject, Injectable } from '@nestjs/common';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderResultDto,
} from './dto/order.dto';
import { FilmRepository } from 'src/repository/film.repository.interface';
import { randomUUID } from 'node:crypto';

@Injectable()
export class OrderService {
  constructor(
    @Inject('FILM_REPOSITORY')
    private readonly filmRepository: FilmRepository,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const tickets = await this.filmRepository.takeTickets(dto.tickets);

    const items: OrderResultDto[] = tickets.map((ticket) => ({
      ...ticket,
      id: randomUUID(),
    }));

    return {
      total: items.length,
      items,
    };
  }
}
