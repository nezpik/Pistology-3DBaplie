// backend/src/services/edi/coarriParser.ts
import { Reader, Validator } from 'edifact';
import * as segments from 'edifact/segments';
import * as elements from 'edifact/elements';

// Define interfaces for the parsed data to match the Prisma models
interface CoarriMovement {
  containerId: string;
  movementType: string; // e.g., 'LOAD', 'DISCHARGE', 'SHIFT'
  stowageLocation?: string;
  isoContainerType?: string;
}

interface CoarriMessage {
  vesselName?: string;
  voyageNumber?: string;
  movements: CoarriMovement[];
}

export const parseCoarri = (coarriContent: string): CoarriMessage => {
  const validator = new Validator();
  validator.define(segments);
  validator.define(elements);

  const reader = new Reader({ validator, autoDetectEncoding: true });
  const segments = reader.parse(coarriContent);

  const coarriMessage: CoarriMessage = {
    movements: [],
  };

  let currentMovement: Partial<CoarriMovement> = {};

  for (const segment of segments) {
    switch (segment.name) {
      case 'TDT':
        // Vessel and voyage
        break;
      case 'NAD':
        // Carrier
        break;
      case 'EQD':
        // Container ID
        if (currentMovement.containerId) {
            coarriMessage.movements.push(currentMovement as CoarriMovement);
        }
        currentMovement = {};
        if (segment.elements[1] && segment.elements[1][0]) {
          currentMovement.containerId = segment.elements[1][0];
        }
        break;
      case 'RFF':
        // Booking number
        break;
      case 'FTX':
        // Movement type (e.g., 'LOAD', 'DISCHARGE')
        if (segment.elements[3] && segment.elements[3][0]) {
            currentMovement.movementType = segment.elements[3][0];
        }
        break;
      case 'UNT':
        if (currentMovement.containerId) {
            coarriMessage.movements.push(currentMovement as CoarriMovement);
        }
        break;
    }
  }

  return coarriMessage;
};
