import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignment.entity';
import { PatientsService } from '../patients/patients.service';
import { MedicationsService } from '../medications/medications.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

describe('AssignmentsService', () => {
  let service: AssignmentsService;

  const mockAssignmentsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockPatientsService = {
    findOne: jest.fn(),
  };

  const mockMedicationsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentsService,
        {
          provide: getRepositoryToken(Assignment),
          useValue: mockAssignmentsRepository,
        },
        {
          provide: PatientsService,
          useValue: mockPatientsService,
        },
        {
          provide: MedicationsService,
          useValue: mockMedicationsService,
        },
      ],
    }).compile();

    service = module.get<AssignmentsService>(AssignmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an assignment successfully', async () => {
      const createAssignmentDto: CreateAssignmentDto = {
        patientId: 1,
        medicationId: 1,
        startDate: '2024-01-01',
        days: 30,
      };

      const mockPatient = { id: 1, name: 'John Doe' };
      const mockMedication = { id: 1, name: 'Aspirin' };
      const mockAssignment = {
        id: 1,
        patientId: 1,
        medicationId: 1,
        startDate: new Date('2024-01-01'),
        days: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPatientsService.findOne.mockResolvedValue(mockPatient);
      mockMedicationsService.findOne.mockResolvedValue(mockMedication);
      mockAssignmentsRepository.create.mockReturnValue(mockAssignment);
      mockAssignmentsRepository.save.mockResolvedValue(mockAssignment);

      const result = await service.create(createAssignmentDto);

      expect(mockPatientsService.findOne).toHaveBeenCalledWith(1);
      expect(mockMedicationsService.findOne).toHaveBeenCalledWith(1);
      expect(mockAssignmentsRepository.create).toHaveBeenCalledWith({
        patientId: 1,
        medicationId: 1,
        startDate: new Date('2024-01-01'),
        days: 30,
      });
      expect(result).toEqual(mockAssignment);
    });

    it('should throw NotFoundException when patient not found', async () => {
      const createAssignmentDto: CreateAssignmentDto = {
        patientId: 999,
        medicationId: 1,
        startDate: '2024-01-01',
        days: 30,
      };

      mockPatientsService.findOne.mockRejectedValue(
        new NotFoundException('Patient with ID 999 not found')
      );

      await expect(service.create(createAssignmentDto)).rejects.toThrow(
        new NotFoundException('Patient with ID 999 not found')
      );
    });

    it('should throw NotFoundException when medication not found', async () => {
      const createAssignmentDto: CreateAssignmentDto = {
        patientId: 1,
        medicationId: 999,
        startDate: '2024-01-01',
        days: 30,
      };

      const mockPatient = { id: 1, name: 'John Doe' };

      mockPatientsService.findOne.mockResolvedValue(mockPatient);
      mockMedicationsService.findOne.mockRejectedValue(
        new NotFoundException('Medication with ID 999 not found')
      );

      await expect(service.create(createAssignmentDto)).rejects.toThrow(
        new NotFoundException('Medication with ID 999 not found')
      );
    });
  });

  describe('findAll', () => {
    it('should return all assignments with relations', async () => {
      const mockAssignments = [
        {
          id: 1,
          patientId: 1,
          medicationId: 1,
          patient: { id: 1, name: 'John Doe' },
          medication: { id: 1, name: 'Aspirin' },
        },
      ];

      mockAssignmentsRepository.find.mockResolvedValue(mockAssignments);

      const result = await service.findAll();

      expect(mockAssignmentsRepository.find).toHaveBeenCalledWith({
        relations: ['patient', 'medication'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockAssignments);
    });
  });

  describe('findOne', () => {
    it('should return an assignment when found', async () => {
      const mockAssignment = {
        id: 1,
        patientId: 1,
        medicationId: 1,
        patient: { id: 1, name: 'John Doe' },
        medication: { id: 1, name: 'Aspirin' },
      };

      mockAssignmentsRepository.findOne.mockResolvedValue(mockAssignment);

      const result = await service.findOne(1);

      expect(mockAssignmentsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['patient', 'medication'],
      });
      expect(result).toEqual(mockAssignment);
    });

    it('should throw NotFoundException when assignment not found', async () => {
      mockAssignmentsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Assignment with ID 999 not found')
      );
    });
  });

  describe('update', () => {
    it('should update an assignment successfully', async () => {
      const updateAssignmentDto: UpdateAssignmentDto = {
        days: 45,
      };

      const existingAssignment = {
        id: 1,
        patientId: 1,
        medicationId: 1,
        days: 30,
      };

      const updatedAssignment = {
        ...existingAssignment,
        days: 45,
      };

      mockAssignmentsRepository.findOne.mockResolvedValue(existingAssignment);
      mockAssignmentsRepository.save.mockResolvedValue(updatedAssignment);

      const result = await service.update(1, updateAssignmentDto);

      expect(mockAssignmentsRepository.save).toHaveBeenCalledWith(updatedAssignment);
      expect(result).toEqual(updatedAssignment);
    });

    it('should validate patient when patientId is updated', async () => {
      const updateAssignmentDto: UpdateAssignmentDto = {
        patientId: 2,
      };

      const existingAssignment = {
        id: 1,
        patientId: 1,
        medicationId: 1,
      };

      const mockPatient = { id: 2, name: 'Jane Doe' };

      mockAssignmentsRepository.findOne.mockResolvedValue(existingAssignment);
      mockPatientsService.findOne.mockResolvedValue(mockPatient);
      mockAssignmentsRepository.save.mockResolvedValue({
        ...existingAssignment,
        patientId: 2,
      });

      await service.update(1, updateAssignmentDto);

      expect(mockPatientsService.findOne).toHaveBeenCalledWith(2);
    });

    it('should validate medication when medicationId is updated', async () => {
      const updateAssignmentDto: UpdateAssignmentDto = {
        medicationId: 2,
      };

      const existingAssignment = {
        id: 1,
        patientId: 1,
        medicationId: 1,
      };

      const mockMedication = { id: 2, name: 'Paracetamol' };

      mockAssignmentsRepository.findOne.mockResolvedValue(existingAssignment);
      mockMedicationsService.findOne.mockResolvedValue(mockMedication);
      mockAssignmentsRepository.save.mockResolvedValue({
        ...existingAssignment,
        medicationId: 2,
      });

      await service.update(1, updateAssignmentDto);

      expect(mockMedicationsService.findOne).toHaveBeenCalledWith(2);
    });
  });

  describe('remove', () => {
    it('should remove an assignment successfully', async () => {
      const mockAssignment = {
        id: 1,
        patientId: 1,
        medicationId: 1,
      };

      mockAssignmentsRepository.findOne.mockResolvedValue(mockAssignment);
      mockAssignmentsRepository.remove.mockResolvedValue(mockAssignment);

      await service.remove(1);

      expect(mockAssignmentsRepository.remove).toHaveBeenCalledWith(mockAssignment);
    });
  });

  describe('calculateRemainingDays', () => {
    it('should calculate remaining days correctly for ongoing treatment', () => {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 5); // Started 5 days ago
      const totalDays = 30;

      const result = service.calculateRemainingDays(startDate, totalDays);

      expect(result).toBe(25); // 30 - 5 = 25 days remaining
    });

    it('should return 0 for completed treatment', () => {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 35); // Started 35 days ago
      const totalDays = 30;

      const result = service.calculateRemainingDays(startDate, totalDays);

      expect(result).toBe(0); // Treatment completed
    });

    it('should handle future start dates', () => {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + 5); // Starts in 5 days
      const totalDays = 30;

      const result = service.calculateRemainingDays(startDate, totalDays);

      expect(result).toBe(35); // 5 days until start + 30 treatment days
    });
  });

  describe('findAllWithRemainingDays', () => {
    it('should return assignments with calculated remaining days', async () => {
      const mockAssignments = [
        {
          id: 1,
          startDate: new Date('2024-01-01'),
          days: 30,
        },
      ];

      mockAssignmentsRepository.find.mockResolvedValue(mockAssignments);
      jest.spyOn(service, 'calculateRemainingDays').mockReturnValue(25);

      const result = await service.findAllWithRemainingDays();

      expect(result).toEqual([
        {
          id: 1,
          startDate: new Date('2024-01-01'),
          days: 30,
          remainingDays: 25,
        },
      ]);
    });
  });

  describe('findOneWithRemainingDays', () => {
    it('should return assignment with calculated remaining days', async () => {
      const mockAssignment = {
        id: 1,
        startDate: new Date('2024-01-01'),
        days: 30,
      };

      mockAssignmentsRepository.findOne.mockResolvedValue(mockAssignment);
      jest.spyOn(service, 'calculateRemainingDays').mockReturnValue(25);

      const result = await service.findOneWithRemainingDays(1);

      expect(result).toEqual({
        id: 1,
        startDate: new Date('2024-01-01'),
        days: 30,
        remainingDays: 25,
      });
    });
  });
});
