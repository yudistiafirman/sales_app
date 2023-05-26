export interface InvoiceCustomer {
    id: string;
    name?: string;
    displayName?: string;
    paymentType?: string;
    paymentCondition?: string;
    paymentDuration?: string;
}

export interface InvoiceProject {
    displayName?: string;
    id: string;
    name?: string;
    Customer?: InvoiceCustomer;
}

export interface InvoiceListData {
    dueDateDifference?: number;
    id?: string;
    number?: string;
    total?: number;
    status?:
        | "PARTIALLY_PAID"
        | "DELIVERED"
        | "CANCELLED"
        | "PAID"
        | "SUBMITTED";
    issuedDate?: Date;
    dueDate?: Date;
    Project?: InvoiceProject;
}
