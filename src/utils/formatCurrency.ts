import { Platform } from "react-native";
import "intl";
import "intl/locale-data/jsonp/id-ID";

const formatCurrency = (number: number) => {
    if (Platform.OS === "android") {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR"
        })
            .format(number)
            .split("Rp")
            .join("")
            .split(",00")
            .join("");
    }
    return number?.toLocaleString("id-ID");
};

export default formatCurrency;
