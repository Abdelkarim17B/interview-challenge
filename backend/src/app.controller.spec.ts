import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockAppService = {
    getHello: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('getHello', () => {
    it('should return "Hello Oxyera!"', () => {
      mockAppService.getHello.mockReturnValue('Hello Oxyera!');

      const result = appController.getHello();

      expect(appService.getHello).toHaveBeenCalled();
      expect(result).toBe('Hello Oxyera!');
    });
  });

  describe('getHealth', () => {
    it('should return health status object', () => {
      const mockDate = new Date('2024-01-01T00:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      jest.spyOn(process, 'uptime').mockReturnValue(123.456);

      const result = appController.getHealth();

      expect(result).toEqual({
        status: 'ok',
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 123.456,
      });

      jest.restoreAllMocks();
    });

    it('should return different timestamps for different calls', () => {
      jest.spyOn(process, 'uptime').mockReturnValue(100);

      const result1 = appController.getHealth() as any;
      const result2 = appController.getHealth() as any;

      expect(result1.status).toBe('ok');
      expect(result2.status).toBe('ok');
      expect(result1.uptime).toBe(100);
      expect(result2.uptime).toBe(100);
    });
  });
});
