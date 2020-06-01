import { TaskRepository } from './task.repository';
import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  remove: jest.fn(),
});

const mockUser = { id: 12, username: 'Test user' };

describe('Task service', () => {
  let taskService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    taskService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('Gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some query',
      };

      const result = await taskService.getTasks(filters, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled();

      expect(result).toEqual('someValue');
    });
  });

  describe('Get task by id', () => {
    it('Calls taskRepository find one', async () => {
      const mockTask = { title: 'Test task', description: '' };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalled();
    });

    it('throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);

      expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Create Task', () => {
    it('call taskrepository.create() and returns the result', async () => {
      taskRepository.createTask.mockResolvedValue('someTask');

      expect(taskRepository.createTask).not.toHaveBeenCalled();

      const createTaskDto = { title: 'Test task', description: 'Test desc' };
      const result = await taskService.createTask(createTaskDto, mockUser);

      expect(taskRepository.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );

      expect(result).toEqual('someTask');
    });
  });

  describe('Delete a task', () => {
    // it('call taskRepository.deleteTask', async () => {
    //   taskRepository.remove.mockResolvedValue({id: 1});
    //   expect(taskRepository.remove).not.toHaveBeenCalled();
    //   await taskService.deleteTask(1,mockUser);
    //   expect(taskRepository.remove).toHaveBeenCalledWith({id:1,userId:mockUser.id})
    // });

    it('throws an error as task could not been deleted', () => {
      taskRepository.remove.mockResolvedValue(null);
      expect(taskService.deleteTask(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Update task Status', () => {
    it('update task status', async () => {

      const save = jest.fn().mockResolvedValue(true);

      taskService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save
      });

      expect(taskService.getTaskById).not.toHaveBeenCalled();
      const result = await taskService.updateTaskStatus(1,TaskStatus.DONE, mockUser);
      expect(taskService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();

      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
