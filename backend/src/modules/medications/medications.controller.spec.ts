import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

describe('MedicationsController', () => {
  let controller: MedicationsController;

  const mockMedicationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationsController],
      providers: [
        {
          provide: MedicationsService,
          useValue: mockMedicationsService,
        },
      ],
    }).compile();

    controller = module.get<MedicationsController>(MedicationsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a medication successfully', async () => {
      const createMedicationDto: CreateMedicationDto = {
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Once daily',
      };

      const mockMedication = {
        id: 1,
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Once daily',
        createdAt: new Date(),
        updatedAt: new Date(),
        assignments: [],
      };

      mockMedicationsService.create.mockResolvedValue(mockMedication);

      const result = await controller.create(createMedicationDto);

      expect(mockMedicationsService.create).toHaveBeenCalledWith(
        createMedicationDto,
      );
      expect(result).toEqual(mockMedication);
    });

    it('should handle service errors during creation', async () => {
      const createMedicationDto: CreateMedicationDto = {
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Once daily',
      };

      mockMedicationsService.create.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.create(createMedicationDto)).rejects.toThrow(
        'Service error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all medications', async () => {
      const mockMedications = [
        {
          id: 1,
          name: 'Aspirin',
          assignments: [],
        },
        {
          id: 2,
          name: 'Paracetamol',
          assignments: [],
        },
      ];

      mockMedicationsService.findAll.mockResolvedValue(mockMedications);

      const result = await controller.findAll();

      expect(mockMedicationsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockMedications);
    });

    it('should return empty array when no medications exist', async () => {
      mockMedicationsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a medication when found', async () => {
      const mockMedication = {
        id: 1,
        name: 'Aspirin',
        assignments: [],
      };

      mockMedicationsService.findOne.mockResolvedValue(mockMedication);

      const result = await controller.findOne(1);

      expect(mockMedicationsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMedication);
    });

    it('should throw NotFoundException when medication not found', async () => {
      mockMedicationsService.findOne.mockRejectedValue(
        new NotFoundException('Medication with ID 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(
        new NotFoundException('Medication with ID 999 not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a medication successfully', async () => {
      const updateMedicationDto: UpdateMedicationDto = {
        name: 'Aspirin Updated',
        dosage: '200mg',
      };

      const updatedMedication = {
        id: 1,
        name: 'Aspirin Updated',
        dosage: '200mg',
        frequency: 'Once daily',
        assignments: [],
      };

      mockMedicationsService.update.mockResolvedValue(updatedMedication);

      const result = await controller.update(1, updateMedicationDto);

      expect(mockMedicationsService.update).toHaveBeenCalledWith(
        1,
        updateMedicationDto,
      );
      expect(result).toEqual(updatedMedication);
    });

    it('should throw NotFoundException when medication not found', async () => {
      const updateMedicationDto: UpdateMedicationDto = {
        name: 'Aspirin Updated',
      };

      mockMedicationsService.update.mockRejectedValue(
        new NotFoundException('Medication with ID 999 not found'),
      );

      await expect(controller.update(999, updateMedicationDto)).rejects.toThrow(
        new NotFoundException('Medication with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a medication successfully', async () => {
      mockMedicationsService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockMedicationsService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when medication not found', async () => {
      mockMedicationsService.remove.mockRejectedValue(
        new NotFoundException('Medication with ID 999 not found'),
      );

      await expect(controller.remove(999)).rejects.toThrow(
        new NotFoundException('Medication with ID 999 not found'),
      );
    });
  });
});
