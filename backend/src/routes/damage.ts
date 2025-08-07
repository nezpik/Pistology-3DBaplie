import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const damageReports = await prisma.damageReport.findMany({
    where: { containerId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(damageReports);
});

import { z } from 'zod';

const createDamageReportSchema = z.object({
  description: z.string().min(1),
  reportedBy: z.string().min(1),
  photos: z.array(z.string().url()),
});

router.post('/:containerId', async (req, res) => {
  try {
    const { containerId } = req.params;
    const validation = createDamageReportSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }

    const { description, reportedBy, photos } = validation.data;

    const damageReport = await prisma.damageReport.create({
      data: {
        containerId,
        description,
        reportedBy,
        photos,
      },
    });
    res.json(damageReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create damage report' });
  }
});

export default router;
