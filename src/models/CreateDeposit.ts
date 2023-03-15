export interface CreateDeposit {
  projectId: string;
  quotationLetterId: string;
  purchaseOrderId: string;
  value: number;
  paymentDate: string;
  status: string;
  files?: FileDeposit[];
}

export interface FileDeposit {
  fileId: string;
}
