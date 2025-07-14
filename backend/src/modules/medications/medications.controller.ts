import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { Medication } from './medication.entity';

@ApiTags('Medications')
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new medication' })
  @ApiBody({ type: CreateMedicationDto })
  @ApiResponse({
    status: 201,
    description: 'Medication created successfully',
    type: Medication,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async create(
    @Body(ValidationPipe) createMedicationDto: CreateMedicationDto,
  ): Promise<Medication> {
    return await this.medicationsService.create(createMedicationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all medications' })
  @ApiResponse({
    status: 200,
    description: 'List of medications with their assignments',
    type: [Medication],
  })
  async findAll(): Promise<Medication[]> {
    return await this.medicationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a medication by ID' })
  @ApiParam({ name: 'id', description: 'Medication ID' })
  @ApiResponse({
    status: 200,
    description: 'Medication found',
    type: Medication,
  })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Medication> {
    return await this.medicationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a medication' })
  @ApiParam({ name: 'id', description: 'Medication ID' })
  @ApiBody({ type: UpdateMedicationDto })
  @ApiResponse({
    status: 200,
    description: 'Medication updated successfully',
    type: Medication,
  })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateMedicationDto: UpdateMedicationDto,
  ): Promise<Medication> {
    return await this.medicationsService.update(id, updateMedicationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a medication' })
  @ApiParam({ name: 'id', description: 'Medication ID' })
  @ApiResponse({ status: 204, description: 'Medication deleted successfully' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.medicationsService.remove(id);
  }
}
