import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Patient } from '../patients/patient.entity';
import { Medication } from '../medications/medication.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'integer' })
  days: number;

  @Column({ type: 'integer' })
  patientId: number;

  @Column({ type: 'integer' })
  medicationId: number;

  @ManyToOne(() => Patient, patient => patient.assignments)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @ManyToOne(() => Medication, medication => medication.assignments)
  @JoinColumn({ name: 'medicationId' })
  medication: Medication;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Computed field for remaining days
  get remainingDays(): number {
    const today = new Date();
    const endDate = new Date(this.startDate);
    endDate.setDate(endDate.getDate() + this.days);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}
