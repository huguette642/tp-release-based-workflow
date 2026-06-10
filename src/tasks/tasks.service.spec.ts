import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';

// Mock de PrismaService — aucune base de données réelle n'est nécessaire
const mockPrismaService = {
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('crée une tâche et la retourne', async () => {
      const dto = { title: 'Tâche de test' };
      const expected = { id: 1, title: 'Tâche de test', content: null, done: false, createdAt: new Date() };
      mockPrismaService.task.create.mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(mockPrismaService.task.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('retourne la liste de toutes les tâches', async () => {
      const tasks = [
        { id: 1, title: 'Tâche 1', content: null, done: false, createdAt: new Date() },
        { id: 2, title: 'Tâche 2', content: null, done: true, createdAt: new Date() },
      ];
      mockPrismaService.task.findMany.mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(mockPrismaService.task.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it("retourne la tâche correspondant à l'ID", async () => {
      const task = { id: 1, title: 'Tâche 1', content: null, done: false, createdAt: new Date() };
      mockPrismaService.task.findUnique.mockResolvedValue(task);

      const result = await service.findOne(1);

      expect(result).toEqual(task);
    });

    it("lève une NotFoundException si la tâche n'existe pas", async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('met à jour et retourne la tâche modifiée', async () => {
      const existing = { id: 1, title: 'Tâche 1', content: null, done: false, createdAt: new Date() };
      const updated = { ...existing, done: true };
      mockPrismaService.task.findUnique.mockResolvedValue(existing);
      mockPrismaService.task.update.mockResolvedValue(updated);

      const result = await service.update(1, { done: true });

      expect(result.done).toBe(true);
    });
  });

  describe('remove', () => {
    it('supprime et retourne la tâche supprimée', async () => {
      const task = { id: 1, title: 'Tâche 1', content: null, done: false, createdAt: new Date() };
      mockPrismaService.task.findUnique.mockResolvedValue(task);
      mockPrismaService.task.delete.mockResolvedValue(task);

      const result = await service.remove(1);

      expect(result).toEqual(task);
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  // TODO (Release-Based Workflow — branche feature/add-task-stats issue de main) : implémenter getStats() dans TasksService,
  // puis décommenter et adapter ce bloc de test.
  //
  // describe('getStats', () => {
  //   it('retourne le total, le nombre de tâches terminées et en attente', async () => {
  //     const tasks = [
  //       { id: 1, title: 'Tâche 1', content: null, done: false, createdAt: new Date() },
  //       { id: 2, title: 'Tâche 2', content: null, done: true,  createdAt: new Date() },
  //       { id: 3, title: 'Tâche 3', content: null, done: false, createdAt: new Date() },
  //     ];
  //     mockPrismaService.task.findMany.mockResolvedValue(tasks);
  //
  //     const result = await service.getStats();
  //
  //     expect(result).toEqual({ total: 3, done: 1, pending: 2 });
  //   });
  // });
});
