import { colors } from "@/constants";
import { INDIVIDU } from "@/constants/const";
import { CustomerDocsPayType } from "@/models/Customer";
import { NativeModules, Platform } from "react-native";
const { RNCustomConfig } = NativeModules;

const flavor = RNCustomConfig?.flavor;
const versionName = RNCustomConfig?.versionName;

export const isUndefined = (state: any): boolean =>
    typeof state === "undefined";

export const getColorStatusTrx = (id: string) => {
    switch (id.toUpperCase()) {
        case "DIAJUKAN":
            return { color: colors.status.grey, textColor: colors.black };
        case "DRAFT":
            return { color: colors.status.grey, textColor: colors.black };
        case "DALAM PRODUKSI":
            return { color: colors.status.grey, textColor: colors.black };
        case "SELESAI":
            return { color: colors.status.grey, textColor: colors.black };
        case "SUBMITTED":
            return { color: colors.status.grey, textColor: colors.black };
        case "CEK BARANG":
            return { color: colors.status.yellow, textColor: colors.black };
        case "PEMERIKSAAN":
            return { color: colors.status.yellow, textColor: colors.black };
        case "DALAM PERJALANAN":
            return { color: colors.status.yellow, textColor: colors.black };
        case "PERSIAPAN":
            return { color: colors.status.orange, textColor: colors.black };
        case "BERLANGSUNG":
            return { color: colors.status.orange, textColor: colors.black };
        case "BONGKAR":
            return { color: colors.status.orange, textColor: colors.black };
        case "KADALUARSA":
            return { color: colors.status.black, textColor: colors.white };
        case "DITOLAK":
            return { color: colors.status.red, textColor: colors.black };
        case "DISETUJUI":
            return { color: colors.chip.green, textColor: colors.black };
        case "DITERIMA":
            return { color: colors.chip.green, textColor: colors.black };
        case "DITERBITKAN":
            return { color: colors.chip.green, textColor: colors.black };
        case "DECLINED":
            return { color: colors.status.red, textColor: colors.black };
        default:
            return { color: colors.chip.green, textColor: colors.black };
    }
};

export const getStatusTrx = (id: string) => {
    switch (id.toUpperCase()) {
        case "DRAFT":
            return "Diterbitkan";
        case "SUBMITTED":
            return "Diajukan";
        case "PARTIALLY_PROCESSED":
            return "Persiapan";
        case "PARTIALLY_PAID":
            return "Disetujui";
        case "CONFIRMED":
            return "Disetujui";
        case "PAID":
            return "Diterima";
        case "CANCELLED":
            return "Ditolak";
        case "DECLINED":
            return "Ditolak";
        default:
            return id;
    }
};

export const beautifyPhoneNumber = (text: string) => {
    let firstChar: string[] = text.match(/.{1,3}/g) ?? [];
    let result = "";
    if (firstChar.length > 0) {
        result += firstChar[0];
        firstChar = firstChar.splice(1, 4);
        firstChar = firstChar.join("").match(/.{1,4}/g) ?? [];
        result += ` ${firstChar.join(" ")}`;
    } else {
        result += firstChar.join("");
    }
    return result;
};

export const isDevelopment = () => {
    if (flavor === "development" || (Platform.OS !== "android" && __DEV__)) {
        return true;
    }
    return false;
};

export const isProduction = () => {
    if (flavor === "production") {
        return true;
    }
    return false;
};

export const getAppVersionName = (): string => {
    let version = versionName;
    if (isDevelopment()) version += " (Dev)";
    return version;
};

export const isForceUpdate = (text: any): boolean => text?.is_forced;

export const getMinVersionUpdate = (text: any): string =>
    text?.min_version?.split(".").join("");

export const isJsonString = (str: any) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export const getSuccessMsgFromAPI = (
    httpMethod: string,
    domainType: string,
    fullUrl: string,
    endPoint: string
) => {
    // excluding: /refresh , /suggestion , /places , /verify-auth , /project_sph , all finalText that empty

    let finalText = "Berhasil ";
    switch (httpMethod.toLowerCase()) {
        case "post":
            finalText += "menambahkan ";
            break;
        case "get":
            finalText += "mengambil ";
            break;
        case "delete":
            finalText += "menghapus ";
            break;
        case "put":
            finalText += "mengubah ";
            break;
        default:
            finalText += `${httpMethod.toLowerCase()} `;
            break;
    }

    if (
        domainType === "common-dev.aggre.id" ||
        domainType === "common.aggre.id" ||
        domainType === "common.apis.oreo.brik.id" ||
        domainType === "common.apis.brik.id"
    ) {
        switch (endPoint.toLowerCase()) {
            case "projectdoc":
                finalText += "dokumen";
                break;
            case "coordinates":
                finalText += "kordinat lokasi";
                break;
            case "upload":
                finalText = "";
                break;
            case "project":
                finalText += "data proyek";
                break;
            case "companies-by-user":
                finalText += "data proyek berdasarkan user";
                break;
            case "sph":
                finalText += "dokumen SPH";
                break;
            case "individual":
                finalText += "detail proyek";
                break;
            case "billing-address":
                finalText += "alamat penagihan";
                break;
            case "location-address":
                finalText += "alamat proyek";
                break;
            case "login":
                finalText = "Berhasil login";
                break;
            case "logout":
                finalText = "Berhasil logout";
                break;
            default:
                if (fullUrl.toLowerCase().includes("places/"))
                    finalText = "Berhasil mendapatkan detail alamat";
                else if (fullUrl.toLowerCase().includes("project/"))
                    finalText += "detail proyek";
                else finalText += "data";
                break;
        }
    } else if (
        domainType === "inventory-dev.aggre.id" ||
        domainType === "inventory.aggre.id" ||
        domainType === "inventory.apis.oreo.brik.id" ||
        domainType === "inventory.apis.brik.id"
    ) {
        switch (endPoint.toLowerCase()) {
            case "category":
                finalText += "data semua produk berdasarkan kategori";
                break;
            case "product":
                finalText += "data semua produk";
                break;
            default:
                finalText += "data";
                break;
        }
    } else if (
        domainType === "productivity-dev.aggre.id" ||
        domainType === "productivity.aggre.id" ||
        domainType === "productivity.apis.oreo.brik.id" ||
        domainType === "productivity.apis.brik.id"
    ) {
        switch (endPoint.toLowerCase()) {
            case "all-visitation":
                finalText += "data semua kunjungan";
                break;
            case "completed-visitation":
                finalText += "data target kunjungan";
                break;
            case "visitation":
                finalText = "";
                break;
            case "visitation-book":
                finalText = "Berhasil buat janji";
                break;
            default:
                if (fullUrl.toLowerCase().includes("visitation/"))
                    finalText = "";
                else finalText += "data";
                break;
        }
    } else if (
        domainType === "order-dev.aggre.id" ||
        domainType === "order.aggre.id" ||
        domainType === "order.apis.oreo.brik.id" ||
        domainType === "order.apis.brik.id"
    ) {
        switch (endPoint.toLowerCase()) {
            case "project-sph":
                finalText += "data semua SPH berdasarkan proyek";
                break;
            case "project-po":
                finalText += "data semua PO berdasarkan proyek";
                break;
            case "quotation":
                finalText = "";
                break;
            case "purchase-order":
                finalText = "";
                break;
            case "quotation-letter":
                finalText += "data SPH";
                break;
            case "deposit":
                finalText = "";
                break;
            case "schedule":
                finalText = "";
                break;
            case "delivery-order":
                finalText = "";
                break;
            case "transaction":
                finalText = "";
                break;
            default:
                if (fullUrl.toLowerCase().includes("sph/"))
                    finalText += "dokumen SPH";
                else if (fullUrl.toLowerCase().includes("purchase-order/"))
                    finalText = "";
                else if (fullUrl.toLowerCase().includes("quotation-letter/"))
                    finalText = "";
                else if (fullUrl.toLowerCase().includes("deposit/"))
                    finalText = "";
                else if (fullUrl.toLowerCase().includes("schedule/"))
                    finalText = "";
                else if (fullUrl.toLowerCase().includes("delivery-order/"))
                    finalText = "";
                else finalText += "data";
                break;
        }
    } else {
        finalText += "data";
    }
    return finalText;
};

export const showWarningDocument = (
    cbdDocs: CustomerDocsPayType[],
    customerType: "INDIVIDU" | "COMPANY"
) => {
    if (!cbdDocs || !customerType) return false;

    const documents = cbdDocs.filter((v) => v.File !== null);
    if (customerType === INDIVIDU) {
        if (documents && documents?.length > 0) {
            return false;
        } else {
            return true;
        }
    } else {
        if (
            documents &&
            documents?.length > 0 &&
            documents[0]?.Document?.name === "Foto NPWP"
        ) {
            return false;
        } else {
            return true;
        }
    }
};

export const uniqueStringGenerator = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const replaceDot = (value: string) => {
    let count = 0;
    let output = "";
    for (let i = 0; i < value.length; i++) {
        if (value[i] === ".") {
            count++;
        }
        if (count <= 1 && value[0] !== ".") {
            output += value[i];
        }
    }
    return output;
};
