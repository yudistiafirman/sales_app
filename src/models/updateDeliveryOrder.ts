import { OperationFileType } from "@/interfaces/Operation";

export interface UpdateDeliverOrder {
    deliveryOrderId: string;
    doFiles: { fileId: string; type: OperationFileType }[];
    recipientName: string;
    recipientNumber: string;
    conditionTruck: string;
    status?: string;
    weight: string;
}
