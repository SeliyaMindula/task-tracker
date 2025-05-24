import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(Number(id));
  }

  @Post()
  create(@Body() task: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(task);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.update(Number(id), updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(Number(id));
  }

  @Get('with-users')
  @ApiOkResponse({ description: 'List of tasks with user info', type: [Task] })
  findAllWithUsers(): Promise<Task[]> {
    return this.tasksService.findAllWithUsers();
  }
}
