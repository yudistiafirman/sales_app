import { Platform } from "react-native";
import Config from "react-native-config";

const API_URL =
    Platform.OS === "android"
        ? Config.API_URL_FINANCE
        : __DEV__
        ? Config.API_URL_FINANCE
        : Config.API_URL_FINANCE_PROD;

export default class BrikApiFinance {
    static postPayment = () => {
        const url = new URL(`${API_URL}/finance/m/payment`);
        return url.toString();
    };

    static getPaymentByID = (id: string) => {
        const url = new URL(`${API_URL}/finance/m/payment/${id}`);
        return url.toString();
    };

    static payment = (
        page?: string,
        size?: string,
        batchingPlantId?: string
    ) => {
        const url = new URL(`${API_URL}/finance/m/payment`);
        const params = url.searchParams;
        params.append("type", "DEPOSIT");
        if (page) {
            params.append("page", page);
        }
        if (size) {
            params.append("size", size);
        }
        if (batchingPlantId) {
            params.append("batchingPlantId", batchingPlantId);
        }
        return url.toString();
    };

    static getAllInvoice = (
        page?: string,
        size?: string,
        searchQuery?: string,
        paymentType?: string,
        paymentDuration?: string,
        status?: string,
        startDateIssued?: string,
        endDateIssued?: string,
        dueDateDifference?: string,
        batchingPlantId?: string
    ) => {
        const url = new URL(`${API_URL}/finance/m/invoice`);
        const params = url.searchParams;
        if (page) {
            params.append("page", page);
        }
        if (size) {
            params.append("size", size);
        }
        if (searchQuery) {
            params.append("search", searchQuery);
        }
        if (paymentType) {
            params.append("paymentType", paymentType);
        }
        if (paymentDuration) {
            params.append("paymentDuration", paymentDuration);
        }
        if (status) {
            params.append("status", status);
        }
        if (startDateIssued) {
            params.append("startDateIssued", startDateIssued);
        }
        if (endDateIssued) {
            params.append("endDateIssued", endDateIssued);
        }
        if (dueDateDifference) {
            params.append("dueDateDifference", dueDateDifference);
        }
        if (batchingPlantId) {
            params.append("batchingPlantId", batchingPlantId);
        }
        return url.toString();
    };

    static getOneInvoice = (id: string) => {
        const url = new URL(`${API_URL}/finance/m/invoice/${id}`);
        return url.toString();
    };
}
