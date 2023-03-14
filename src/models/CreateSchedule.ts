export interface CreateSchedule {
  saleOrderId: string;
  projectId: string;
  purchaseOrderId: string;
  quotationLetterId: string;
  quantity: number;
  date: number;
  withPump: boolean;
  consecutive: boolean;
  withTechnician: boolean;
  status: string;
}
