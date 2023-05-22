export interface CreateSchedule {
    saleOrderId: string;
    projectId: string;
    purchaseOrderId: string;
    quotationLetterId: string;
    quantity: number;
    date: string;
    pouringMethod: string;
    consecutive: boolean;
    withTechnician: boolean;
    status: string;
}
