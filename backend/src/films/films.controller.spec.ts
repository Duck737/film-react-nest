import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;

  const filmsServiceMock = {
    findAll: jest.fn().mockResolvedValue({
      total: 0,
      items: [],
    }),
    findScheduleByFilmsId: jest.fn().mockResolvedValue({
      total: 0,
      items: [],
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: filmsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns films received from FilmsService', async () => {
    const response = {
      total: 1,
      items: [],
    };

    filmsServiceMock.findAll.mockResolvedValueOnce(response);

    await expect(controller.getFilms()).resolves.toEqual(response);
    expect(filmsServiceMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('passes a film id to FilmsService when requesting a schedule', async () => {
    const response = {
      total: 0,
      items: [],
    };

    filmsServiceMock.findScheduleByFilmsId.mockResolvedValueOnce(response);

    await expect(controller.getFilmSchedule('film-1')).resolves.toEqual(
      response,
    );
    expect(filmsServiceMock.findScheduleByFilmsId).toHaveBeenCalledWith(
      'film-1',
    );
  });
});
