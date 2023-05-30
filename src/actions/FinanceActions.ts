import BrikApiFinance from "@/brikApi/BrikApiFinance";
import { customRequest } from "@/networking/request";

export const getAllInvoice = async (
    size?: string,
    page?: string,
    searchQuery?: string,
    paymentMethod?: string,
    paymentDuration?: string,
    status?: string,
    startDateIssued?: string,
    endDateIssued?: string,
    dueDateDifference?: string
) =>
    customRequest(
        BrikApiFinance.getAllInvoice(
            page,
            size,
            searchQuery,
            paymentMethod,
            paymentDuration,
            status,
            startDateIssued,
            endDateIssued,
            dueDateDifference
        ),
        "GET",
        undefined,
        true
    );

export const postPayment = async (payload: any) =>
    customRequest(BrikApiFinance.postPayment(), "POST", payload, true);
