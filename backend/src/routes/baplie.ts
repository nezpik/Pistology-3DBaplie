import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.post('/parse', async (req, res) => {
  const { baplieContent } = req.body;

  if (!baplieContent) {
    return res.status(400).json({ error: 'BAPLIE content is required' });
  }

  try {
    // Placeholder for BAPLIE parsing logic
    const containers = parseBaplie(baplieContent);

    // Save the parsed containers to the database
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

function parseBaplie(baplieContent: string): any[] {
  const containers: any[] = [];
  const segments = baplieContent.split("'");

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].trim();
    if (segment.startsWith('EQD+CN+')) {
      const parts = segment.split('+');
      const containerId = parts[2];
      const typeSize = parts[3].split(':')[0];

      let size = '20';
      if (typeSize.startsWith('4')) {
        size = '40';
      } else if (typeSize.startsWith('L')) {
        size = '45';
      }

      let type = 'GP';
      if (typeSize.includes('R')) {
        type = 'RE';
      } else if (typeSize.includes('OT') || typeSize.includes('UT')) {
        type = 'OT';
      }

      // Find the corresponding LOC segment
      if (i + 1 < segments.length) {
        const locSegment = segments[i + 1].trim();
        if (locSegment.startsWith('LOC+147+')) {
          const locParts = locSegment.split('+');
          const location = locParts[2];
          const bay = parseInt(location.substring(0, 2));
          const row = parseInt(location.substring(2, 4));
          const tier = parseInt(location.substring(4, 6));

          containers.push({
            containerId,
            bay,
            row,
            tier,
            size,
            type,
          });
        }
      }
    }
  }

  return containers;
}

export default router;
