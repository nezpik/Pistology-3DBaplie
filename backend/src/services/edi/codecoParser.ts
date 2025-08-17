// backend/src/services/edi/codecoParser.ts
import { Reader, Validator } from 'edifact';
import * as segments from 'edifact/segments';
import * as elements from 'edifact/elements';

// Define interfaces for the parsed data to match the Prisma models
interface CodecoMovement {
  containerId: string;
  movementType: string; // 'IN' or 'OUT'
  truckLicensePlate?: string;
  isoContainerType?: string;
}

interface CodecoMessage {
  gate?: string;
  movements: CodecoMovement[];
}

export const parseCodeco = (codecoContent: string): CodecoMessage => {
  const validator = new Validator();
  validator.define(segments);
  validator.define(elements);

  const reader = new Reader({ validator, autoDetectEncoding: true });
  const segments = reader.parse(codecoContent);

  const codecoMessage: CodecoMessage = {
    movements: [],
  };

  let currentMovement: Partial<CodecoMovement> = {};

  for (const segment of segments) {
    switch (segment.name) {
      case 'TDT':
        // Truck license plate
        if (segment.elements[4] && segment.elements[4][1]) {
            currentMovement.truckLicensePlate = segment.elements[4][1];
        }
        break;
      case 'NAD':
        // Carrier
        break;
      case 'EQD':
        // Container ID
        if (currentMovement.containerId) {
            codecoMessage.movements.push(currentMovement as CodecoMovement);
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
        // Movement type (e.g., 'IN', 'OUT')
        if (segment.elements[3] && segment.elements[3][0]) {
            currentMovement.movementType = segment.elements[3][0];
        }
        break;
      case 'UNT':
        if (currentMovement.containerId) {
            codecoMessage.movements.push(currentMovement as CodecoMovement);
        }
        break;
    }
  }

  return codecoMessage;
};
