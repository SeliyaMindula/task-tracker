import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  findAllWithUsers(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return task;
  }

  create(task: Partial<Task>): Promise<Task> {
    const newTask = this.tasksRepository.create(task);
    return this.tasksRepository.save(newTask);
  }

  async remove(id: number): Promise<void> {
    await this.tasksRepository.delete(id);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }
}
