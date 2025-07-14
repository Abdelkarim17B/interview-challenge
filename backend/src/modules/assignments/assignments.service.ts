import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { PatientsService } from '../patients/patients.service';
import { MedicationsService } from '../medications/medications.service';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentsRepository: Repository<Assignment>,
    private readonly patientsService: PatientsService,
    private readonly medicationsService: MedicationsService,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    // Validate patient exists
    await this.patientsService.findOne(createAssignmentDto.patientId);
    
    // Validate medication exists
    await this.medicationsService.findOne(createAssignmentDto.medicationId);

    const assignment = this.assignmentsRepository.create({
      ...createAssignmentDto,
      startDate: new Date(createAssignmentDto.startDate),
    });

    return await this.assignmentsRepository.save(assignment);
  }

  async findAll(): Promise<Assignment[]> {
    return await this.assignmentsRepository.find({
      relations: ['patient', 'medication'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Assignment> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: ['patient', 'medication'],
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async update(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment> {
    const assignment = await this.findOne(id);

    // Validate patient exists if patientId is being updated
    if (updateAssignmentDto.patientId) {
      await this.patientsService.findOne(updateAssignmentDto.patientId);
    }

    // Validate medication exists if medicationId is being updated
    if (updateAssignmentDto.medicationId) {
      await this.medicationsService.findOne(updateAssignmentDto.medicationId);
    }

    const updateData = {
      ...updateAssignmentDto,
      ...(updateAssignmentDto.startDate && { startDate: new Date(updateAssignmentDto.startDate) }),
    };

    Object.assign(assignment, updateData);
    return await this.assignmentsRepository.save(assignment);
  }

  async remove(id: number): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentsRepository.remove(assignment);
  }

  /**
   * Calculate remaining days for a treatment assignment
   * @param startDate - The start date of the treatment
   * @param days - Total treatment days
   * @returns Number of remaining days (0 if treatment is completed)
   */
  calculateRemainingDays(startDate: Date, days: number): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + days);
    
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }

  /**
   * Get all assignments with calculated remaining days
   */
  async findAllWithRemainingDays(): Promise<(Assignment & { remainingDays: number })[]> {
    const assignments = await this.findAll();
    
    return assignments.map(assignment => ({
      ...assignment,
      remainingDays: this.calculateRemainingDays(assignment.startDate, assignment.days),
    }));
  }

  /**
   * Get assignment by ID with calculated remaining days
   */
  async findOneWithRemainingDays(id: number): Promise<Assignment & { remainingDays: number }> {
    const assignment = await this.findOne(id);
    
    return {
      ...assignment,
      remainingDays: this.calculateRemainingDays(assignment.startDate, assignment.days),
    };
  }
}
