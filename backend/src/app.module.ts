import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';
import * as path from 'node:path';
import { mongoProvider } from './repository/mongo.provider';
import { MongoFilmRepository } from './repository/film.repository';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    mongoProvider,
    FilmsService,
    OrderService,
    {
      provide: 'FILM_REPOSITORY',
      useClass: MongoFilmRepository,
    },
  ],
})
export class AppModule {}
