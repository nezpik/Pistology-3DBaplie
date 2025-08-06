import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const customsInspections = await prisma.customsInspection.findMany({
    where: { containerId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(customsInspections);
});

router.post('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const { status, notes, inspectedBy } = req.body;

  try {
    const customsInspection = await prisma.customsInspection.create({
      data: {
        containerId,
        status,
        notes,
        inspectedBy,
      },
    });
    res.json(customsInspection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customs inspection' });
  }
});

export default router;
