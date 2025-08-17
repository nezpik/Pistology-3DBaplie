import { Router } from 'express';
import prisma from '../db';
import { parseBaplie } from '../services/edi/baplieParser';
import { parseCoarri } from '../services/edi/coarriParser';
import { parseCodeco } from '../services/edi/codecoParser';

const router = Router();

router.get('/:containerId', async (req, res) => {
  const { containerId } = req.params;
  const ediMessages = await prisma.ediMessage.findMany({
    where: { containerId },
    orderBy: { createdAt: 'desc' },
    include: {
        baplieMessage: { include: { containers: true } },
        coarriMessage: { include: { movements: true } },
        codecoMessage: { include: { movements: true } },
    }
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

    await prisma.$transaction(async (tx) => {
      const ediMessage = await tx.ediMessage.create({
        data: {
          containerId,
          messageType,
          content,
        },
      });

      switch (messageType.toUpperCase()) {
        case 'BAPLIE':
          const baplieData = parseBaplie(content);
          await tx.baplieMessage.create({
            data: {
              ediMessageId: ediMessage.id,
              vesselName: baplieData.vesselName,
              voyageNumber: baplieData.voyageNumber,
              portOfLoading: baplieData.portOfLoading,
              portOfDischarge: baplieData.portOfDischarge,
              containers: {
                create: baplieData.containers,
              },
            },
          });
          break;
        case 'COARRI':
          const coarriData = parseCoarri(content);
          await tx.coarriMessage.create({
              data: {
                  ediMessageId: ediMessage.id,
                  vesselName: coarriData.vesselName,
                  voyageNumber: coarriData.voyageNumber,
                  movements: {
                      create: coarriData.movements,
                  },
              }
          });
          break;
        case 'CODECO':
          const codecoData = parseCodeco(content);
          await tx.codecoMessage.create({
              data: {
                  ediMessageId: ediMessage.id,
                  gate: codecoData.gate,
                  movements: {
                      create: codecoData.movements,
                  },
              }
          });
          break;
        default:
          // For unknown message types, we just store the raw message.
          break;
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create EDI message' });
  }
});

export default router;
