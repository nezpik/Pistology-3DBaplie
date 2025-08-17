// backend/src/services/edi/baplieParser.ts
import { Reader, Validator } from 'edifact';
import * as segments from 'edifact/segments';
import * as elements from 'edifact/elements';

// Define interfaces for the parsed data to match the Prisma models
interface BaplieContainer {
  containerId: string;
  bay: number;
  row: number;
  tier: number;
  size: string;
  type: string;
  weight?: number;
}

interface BaplieMessage {
  vesselName?: string;
  voyageNumber?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  containers: BaplieContainer[];
}

export const parseBaplie = (baplieContent: string): BaplieMessage => {
  const validator = new Validator();
  validator.define(segments);
  validator.define(elements);

  const reader = new Reader({ validator, autoDetectEncoding: true });
  const segments = reader.parse(baplieContent);

  const baplieMessage: BaplieMessage = {
    containers: [],
  };

  let currentContainer: Partial<BaplieContainer> = {};
  let inContainerGroup = false;

  for (const segment of segments) {
    switch (segment.name) {
      case 'TDT':
        // TDT+20+VOY1234+1++MSC:172:20:MSC SARA ELENA'
        if (segment.elements[1] && segment.elements[1][0]) {
          baplieMessage.voyageNumber = segment.elements[1][0];
        }
        if (segment.elements[4] && segment.elements[4][3]) {
          baplieMessage.vesselName = segment.elements[4][3];
        }
        break;
      case 'LOC':
        if (inContainerGroup) {
          // LOC+147+BAYROWTIER' (e.g. 0010102)
          if (segment.elements[1] && segment.elements[1][0]) {
            const location = segment.elements[1][0];
            currentContainer.bay = parseInt(location.substring(0, 3), 10);
            currentContainer.row = parseInt(location.substring(3, 5), 10);
            currentContainer.tier = parseInt(location.substring(5, 7), 10);
          }
        } else {
          // Port of Loading / Discharge
          // LOC+5+POL'
          // LOC+61+POD'
          if (segment.elements[0] && segment.elements[0][0]) {
            if (segment.elements[0][0] === '5' && segment.elements[1] && segment.elements[1][0]) {
              baplieMessage.portOfLoading = segment.elements[1][0];
            }
            if (segment.elements[0][0] === '61' && segment.elements[1] && segment.elements[1][0]) {
              baplieMessage.portOfDischarge = segment.elements[1][0];
            }
          }
        }
        break;
      case 'EQD':
        // Start of a new container
        inContainerGroup = true;
        if (currentContainer.bay && currentContainer.containerId) {
            baplieMessage.containers.push(currentContainer as BaplieContainer);
        }
        currentContainer = {};

        // EQD+CN+CONTAINERID+45G1:102:5'
        if (segment.elements[1] && segment.elements[1][0]) {
          currentContainer.containerId = segment.elements[1][0];
        }
        if (segment.elements[2] && segment.elements[2][0]) {
            const sizeType = segment.elements[2][0];
            currentContainer.size = sizeType.substring(0, 2);
            currentContainer.type = sizeType.substring(2);
        }
        break;
      case 'MEA':
        // MEA+WT++KGM:12345'
        if (segment.elements[0] && segment.elements[0][0] && segment.elements[0][0] === 'WT') {
            if (segment.elements[2] && segment.elements[2][1]) {
                currentContainer.weight = parseFloat(segment.elements[2][1]);
            }
        }
        break;
      case 'UNT':
        // End of message, add the last container
        if (currentContainer.bay && currentContainer.containerId) {
            baplieMessage.containers.push(currentContainer as BaplieContainer);
        }
        inContainerGroup = false;
        break;
    }
  }

  return baplieMessage;
};
