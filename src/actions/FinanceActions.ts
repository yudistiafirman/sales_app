import BrikApiFinance from "@/brikApi/BrikApiFinance";
import { customRequest } from "@/networking/request";

export const getAllInvoice = async (
    size?: string,
    page?: string,
    searchQuery?: string
) =>
    customRequest(
        BrikApiFinance.getAllInvoice(page, size, searchQuery),
        "GET",
        undefined,
        true
    );

export const postPayment = async (payload: any) =>
    customRequest(BrikApiFinance.postPayment(), "POST", payload, true);
