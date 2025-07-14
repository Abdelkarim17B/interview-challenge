import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { Assignment } from './assignment.entity';
import { PatientsModule } from '../patients/patients.module';
import { MedicationsModule } from '../medications/medications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment]),
    PatientsModule,
    MedicationsModule,
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
