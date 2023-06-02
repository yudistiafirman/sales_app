import { Platform } from "react-native";
import "intl";
import "intl/locale-data/jsonp/id-ID";

const formatCurrency = (number: number) => {
    let finalNumber = number;
    if (Platform.OS === "android") {
        if (finalNumber < 0) {
            finalNumber = -finalNumber;
        }

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR"
        })
            .format(finalNumber)
            .split("Rp")
            .join("")
            .split(",00")
            .join("");
    }
    return finalNumber?.toLocaleString("id-ID");
};

export default formatCurrency;
