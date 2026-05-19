import { Inject, Injectable } from '@nestjs/common';
import { ApiListResponseDto, FilmDto, FilmScheduleDto } from './dto/films.dto';
import { FilmRepository } from 'src/repository/film.repository.interface';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILM_REPOSITORY')
    private readonly filmRepository: FilmRepository,
  ) {}

  async findAll(): Promise<ApiListResponseDto<FilmDto>> {
    const items = await this.filmRepository.findAll();

    return {
      total: items.length,
      items,
    };
  }

  async findScheduleByFilmsId(
    id: string,
  ): Promise<ApiListResponseDto<FilmScheduleDto>> {
    const items = await this.filmRepository.findScheduleByFilmId(id);

    return {
      total: items.length,
      items,
    };
  }
}
