import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { TypeOrmFilmRepository } from './film.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('DATABASE_URL'),
        username: configService.getOrThrow<string>('DATABASE_USERNAME'),
        password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
        entities: [Film, Schedule],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [
    {
      provide: 'FILM_REPOSITORY',
      useClass: TypeOrmFilmRepository,
    },
  ],
  exports: ['FILM_REPOSITORY'],
})
export class RepositoryModule {}
