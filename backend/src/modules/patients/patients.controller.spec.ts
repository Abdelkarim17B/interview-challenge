import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;

  const mockPatientsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        {
          provide: PatientsService,
          useValue: mockPatientsService,
        },
      ],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a patient successfully', async () => {
      const createPatientDto: CreatePatientDto = {
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
      };

      const mockPatient = {
        id: 1,
        name: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
        assignments: [],
      };

      mockPatientsService.create.mockResolvedValue(mockPatient);

      const result = await controller.create(createPatientDto);

      expect(service.create).toHaveBeenCalledWith(createPatientDto);
      expect(result).toEqual(mockPatient);
    });

    it('should handle service errors during creation', async () => {
      const createPatientDto: CreatePatientDto = {
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
      };

      mockPatientsService.create.mockRejectedValue(new Error('Service error'));

      await expect(controller.create(createPatientDto)).rejects.toThrow('Service error');
    });
  });

  describe('findAll', () => {
    it('should return all patients', async () => {
      const mockPatients = [
        {
          id: 1,
          name: 'John Doe',
          assignments: [],
        },
        {
          id: 2,
          name: 'Jane Smith',
          assignments: [],
        },
      ];

      mockPatientsService.findAll.mockResolvedValue(mockPatients);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPatients);
    });

    it('should return empty array when no patients exist', async () => {
      mockPatientsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a patient when found', async () => {
      const mockPatient = {
        id: 1,
        name: 'John Doe',
        assignments: [],
      };

      mockPatientsService.findOne.mockResolvedValue(mockPatient);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPatient);
    });

    it('should throw NotFoundException when patient not found', async () => {
      mockPatientsService.findOne.mockRejectedValue(
        new NotFoundException('Patient with ID 999 not found')
      );

      await expect(controller.findOne(999)).rejects.toThrow(
        new NotFoundException('Patient with ID 999 not found')
      );
    });
  });

  describe('update', () => {
    it('should update a patient successfully', async () => {
      const updatePatientDto: UpdatePatientDto = {
        name: 'John Updated',
      };

      const updatedPatient = {
        id: 1,
        name: 'John Updated',
        dateOfBirth: new Date('1990-01-01'),
        assignments: [],
      };

      mockPatientsService.update.mockResolvedValue(updatedPatient);

      const result = await controller.update(1, updatePatientDto);

      expect(service.update).toHaveBeenCalledWith(1, updatePatientDto);
      expect(result).toEqual(updatedPatient);
    });

    it('should throw NotFoundException when patient not found', async () => {
      const updatePatientDto: UpdatePatientDto = {
        name: 'John Updated',
      };

      mockPatientsService.update.mockRejectedValue(
        new NotFoundException('Patient with ID 999 not found')
      );

      await expect(controller.update(999, updatePatientDto)).rejects.toThrow(
        new NotFoundException('Patient with ID 999 not found')
      );
    });
  });

  describe('remove', () => {
    it('should remove a patient successfully', async () => {
      mockPatientsService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when patient not found', async () => {
      mockPatientsService.remove.mockRejectedValue(
        new NotFoundException('Patient with ID 999 not found')
      );

      await expect(controller.remove(999)).rejects.toThrow(
        new NotFoundException('Patient with ID 999 not found')
      );
    });
  });
});
