export interface CreateDeposit {
  projectId: string;
  quotationLetterId: string;
  purchaseOrderId: string;
  value: number;
  paymentDate: number;
  status: string;
  files: FileDepost[];
}

interface FileDepost {
  fileId: string;
}
