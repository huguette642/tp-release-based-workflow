import { Task as PrismaTask } from '@prisma/client';

export class Task implements PrismaTask {
  id: number;
  title: string;
  content: string | null;
  done: boolean;
  createdAt: Date;
}
