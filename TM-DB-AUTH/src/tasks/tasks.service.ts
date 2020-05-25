import { User } from './../auth/user.entity';
import { User } from 'src/auth/user.entity';
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

  async getTaskById(
    id:number,
    user:User
    ):Promise<Task>{
    const found = await this.taskRepository.findOne({
      where: {
        id,
        userId: user.id
      }
    });

    if(!found){
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return found;
  }

  async createTask(createTaskDto:CreateTaskDto, user:User){

    return this.taskRepository.createTask(createTaskDto,user);
  }

  async deleteTask(
    id:number,
    user:User):Promise<Task>{

    const task = this.getTaskById(id,user);
    return (await task).remove();
  }

  
  async updateTaskStatus(
    id:number,
    status:TaskStatus,
    user:User):Promise<Task>{
    const task = await this.getTaskById(id,user);
    task.status = status;
    await task.save();
    return task;
  }

  async getTasks(filterDto:GetTasksFilterDto, user:User){
      return this.taskRepository.getTasks(filterDto,user);
  }

}