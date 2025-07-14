import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { Medication } from './medication.entity';
import { Assignment } from '../assignments/assignment.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

describe('MedicationsService', () => {
  let service: MedicationsService;

  const mockMedicationsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockAssignmentsRepository = {
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationsService,
        {
          provide: getRepositoryToken(Medication),
          useValue: mockMedicationsRepository,
        },
        {
          provide: getRepositoryToken(Assignment),
          useValue: mockAssignmentsRepository,
        },
      ],
    }).compile();

    service = module.get<MedicationsService>(MedicationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      };

      mockMedicationsRepository.create.mockReturnValue(mockMedication);
      mockMedicationsRepository.save.mockResolvedValue(mockMedication);

      const result = await service.create(createMedicationDto);

      expect(mockMedicationsRepository.create).toHaveBeenCalledWith(
        createMedicationDto,
      );
      expect(mockMedicationsRepository.save).toHaveBeenCalledWith(
        mockMedication,
      );
      expect(result).toEqual(mockMedication);
    });

    it('should handle repository errors during creation', async () => {
      const createMedicationDto: CreateMedicationDto = {
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Once daily',
      };

      mockMedicationsRepository.create.mockReturnValue({});
      mockMedicationsRepository.save.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createMedicationDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all medications with their assignments', async () => {
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

      mockMedicationsRepository.find.mockResolvedValue(mockMedications);

      const result = await service.findAll();

      expect(mockMedicationsRepository.find).toHaveBeenCalledWith({
        relations: ['assignments', 'assignments.patient'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockMedications);
    });

    it('should return empty array when no medications exist', async () => {
      mockMedicationsRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

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

      mockMedicationsRepository.findOne.mockResolvedValue(mockMedication);

      const result = await service.findOne(1);

      expect(mockMedicationsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['assignments', 'assignments.patient'],
      });
      expect(result).toEqual(mockMedication);
    });

    it('should throw NotFoundException when medication not found', async () => {
      mockMedicationsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
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

      const existingMedication = {
        id: 1,
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'Once daily',
      };

      const updatedMedication = {
        ...existingMedication,
        name: 'Aspirin Updated',
        dosage: '200mg',
      };

      mockMedicationsRepository.findOne.mockResolvedValue(existingMedication);
      mockMedicationsRepository.save.mockResolvedValue(updatedMedication);

      const result = await service.update(1, updateMedicationDto);

      expect(mockMedicationsRepository.save).toHaveBeenCalledWith(
        updatedMedication,
      );
      expect(result).toEqual(updatedMedication);
    });

    it('should throw NotFoundException when medication not found', async () => {
      mockMedicationsRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(
        new NotFoundException('Medication with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a medication and related assignments', async () => {
      const mockMedication = {
        id: 1,
        name: 'Aspirin',
      };

      mockMedicationsRepository.findOne.mockResolvedValue(mockMedication);
      mockAssignmentsRepository.delete.mockResolvedValue({ affected: 1 });
      mockMedicationsRepository.remove.mockResolvedValue(mockMedication);

      await service.remove(1);

      expect(mockAssignmentsRepository.delete).toHaveBeenCalledWith({
        medicationId: 1,
      });
      expect(mockMedicationsRepository.remove).toHaveBeenCalledWith(
        mockMedication,
      );
    });

    it('should throw NotFoundException when medication not found', async () => {
      mockMedicationsRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Medication with ID 999 not found'),
      );
    });
  });
});
