import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const history = await prisma.history.findMany({
    where: { containerId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(history);
});

import { z } from 'zod';

const createHistoryEventSchema = z.object({
  event: z.string().min(1),
  description: z.string().min(1),
});

router.post('/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    const validation = createHistoryEventSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }

    const { event, description } = validation.data;

    const historyEvent = await prisma.history.create({
      data: {
        containerId,
        event,
        description,
      },
    });
    res.json(historyEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create history event' });
  }
});

export default router;
