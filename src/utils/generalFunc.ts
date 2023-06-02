import { colors } from "@/constants";
import {
    COMMON_API_SERVER,
    FINANCE_API_SERVER,
    INDIVIDU,
    INVENTORY_API_SERVER,
    ORDER_API_SERVER,
    PRODUCTIVITY_API_SERVER
} from "@/constants/general";
import { CustomerDocsPayType } from "@/models/Customer";
import moment from "moment";
import { NativeModules, Platform } from "react-native";
import "moment/locale/id";
import { PIC } from "@/interfaces";

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
    httpMethod: string | undefined,
    domainType: string,
    fullUrl: string | undefined,
    endPoint: string
) => {
    // excluding: /refresh , /suggestion , /places , /verify-auth , /project_sph , all finalText that empty

    let finalText = "Berhasil ";
    switch (httpMethod?.toLowerCase()) {
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
            finalText += `${httpMethod?.toLowerCase()} `;
            break;
    }

    if (domainType === COMMON_API_SERVER) {
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
                if (fullUrl?.toLowerCase().includes("places/"))
                    finalText = "Berhasil mendapatkan detail alamat";
                else if (fullUrl?.toLowerCase().includes("project/"))
                    finalText += "detail proyek";
                else finalText += "data";
                break;
        }
    } else if (domainType === INVENTORY_API_SERVER) {
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
    } else if (domainType === PRODUCTIVITY_API_SERVER) {
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
                if (fullUrl?.toLowerCase().includes("visitation/"))
                    finalText = "";
                else finalText += "data";
                break;
        }
    } else if (domainType === ORDER_API_SERVER) {
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
                if (fullUrl?.toLowerCase().includes("sph/"))
                    finalText += "dokumen SPH";
                else if (fullUrl?.toLowerCase().includes("purchase-order/"))
                    finalText = "";
                else if (fullUrl?.toLowerCase().includes("quotation-letter/"))
                    finalText = "";
                else if (fullUrl?.toLowerCase().includes("deposit/"))
                    finalText = "";
                else if (fullUrl?.toLowerCase().includes("schedule/"))
                    finalText = "";
                else if (fullUrl?.toLowerCase().includes("delivery-order/"))
                    finalText = "";
                else finalText += "data";
                break;
        }
    } else if (domainType === FINANCE_API_SERVER) {
        switch (endPoint.toLowerCase()) {
            case "payment":
                finalText = "";
                break;
            case "invoice":
                finalText = "";
                break;
            default:
                if (fullUrl?.toLowerCase().includes("invoice/")) finalText = "";
                else if (fullUrl?.toLowerCase().includes("payment/"))
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
        }
        return true;
    }
    const hasUploadedNpwp = cbdDocs.findIndex(
        (v) => v.Document?.name === "Foto NPWP"
    );

    if (documents && documents?.length > 0 && hasUploadedNpwp === 1) {
        return false;
    }
    return true;

    return true;
};

export const uniqueStringGenerator = () =>
    Date.now().toString(36) + Math.random().toString(36).substr(2);

export const replaceDot = (value: string) => {
    let count = 0;
    let output = "";
    for (let i = 0; i < value.length; i += 1) {
        if (value[i] === ".") {
            count += 1;
        }
        if (count <= 1 && value[0] !== ".") {
            output += value[i];
        }
    }
    return output;
};

export const daysInMonth = (month: number, year: number) => {
    const result = new Date(year, month, 0).getDate();
    return result;
};

export const formatRawDateToMonthDateYear = (date?: Date) => {
    let formattedDate = "";
    if (date) {
        formattedDate = moment(date).locale("id").format("LL").replace(",", "");
    }
    return formattedDate;
};

export const translatePaymentStatus = (
    paymentStatus:
        | "PARTIALLY PAID"
        | "DELIVERED"
        | "CANCELLED"
        | "PAID"
        | "SUBMITTED"
) => {
    let paymentType = "";
    if (paymentStatus === "PARTIALLY PAID") {
        paymentType = "Dibayar Sebagian ";
    } else if (paymentStatus === "SUBMITTED") {
        paymentType = "Invoice Dibuat";
    } else if (paymentStatus === "PAID") {
        paymentType = "Lunas";
    } else if (paymentStatus === "DELIVERED") {
        paymentType = "Invoice Dikirim";
    } else {
        paymentType = "Batal";
    }
    return paymentType;
};

export function checkSelectedSPHPic(picList: PIC[]) {
    let isSelectedExist = false;

    const list = picList || [];
    list.forEach((pic) => {
        if (pic.isSelected) {
            isSelectedExist = true;
        }
    });
    return isSelectedExist;
}

export function shouldAllowSPHStateToContinue(
    pos: number,
    sphState: any
): boolean {
    let stepOneCompleted = false;
    let stepTwoCompleted = false;
    let stepThreeCompleted = false;
    let stepFourCompleted = false;

    if (
        sphState.selectedCompany &&
        checkSelectedSPHPic(sphState.selectedCompany?.Pics)
    ) {
        stepOneCompleted = true;
    }
    const billingAddressFilled =
        !Object.values(sphState.billingAddress).every((val) => !val) &&
        Object.entries(sphState.billingAddress.addressAutoComplete).length > 1;
    if (
        (sphState.isBillingAddressSame || billingAddressFilled) &&
        sphState.distanceFromLegok !== null
    ) {
        stepTwoCompleted = true;
    }
    const paymentCondition =
        sphState.paymentType === "CREDIT"
            ? sphState.paymentBankGuarantee
            : true;
    if (sphState.paymentType && paymentCondition) {
        stepThreeCompleted = true;
    }
    if (sphState.chosenProducts.length) {
        stepFourCompleted = true;
    }
    if (pos === 0) {
        return true;
    }
    if (pos === 1 && stepOneCompleted) {
        return true;
    }
    if (pos === 2 && stepOneCompleted && stepTwoCompleted) {
        return true;
    }
    if (
        pos === 3 &&
        stepOneCompleted &&
        stepTwoCompleted &&
        stepThreeCompleted
    ) {
        return true;
    }
    if (
        (pos === 4 || pos === 5) &&
        stepOneCompleted &&
        stepTwoCompleted &&
        stepThreeCompleted &&
        stepFourCompleted
    ) {
        return true;
    }
    return false;
}

export function shouldAllowVisitationStateToContinue(
    pos: number,
    visitationState: any
): boolean {
    let stepOneCompleted = false;
    let stepTwoCompleted = false;
    let stepThreeCompleted = false;
    let stepFourCompleted = false;
    let stepFifthCompleted = false;
    if (
        visitationState?.createdLocation?.formattedAddress &&
        visitationState?.locationAddress?.formattedAddress
    ) {
        stepOneCompleted = true;
    }
    const selectedPic = visitationState?.pics?.filter((v) => v.isSelected);
    const customerTypeCond =
        visitationState?.customerType === "COMPANY"
            ? !!visitationState?.companyName
            : true;
    if (
        visitationState?.customerType &&
        customerTypeCond &&
        visitationState?.projectName &&
        selectedPic.length > 0
    ) {
        stepTwoCompleted = true;
    }
    if (
        visitationState?.stageProject &&
        visitationState?.products?.length > 0 &&
        visitationState?.estimationDate?.estimationMonth &&
        visitationState?.estimationDate?.estimationWeek &&
        visitationState?.paymentType
    ) {
        stepThreeCompleted = true;
    }
    if (visitationState?.competitors?.length > 0) {
        stepFourCompleted = true;
    }
    const filteredImages = visitationState?.images?.filter(
        (it) => it?.file !== null
    );
    if (filteredImages?.length > 0) {
        stepFifthCompleted = true;
    }

    if (pos === 0) {
        return true;
    }
    if (pos === 1 && stepOneCompleted) {
        return true;
    }
    if (pos === 2 && stepOneCompleted && stepTwoCompleted) {
        return true;
    }
    if (
        pos === 3 &&
        stepOneCompleted &&
        stepTwoCompleted &&
        stepThreeCompleted
    ) {
        return true;
    }
    if (
        pos === 4 &&
        stepOneCompleted &&
        stepTwoCompleted &&
        stepThreeCompleted &&
        stepFourCompleted
    ) {
        return true;
    }
    if (
        pos === 5 &&
        stepOneCompleted &&
        stepTwoCompleted &&
        stepThreeCompleted &&
        stepFourCompleted &&
        stepFifthCompleted
    ) {
        return true;
    }
    return false;
}
