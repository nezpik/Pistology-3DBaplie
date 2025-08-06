import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const ediMessages = await prisma.ediMessage.findMany({
    where: { containerId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(ediMessages);
});

router.post('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const { messageType, content } = req.body;

  try {
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
