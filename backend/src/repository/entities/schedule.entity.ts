import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Film } from './film.entity';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column('double precision')
  price: number;

  @Column('text')
  taken: string;

  @Column({ name: 'filmId', type: 'uuid', nullable: false })
  filmId: string;

  @ManyToOne(() => Film, (film) => film.schedule, { nullable: false })
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
