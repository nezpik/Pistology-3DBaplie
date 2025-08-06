import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const damageReports = await prisma.damageReport.findMany({
    where: { containerId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(damageReports);
});

router.post('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const { description, reportedBy, photos } = req.body;

  try {
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
