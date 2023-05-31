export interface CreatePayment {
    projectId: string;
    amount: number;
    paymentDate: string;
    status: string;
    saleOrderId: string;
    type: string; // DEPOSIT | INVOICE
    files?: FilePayment[];
}

export interface FilePayment {
    fileId: string;
}
