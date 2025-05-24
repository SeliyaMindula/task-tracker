import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Finish project report', description: 'Title of the task' })
  title: string;

  @ApiProperty({ example: 'Complete the final report and submit by Friday', description: 'Detailed description of the task', required: false })
  description?: string;

  @ApiProperty({ example: false, description: 'Task completion status', required: false })
  completed?: boolean;

  @ApiProperty({ example: 1, description: 'ID of the user who owns the task', required: false })
  userId?: number;
}

export class UpdateTaskDto {
  @ApiProperty({ example: 'Finish project report', description: 'Title of the task', required: false })
  title?: string;

  @ApiProperty({ example: 'Complete the final report and submit by Friday', description: 'Detailed description of the task', required: false })
  description?: string;

  @ApiProperty({ example: true, description: 'Task completion status', required: false })
  completed?: boolean;
}
