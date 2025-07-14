import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from './medication.entity';
import { Assignment } from '../assignments/assignment.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationsRepository: Repository<Medication>,
    @InjectRepository(Assignment)
    private readonly assignmentsRepository: Repository<Assignment>,
  ) {}

  async create(createMedicationDto: CreateMedicationDto): Promise<Medication> {
    const medication = this.medicationsRepository.create(createMedicationDto);
    return await this.medicationsRepository.save(medication);
  }

  async findAll(): Promise<Medication[]> {
    return await this.medicationsRepository.find({
      relations: ['assignments', 'assignments.patient'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Medication> {
    const medication = await this.medicationsRepository.findOne({
      where: { id },
      relations: ['assignments', 'assignments.patient'],
    });

    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }

    return medication;
  }

  async update(id: number, updateMedicationDto: UpdateMedicationDto): Promise<Medication> {
    const medication = await this.findOne(id);
    Object.assign(medication, updateMedicationDto);
    return await this.medicationsRepository.save(medication);
  }

  async remove(id: number): Promise<void> {
    const medication = await this.findOne(id);
    
    // First, delete all related assignments
    await this.assignmentsRepository.delete({ medicationId: id });
    
    // Then delete the medication
    await this.medicationsRepository.remove(medication);
  }
}
