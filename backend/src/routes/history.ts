import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const history = await prisma.history.findMany({
    where: { containerId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(history);
});

router.post('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const { event, description } = req.body;

  try {
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
