import { OperationFileType } from '@/interfaces/Operation';

export interface updateDeliverOrder {
  deliveryOrderId: string;
  doFiles: { fileId: string; type: OperationFileType }[];
  recipientName: string;
  recipientNumber: string;
  conditionTruck: string;
  status?: string;
  weight: string;
}
