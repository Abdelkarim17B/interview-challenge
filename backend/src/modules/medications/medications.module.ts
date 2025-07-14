import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationsService } from './medications.service';
import { MedicationsController } from './medications.controller';
import { Medication } from './medication.entity';
import { Assignment } from '../assignments/assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Medication, Assignment])],
  controllers: [MedicationsController],
  providers: [MedicationsService],
  exports: [MedicationsService],
})
export class MedicationsModule {}
