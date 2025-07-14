import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './modules/patients/patients.module';
import { MedicationsModule } from './modules/medications/medications.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { Patient } from './modules/patients/patient.entity';
import { Medication } from './modules/medications/medication.entity';
import { Assignment } from './modules/assignments/assignment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Patient, Medication, Assignment],
      synchronize: true,
      logging: false,
    }),
    PatientsModule,
    MedicationsModule,
    AssignmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
