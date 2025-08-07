import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(tasks);
});

import { z } from 'zod';
import { TaskStatus } from '@prisma/client';

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.nativeEnum(TaskStatus),
  assignee: z.string().min(1),
  containerId: z.string().optional(),
});

router.post('/', async (req, res) => {
  try {
    const validation = taskSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }
    const task = await prisma.task.create({
      data: validation.data,
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validation = taskSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }
    const task = await prisma.task.update({
      where: { id },
      data: validation.data,
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id },
    });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
