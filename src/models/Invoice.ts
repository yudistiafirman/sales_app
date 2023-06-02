import { ProductDataInterface } from "@/interfaces";

export interface InvoiceCustomer {
    id: string;
    name?: string;
    displayName?: string;
    paymentType?: "CBD" | "CREDIT";
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
        | "PARTIALLY PAID"
        | "DELIVERED"
        | "CANCELLED"
        | "PAID"
        | "SUBMITTED";
    issuedDate?: Date;
    dueDate?: Date;
    Project?: InvoiceProject;
    paymentType?: "CBD" | "CREDIT";
}

export interface DeliverOrders {
    totalAdditionalPrice?: number;
    date?: Date;
    quantity?: number;
    SO?: {
        PoProd?: {
            ReqProd?: {
                offeringPrice?: number;
                Product?: ProductDataInterface;
            };
        };
    };
}

export interface InvoiceDetailTypeData {
    total?: number;
    dueDate?: Date;
    issuedDate?: Date;
    dueDateDifference?: number;
    paymentDuration?: number;
    amountPaid?: number;
    amountDue?: number;
    status?:
        | "PARTIALLY PAID"
        | "DELIVERED"
        | "CANCELLED"
        | "PAID"
        | "SUBMITTED";
    Project?: InvoiceProject;
    paymentType?: string;
    DeliveryOrders?: DeliverOrders[];
}
