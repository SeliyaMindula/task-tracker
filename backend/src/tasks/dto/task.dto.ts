import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../task.entity';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Finish project report', description: 'Title of the task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Complete the final report and submit by Friday', description: 'Detailed description of the task', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: TaskStatus.TODO, enum: TaskStatus, description: 'Status of the task', required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ example: 1, description: 'ID of the user who owns the task', required: false })
  userId?: number;
}

export class UpdateTaskDto {
  @ApiProperty({ example: 'Finish project report', description: 'Title of the task', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Complete the final report and submit by Friday', description: 'Detailed description of the task', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: TaskStatus.IN_PROGRESS, enum: TaskStatus, description: 'Status of the task', required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}