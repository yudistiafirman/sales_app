import BrikApiFinance from "@/brikApi/BrikApiFinance";
import { customRequest } from "@/networking/request";

export const getAllInvoice = async (
    size?: string,
    page?: string,
    searchQuery?: string,
    paymentType?: string,
    paymentDuration?: string,
    status?: string,
    startDateIssued?: string,
    endDateIssued?: string,
    dueDateDifference?: string,
    batchingPlantId?: string
) =>
    customRequest(
        BrikApiFinance.getAllInvoice(
            page,
            size,
            searchQuery,
            paymentType,
            paymentDuration,
            status,
            startDateIssued,
            endDateIssued,
            dueDateDifference,
            batchingPlantId
        ),
        "GET",
        undefined,
        true
    );
export const getOneInvoice = async (id: string) =>
    customRequest(BrikApiFinance.getOneInvoice(id), "GET", undefined, true);

export const getAllPayment = async (
    page?: string,
    size?: string,
    batchingPlantId?: string
) =>
    customRequest(
        BrikApiFinance.payment(page, size, batchingPlantId),
        "GET",
        undefined,
        true
    );

export const getPaymentByID = async (id: string) =>
    customRequest(BrikApiFinance.getPaymentByID(id), "GET", undefined, true);

export const postPayment = async (payload: any) =>
    customRequest(BrikApiFinance.postPayment(), "POST", payload, true);
