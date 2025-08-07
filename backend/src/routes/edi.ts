import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const ediMessages = await prisma.ediMessage.findMany({
    where: { containerId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(ediMessages);
});

import { z } from 'zod';

const createEdiMessageSchema = z.object({
  messageType: z.string().min(1),
  content: z.string().min(1),
});

router.post('/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    const validation = createEdiMessageSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }

    const { messageType, content } = validation.data;

    const ediMessage = await prisma.ediMessage.create({
      data: {
        containerId,
        messageType,
        content,
      },
    });
    res.json(ediMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create EDI message' });
  }
});

export default router;
