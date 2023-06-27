import { Platform } from "react-native";
import "intl";
import "intl/locale-data/jsonp/id-ID";

const trimCurrencyFormat = (
    input: string,
    originAmount: number,
    withoutRp: boolean
): string => {
    let result = input;
    if (result?.includes("IDR")) {
        result = result?.replace("IDR ", "")?.replace("IDR", "");
    }

    if (result?.includes("Rp.")) {
        result = result?.replace("Rp. ", "")?.replace("Rp.", "");
    }

    if (result?.includes("Rp")) {
        result = result?.replace("Rp ", "")?.replace("Rp", "");
    }

    if (!result?.includes("Rp")) {
        if (originAmount < 0) {
            result = withoutRp ? `- ${result}` : `- Rp ${result}`;
        } else {
            result = withoutRp ? `${result}` : `Rp ${result}`;
        }
    }
    return result;
};

const formatCurrency = (number: number, withoutRp?: boolean) => {
    let finalNumber = number;
    if (Platform.OS === "android") {
        if (finalNumber < 0) {
            finalNumber = -finalNumber;
        }

        const result = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR"
        })
            .format(finalNumber)
            .split("Rp")
            .join("")
            .split(",00")
            .join("");
        return trimCurrencyFormat(result, number, withoutRp || false);
    }

    const result = finalNumber?.toLocaleString("id-ID");
    return trimCurrencyFormat(result, number, withoutRp || false);
};

export default formatCurrency;
