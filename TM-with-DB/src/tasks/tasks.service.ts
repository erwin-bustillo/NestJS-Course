import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository:TaskRepository
  ) {}

  async getTaskById(id:number):Promise<Task>{
    const found = await this.taskRepository.findOne(id);

    if(!found){
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return found;
  }

  async createTask(createTaskDto:CreateTaskDto){

    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id:number):Promise<Task>{

    const task = this.getTaskById(id);
    return (await task).remove();
  }

  
  async updateTaskStatus(id:number,status:TaskStatus):Promise<Task>{
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  async getTasks(filterDto:GetTasksFilterDto){
      return this.taskRepository.getTasks(filterDto);
  }

}
