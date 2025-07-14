import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { Assignment } from '../assignments/assignment.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    @InjectRepository(Assignment)
    private readonly assignmentsRepository: Repository<Assignment>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientsRepository.create({
      ...createPatientDto,
      dateOfBirth: new Date(createPatientDto.dateOfBirth),
    });
    return await this.patientsRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return await this.patientsRepository.find({
      relations: ['assignments', 'assignments.medication'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { id },
      relations: ['assignments', 'assignments.medication'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    
    const updateData = {
      ...updatePatientDto,
      ...(updatePatientDto.dateOfBirth && { dateOfBirth: new Date(updatePatientDto.dateOfBirth) }),
    };

    Object.assign(patient, updateData);
    return await this.patientsRepository.save(patient);
  }

  async remove(id: number): Promise<void> {
    const patient = await this.findOne(id);
    
    // First, delete all related assignments
    await this.assignmentsRepository.delete({ patientId: id });
    
    // Then delete the patient
    await this.patientsRepository.remove(patient);
  }
}
