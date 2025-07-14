import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({ description: 'Patient ID', example: 1 })
  @IsNumber()
  @IsPositive()
  patientId: number;

  @ApiProperty({ description: 'Medication ID', example: 1 })
  @IsNumber()
  @IsPositive()
  medicationId: number;

  @ApiProperty({ description: 'Treatment start date', example: '2024-01-01' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'Number of treatment days', example: 30 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  days: number;
}
