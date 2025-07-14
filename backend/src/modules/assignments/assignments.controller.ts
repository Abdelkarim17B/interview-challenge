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
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './assignment.entity';

@ApiTags('Assignments')
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new medication assignment' })
  @ApiBody({ type: CreateAssignmentDto })
  @ApiResponse({
    status: 201,
    description: 'Assignment created successfully',
    type: Assignment,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 404, description: 'Patient or medication not found' })
  async create(
    @Body(ValidationPipe) createAssignmentDto: CreateAssignmentDto,
  ): Promise<Assignment> {
    return await this.assignmentsService.create(createAssignmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments' })
  @ApiResponse({
    status: 200,
    description: 'List of assignments with patient and medication details',
    type: [Assignment],
  })
  async findAll(): Promise<Assignment[]> {
    return await this.assignmentsService.findAll();
  }

  @Get('with-remaining-days')
  @ApiOperation({
    summary: 'Get all assignments with calculated remaining days',
  })
  @ApiResponse({
    status: 200,
    description: 'List of assignments with remaining days calculated',
  })
  async findAllWithRemainingDays(): Promise<
    (Assignment & { remainingDays: number })[]
  > {
    return await this.assignmentsService.findAllWithRemainingDays();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an assignment by ID' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({
    status: 200,
    description: 'Assignment found',
    type: Assignment,
  })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Assignment> {
    return await this.assignmentsService.findOne(id);
  }

  @Get(':id/with-remaining-days')
  @ApiOperation({
    summary: 'Get an assignment by ID with calculated remaining days',
  })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({
    status: 200,
    description: 'Assignment found with remaining days calculated',
  })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async findOneWithRemainingDays(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Assignment & { remainingDays: number }> {
    return await this.assignmentsService.findOneWithRemainingDays(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an assignment' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiBody({ type: UpdateAssignmentDto })
  @ApiResponse({
    status: 200,
    description: 'Assignment updated successfully',
    type: Assignment,
  })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<Assignment> {
    return await this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an assignment' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({ status: 204, description: 'Assignment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.assignmentsService.remove(id);
  }
}
