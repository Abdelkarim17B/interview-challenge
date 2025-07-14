import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patient } from './patient.entity';
import { Assignment } from '../assignments/assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Assignment])],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
