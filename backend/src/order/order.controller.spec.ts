import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;

  const orderServiceMock = {
    createOrder: jest.fn().mockResolvedValue({
      total: 0,
      items: [],
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes an order DTO to OrderService and returns its result', async () => {
    const dto = {
      email: 'user@example.com',
      phone: '+79990000000',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '2026-06-23T18:00:00.000Z',
          row: 1,
          seat: 2,
          price: 500,
        },
      ],
    };

    const response = {
      total: 1,
      items: [
        {
          id: 'ticket-1',
          ...dto.tickets[0],
        },
      ],
    };

    orderServiceMock.createOrder.mockResolvedValueOnce(response);

    await expect(controller.createOrder(dto)).resolves.toEqual(response);
    expect(orderServiceMock.createOrder).toHaveBeenCalledWith(dto);
  });
});
