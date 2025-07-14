import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

describe('AssignmentsController', () => {
  let controller: AssignmentsController;

  const mockAssignmentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findAllWithRemainingDays: jest.fn(),
    findOneWithRemainingDays: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentsController],
      providers: [
        {
          provide: AssignmentsService,
          useValue: mockAssignmentsService,
        },
      ],
    }).compile();

    controller = module.get<AssignmentsController>(AssignmentsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an assignment successfully', async () => {
      const createAssignmentDto: CreateAssignmentDto = {
        patientId: 1,
        medicationId: 1,
        startDate: '2024-01-01',
        days: 30,
      };

      const mockAssignment = {
        id: 1,
        patientId: 1,
        medicationId: 1,
        startDate: new Date('2024-01-01'),
        days: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAssignmentsService.create.mockResolvedValue(mockAssignment);

      const result = await controller.create(createAssignmentDto);

      expect(mockAssignmentsService.create).toHaveBeenCalledWith(
        createAssignmentDto,
      );
      expect(result).toEqual(mockAssignment);
    });

    it('should handle service errors during creation', async () => {
      const createAssignmentDto: CreateAssignmentDto = {
        patientId: 1,
        medicationId: 1,
        startDate: '2024-01-01',
        days: 30,
      };

      mockAssignmentsService.create.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.create(createAssignmentDto)).rejects.toThrow(
        'Service error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all assignments', async () => {
      const mockAssignments = [
        {
          id: 1,
          patientId: 1,
          medicationId: 1,
          patient: { id: 1, name: 'John Doe' },
          medication: { id: 1, name: 'Aspirin' },
        },
      ];

      mockAssignmentsService.findAll.mockResolvedValue(mockAssignments);

      const result = await controller.findAll();

      expect(mockAssignmentsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockAssignments);
    });

    it('should return empty array when no assignments exist', async () => {
      mockAssignmentsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findAllWithRemainingDays', () => {
    it('should return assignments with remaining days', async () => {
      const mockAssignments = [
        {
          id: 1,
          patientId: 1,
          medicationId: 1,
          remainingDays: 25,
        },
      ];

      mockAssignmentsService.findAllWithRemainingDays.mockResolvedValue(
        mockAssignments,
      );

      const result = await controller.findAllWithRemainingDays();

      expect(
        mockAssignmentsService.findAllWithRemainingDays,
      ).toHaveBeenCalled();
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

      mockAssignmentsService.findOne.mockResolvedValue(mockAssignment);

      const result = await controller.findOne(1);

      expect(mockAssignmentsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAssignment);
    });

    it('should throw NotFoundException when assignment not found', async () => {
      mockAssignmentsService.findOne.mockRejectedValue(
        new NotFoundException('Assignment with ID 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(
        new NotFoundException('Assignment with ID 999 not found'),
      );
    });
  });

  describe('findOneWithRemainingDays', () => {
    it('should return assignment with remaining days', async () => {
      const mockAssignment = {
        id: 1,
        patientId: 1,
        medicationId: 1,
        remainingDays: 25,
      };

      mockAssignmentsService.findOneWithRemainingDays.mockResolvedValue(
        mockAssignment,
      );

      const result = await controller.findOneWithRemainingDays(1);

      expect(
        mockAssignmentsService.findOneWithRemainingDays,
      ).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('update', () => {
    it('should update an assignment successfully', async () => {
      const updateAssignmentDto: UpdateAssignmentDto = {
        days: 45,
      };

      const updatedAssignment = {
        id: 1,
        patientId: 1,
        medicationId: 1,
        days: 45,
      };

      mockAssignmentsService.update.mockResolvedValue(updatedAssignment);

      const result = await controller.update(1, updateAssignmentDto);

      expect(mockAssignmentsService.update).toHaveBeenCalledWith(
        1,
        updateAssignmentDto,
      );
      expect(result).toEqual(updatedAssignment);
    });

    it('should throw NotFoundException when assignment not found', async () => {
      const updateAssignmentDto: UpdateAssignmentDto = {
        days: 45,
      };

      mockAssignmentsService.update.mockRejectedValue(
        new NotFoundException('Assignment with ID 999 not found'),
      );

      await expect(controller.update(999, updateAssignmentDto)).rejects.toThrow(
        new NotFoundException('Assignment with ID 999 not found'),
      );
    });
  });

  describe('remove', () => {
    it('should remove an assignment successfully', async () => {
      mockAssignmentsService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockAssignmentsService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when assignment not found', async () => {
      mockAssignmentsService.remove.mockRejectedValue(
        new NotFoundException('Assignment with ID 999 not found'),
      );

      await expect(controller.remove(999)).rejects.toThrow(
        new NotFoundException('Assignment with ID 999 not found'),
      );
    });
  });
});
