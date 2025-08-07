import { Router } from 'express';
import prisma from '../db';

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

import { z } from 'zod';

const updateLocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

router.post('/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    const validation = updateLocationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }

    const { lat, lng } = validation.data;

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
