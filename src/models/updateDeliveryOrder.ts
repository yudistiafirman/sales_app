import { OperationFileType } from '@/interfaces/Operation';

export interface updateDeliverOrder {
  deliveryOrderId: string;
  doFiles: { fileId: string; type: OperationFileType }[];
  recepientName: string;
  recipientNumber: string;
  conditionTruck: string;
}
