import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const customsInspections = await prisma.customsInspection.findMany({
    where: { containerId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(customsInspections);
});

import { z } from 'zod';
import { InspectionStatus } from '@prisma/client';

const createCustomsInspectionSchema = z.object({
  status: z.nativeEnum(InspectionStatus),
  notes: z.string().optional(),
  inspectedBy: z.string().min(1),
});

router.post('/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    const validation = createCustomsInspectionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }

    const { status, notes, inspectedBy } = validation.data;

    const customsInspection = await prisma.customsInspection.create({
      data: {
        containerId,
        status,
        notes: notes || '',
        inspectedBy,
      },
    });
    res.json(customsInspection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customs inspection' });
  }
});

export default router;
