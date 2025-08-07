import { Router } from 'express';
import prisma from '../db';
import { parseBaplie } from '../services/baplieService';
import { z } from 'zod';

const router = Router();

const parseBaplieSchema = z.object({
  baplieContent: z.string().min(1),
});

router.post('/parse', async (req, res) => {
  try {
    const validation = parseBaplieSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }

    const { baplieContent } = validation.data;

    const containers = parseBaplie(baplieContent);

    await prisma.container.createMany({
      data: containers,
      skipDuplicates: true,
    });

    res.json(containers);
  } catch (error) {
    console.error('Error parsing BAPLIE:', error);
    res.status(500).json({ error: 'Failed to parse BAPLIE message' });
  }
});

export default router;
