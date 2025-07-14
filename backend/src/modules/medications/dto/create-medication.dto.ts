import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicationDto {
  @ApiProperty({ description: 'Medication name', example: 'Aspirin', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Medication dosage', example: '100mg', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  dosage: string;

  @ApiProperty({ description: 'Medication frequency', example: 'Once daily', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  frequency: string;
}
