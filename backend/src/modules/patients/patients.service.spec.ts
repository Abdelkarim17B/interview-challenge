import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Patient } from './patient.entity';
import { Assignment } from '../assignments/assignment.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

describe('PatientsService', () => {
  let service: PatientsService;

  const mockPatientsRepository = {
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
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useValue: mockPatientsRepository,
        },
        {
          provide: getRepositoryToken(Assignment),
          useValue: mockAssignmentsRepository,
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      };

      mockPatientsRepository.create.mockReturnValue(mockPatient);
      mockPatientsRepository.save.mockResolvedValue(mockPatient);

      const result = await service.create(createPatientDto);

      expect(mockPatientsRepository.create).toHaveBeenCalledWith({
        name: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
      });
      expect(mockPatientsRepository.save).toHaveBeenCalledWith(mockPatient);
      expect(result).toEqual(mockPatient);
    });

    it('should handle repository errors during creation', async () => {
      const createPatientDto: CreatePatientDto = {
        name: 'John Doe',
        dateOfBirth: '1990-01-01',
      };

      mockPatientsRepository.create.mockReturnValue({});
      mockPatientsRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createPatientDto)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return all patients with their assignments', async () => {
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

      mockPatientsRepository.find.mockResolvedValue(mockPatients);

      const result = await service.findAll();

      expect(mockPatientsRepository.find).toHaveBeenCalledWith({
        relations: ['assignments', 'assignments.medication'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockPatients);
    });

    it('should return empty array when no patients exist', async () => {
      mockPatientsRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

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

      mockPatientsRepository.findOne.mockResolvedValue(mockPatient);

      const result = await service.findOne(1);

      expect(mockPatientsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['assignments', 'assignments.medication'],
      });
      expect(result).toEqual(mockPatient);
    });

    it('should throw NotFoundException when patient not found', async () => {
      mockPatientsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Patient with ID 999 not found')
      );
    });
  });

  describe('update', () => {
    it('should update a patient successfully', async () => {
      const updatePatientDto: UpdatePatientDto = {
        name: 'John Updated',
      };

      const existingPatient = {
        id: 1,
        name: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
      };

      const updatedPatient = {
        ...existingPatient,
        name: 'John Updated',
      };

      mockPatientsRepository.findOne.mockResolvedValue(existingPatient);
      mockPatientsRepository.save.mockResolvedValue(updatedPatient);

      const result = await service.update(1, updatePatientDto);

      expect(mockPatientsRepository.save).toHaveBeenCalledWith(updatedPatient);
      expect(result).toEqual(updatedPatient);
    });

    it('should update dateOfBirth when provided', async () => {
      const updatePatientDto: UpdatePatientDto = {
        dateOfBirth: '1985-05-15',
      };

      const existingPatient = {
        id: 1,
        name: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
      };

      mockPatientsRepository.findOne.mockResolvedValue(existingPatient);
      mockPatientsRepository.save.mockResolvedValue({
        ...existingPatient,
        dateOfBirth: new Date('1985-05-15'),
      });

      await service.update(1, updatePatientDto);

      expect(mockPatientsRepository.save).toHaveBeenCalledWith({
        ...existingPatient,
        dateOfBirth: new Date('1985-05-15'),
      });
    });

    it('should throw NotFoundException when patient not found', async () => {
      mockPatientsRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(
        new NotFoundException('Patient with ID 999 not found')
      );
    });
  });

  describe('remove', () => {
    it('should remove a patient and related assignments', async () => {
      const mockPatient = {
        id: 1,
        name: 'John Doe',
      };

      mockPatientsRepository.findOne.mockResolvedValue(mockPatient);
      mockAssignmentsRepository.delete.mockResolvedValue({ affected: 2 });
      mockPatientsRepository.remove.mockResolvedValue(mockPatient);

      await service.remove(1);

      expect(mockAssignmentsRepository.delete).toHaveBeenCalledWith({ patientId: 1 });
      expect(mockPatientsRepository.remove).toHaveBeenCalledWith(mockPatient);
    });

    it('should throw NotFoundException when patient not found', async () => {
      mockPatientsRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Patient with ID 999 not found')
      );
    });
  });
});
