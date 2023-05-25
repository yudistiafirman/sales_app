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

    static getAllInvoice = (
        page?: string,
        size?: string,
        searchQuery?: string
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
        return url.toString();
    };
}
