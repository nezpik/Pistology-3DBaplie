import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const location = await prisma.location.findUnique({
    where: { containerId },
  });
  if (location) {
    res.json(location);
  } else {
    res.status(404).json({ error: 'Location not found' });
  }
});

router.post('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const { lat, lng } = req.body;

  try {
    const location = await prisma.location.upsert({
      where: { containerId },
      update: { lat, lng },
      create: { containerId, lat, lng },
    });
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update location' });
  }
});

export default router;
