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
import LocalFileType from "@/interfaces/LocalFileType";
import EntryType from "@/models/EnumModel";
import {
    driversFileName,
    driversFileType,
    securityDispatchFileName,
    securityDispatchFileType,
    securityReturnFileName,
    securityReturnFileType,
    wbsInFileName,
    wbsInFileType,
    wbsOutFileName,
    wbsOutFileType
} from "@/navigation/ScreenNames";
import {
    OperationFileType,
    OperationsDeliveryOrderFileResponse
} from "@/interfaces/Operation";

const { RNCustomConfig } = NativeModules;

const flavor = RNCustomConfig?.flavor;
const versionName = RNCustomConfig?.versionName;

export const isUndefined = (state: any): boolean =>
    typeof state === "undefined";

export const getColorStatusTrx = (id: string) => {
    switch (id?.toUpperCase()) {
        case "DIAJUKAN":
            return { color: colors.status.grey, textColor: colors.black };
        case "DRAFT":
            return { color: colors.status.grey, textColor: colors.black };
        case "DALAM PRODUKSI":
            return { color: colors.status.grey, textColor: colors.black };
        case "SUBMITTED":
            return { color: colors.status.grey, textColor: colors.black };
        case "TIBA":
            return { color: colors.status.lightBlue, textColor: colors.black };
        case "MENUNGGU MASUK WB":
            return { color: colors.status.yellow, textColor: colors.black };
        case "CEK BARANG":
            return { color: colors.status.yellow, textColor: colors.black };
        case "PEMERIKSAAN":
            return { color: colors.status.yellow, textColor: colors.black };
        case "DALAM PERJALANAN":
            return { color: colors.status.yellow, textColor: colors.black };
        case "PERSIAPAN":
            return { color: colors.status.orange, textColor: colors.black };
        case "KELUAR WB":
            return { color: colors.status.orange, textColor: colors.black };
        case "BERLANGSUNG":
            return { color: colors.status.orange, textColor: colors.black };
        case "BONGKAR":
            return { color: colors.status.orange, textColor: colors.black };
        case "SEDANG PENGIRIMAN":
            return { color: colors.graySevenEight, textColor: colors.black };
        case "KADALUARSA":
            return { color: colors.status.black, textColor: colors.white };
        case "DITOLAK":
            return { color: colors.status.black, textColor: colors.white };
        case "DISETUJUI":
            return { color: colors.chip.green, textColor: colors.black };
        case "DITERIMA":
            return { color: colors.blueSail, textColor: colors.white };
        case "DITERBITKAN":
            return { color: colors.chip.green, textColor: colors.black };
        case "DIBATALKAN":
            return { color: colors.status.red, textColor: colors.black };
        case "DECLINED":
            return { color: colors.status.red, textColor: colors.black };
        case "SELESAI":
            return { color: colors.chip.green, textColor: colors.black };
        default:
            return { color: colors.chip.green, textColor: colors.black };
    }
};

export const getStatusTrx = (id?: string) => {
    switch (id?.toUpperCase()) {
        case "DRAFT":
            return "Diterbitkan".toUpperCase();
        case "SUBMITTED":
            return "Diajukan".toUpperCase();
        case "WB_OUT":
            return "Keluar WB".toUpperCase();
        case "ON_DELIVERY":
            return "Sedang Pengiriman".toUpperCase();
        case "ARRIVED":
            return "Tiba".toUpperCase();
        case "RECEIVED":
            return "Diterima".toUpperCase();
        case "AWAIT_WB_IN":
            return "Menunggu Masuk WB".toUpperCase();
        case "FINISHED":
            return "Selesai".toUpperCase();
        case "REJECTED":
            return "Ditolak".toUpperCase();
        case "PARTIALLY_PROCESSED":
            return "Persiapan".toUpperCase();
        case "PARTIALLY_PAID":
            return "Disetujui".toUpperCase();
        case "CONFIRMED":
            return "Disetujui".toUpperCase();
        case "PAID":
            return "Diterima".toUpperCase();
        case "CANCELLED":
            return "Dibatalkan".toUpperCase();
        case "DECLINED":
            return "Ditolak".toUpperCase();
        default:
            return id?.toUpperCase();
    }
};

export const beautifyPhoneNumber = (text: string) => {
    let firstChar: string[] = text?.match(/.{1,3}/g) ?? [];
    let result = "";
    if (firstChar && firstChar?.length > 0) {
        result += firstChar[0];
        firstChar = firstChar?.splice(1, 4);
        firstChar = firstChar?.join("")?.match(/.{1,4}/g) ?? [];
        result += ` ${firstChar?.join(" ")}`;
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
    text?.min_version?.split(".")?.join("");

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
        switch (endPoint?.toLowerCase()) {
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
                if (fullUrl?.toLowerCase()?.includes("places/"))
                    finalText = "Berhasil mendapatkan detail alamat";
                else if (fullUrl?.toLowerCase()?.includes("project/"))
                    finalText += "detail proyek";
                else finalText += "data";
                break;
        }
    } else if (domainType === INVENTORY_API_SERVER) {
        switch (endPoint?.toLowerCase()) {
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
        switch (endPoint?.toLowerCase()) {
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
                if (fullUrl?.toLowerCase()?.includes("visitation/"))
                    finalText = "";
                else finalText += "data";
                break;
        }
    } else if (domainType === ORDER_API_SERVER) {
        switch (endPoint?.toLowerCase()) {
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
                if (fullUrl?.toLowerCase()?.includes("sph/"))
                    finalText += "dokumen SPH";
                else if (fullUrl?.toLowerCase()?.includes("purchase-order/"))
                    finalText = "";
                else if (fullUrl?.toLowerCase()?.includes("quotation-letter/"))
                    finalText = "";
                else if (fullUrl?.toLowerCase()?.includes("deposit/"))
                    finalText = "";
                else if (fullUrl?.toLowerCase()?.includes("schedule/"))
                    finalText = "";
                else if (fullUrl?.toLowerCase()?.includes("delivery-order/"))
                    finalText = "";
                else finalText += "data";
                break;
        }
    } else if (domainType === FINANCE_API_SERVER) {
        switch (endPoint?.toLowerCase()) {
            case "payment":
                finalText = "";
                break;
            case "invoice":
                finalText = "";
                break;
            default:
                if (fullUrl?.toLowerCase()?.includes("invoice/"))
                    finalText = "";
                else if (fullUrl?.toLowerCase()?.includes("payment/"))
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
    if (!cbdDocs || !customerType || cbdDocs?.length === 0) return true;

    const documents = cbdDocs?.filter((v) => v?.File !== null);

    if (customerType === INDIVIDU) {
        if (documents && documents?.length > 0) {
            return false;
        }
        return true;
    }
    const hasUploadedNpwp = cbdDocs?.filter(
        (v) => v?.Document?.name === "Foto NPWP"
    );

    if (
        documents &&
        documents?.length > 0 &&
        hasUploadedNpwp[0]?.File !== null
    ) {
        return false;
    }
    return true;
};

export const uniqueStringGenerator = () =>
    Date.now().toString(36) + Math.random().toString(36).substr(2);

export const replaceDot = (value: string) => {
    let count = 0;
    let output = "";
    if (value)
        for (let i = 0; i < value?.length; i += 1) {
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

export const formatRawDateToMonthDateYearWithSlashed = (date?: Date) => {
    let formattedDate = "";
    if (date) {
        formattedDate = moment(date).locale("id").format("L");
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
    list?.forEach((pic) => {
        if (pic?.isSelected) {
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
        sphState?.selectedCompany &&
        checkSelectedSPHPic(sphState?.selectedCompany?.Pics)
    ) {
        stepOneCompleted = true;
    }
    const billingAddressFilled =
        sphState?.billingAddress &&
        !Object?.values(sphState?.billingAddress)?.every((val) => !val) &&
        sphState?.billingAddress?.addressAutoComplete &&
        Object?.entries(sphState?.billingAddress?.addressAutoComplete) &&
        Object?.entries(sphState?.billingAddress?.addressAutoComplete)?.length >
            1;
    if (
        (sphState?.isBillingAddressSame || billingAddressFilled) &&
        sphState?.distanceFromLegok !== null
    ) {
        stepTwoCompleted = true;
    }
    const paymentCondition =
        sphState?.paymentType === "CREDIT"
            ? sphState?.paymentBankGuarantee
            : true;
    if (sphState?.paymentType && paymentCondition) {
        stepThreeCompleted = true;
    }
    if (
        sphState?.chosenProducts &&
        sphState?.chosenProducts?.length > 0 &&
        sphState?.selectedCompany
    ) {
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
    const selectedPic = visitationState?.pics?.filter(
        (v: any) => v?.isSelected
    );
    const customerTypeCond =
        visitationState?.customerType === "COMPANY"
            ? !!visitationState?.companyName
            : true;
    if (
        visitationState?.customerType &&
        customerTypeCond &&
        visitationState?.projectName &&
        selectedPic &&
        selectedPic?.length > 0
    ) {
        stepTwoCompleted = true;
    }
    if (
        visitationState?.stageProject &&
        visitationState?.products &&
        visitationState?.products?.length > 0 &&
        visitationState?.estimationDate?.estimationMonth &&
        visitationState?.estimationDate?.estimationWeek &&
        visitationState?.paymentType
    ) {
        stepThreeCompleted = true;
    }
    if (
        visitationState?.competitors &&
        visitationState?.competitors?.length > 0
    ) {
        stepFourCompleted = true;
    }
    const filteredImages = visitationState?.images?.filter(
        (it: any) => it?.file !== null
    );
    if (filteredImages && filteredImages?.length > 0) {
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

export function getAvailableDepositProject(
    data: any,
    includeCredit: boolean
): number {
    let availableDeposit;
    if (includeCredit && data?.Customer?.paymentType === "CREDIT") {
        availableDeposit =
            data?.Customer?.Accounts && data?.Customer?.Accounts?.length > 0
                ? data?.Customer?.Accounts[0]?.pendingBalance
                : 0;
    } else {
        availableDeposit = data?.Account?.pendingBalance || 0;
    }
    return availableDeposit;
}

export function safetyCheck(item: any) {
    if (item !== undefined && item !== null) {
        return true;
    }
    return false;
}

export function fileIsFromInternet(photo?: string): boolean {
    return photo ? photo.startsWith("http") : false;
}

export function getFileGalleryFromBE(files: any[], types: any[]): any[] {
    const filteredFiles: any[] = [];
    files.forEach((it) => {
        types.forEach((type) => {
            if (it.type === type) {
                filteredFiles.push(it);
            }
        });
    });
    const result = Array.from(new Set(filteredFiles.map((s) => s.type))).map(
        (ty) => ({
            type: ty,
            ...filteredFiles.filter((f) => f.type === ty)[0]
        })
    );
    return result;
}

export function mapFileFromBEToGallery(files: any[]): LocalFileType[] {
    const finalGalleryFiles: LocalFileType[] = [];
    files.forEach((it) => {
        finalGalleryFiles.push({
            attachType: it.type,
            isFromPicker: false,
            file: {
                name: it.File?.name,
                uri: it.File?.url,
                type: it.File?.type,
                datetime: it.File?.datetime,
                longlat: it.File?.longlat
            }
        } as LocalFileType);
    });
    return finalGalleryFiles;
}

export function mapFileTypeToNameDO(type: string, attachType?: string): string {
    let finalName = "";
    switch (type) {
        case EntryType.DRIVER:
            if (attachType === OperationFileType.DO_DRIVER_ARRIVE_PROJECT) {
                // eslint-disable-next-line prefer-destructuring
                finalName = driversFileName[0];
            } else if (attachType === OperationFileType.DO_DRIVER_BNIB) {
                // eslint-disable-next-line prefer-destructuring
                finalName = driversFileName[1];
            } else if (attachType === OperationFileType.DO_DRIVER_UNBOXING) {
                // eslint-disable-next-line prefer-destructuring
                finalName = driversFileName[2];
            } else if (attachType === OperationFileType.DO_DRIVER_EMPTY) {
                // eslint-disable-next-line prefer-destructuring
                finalName = driversFileName[3];
            } else if (attachType === OperationFileType.DO_DRIVER_DO) {
                // eslint-disable-next-line prefer-destructuring
                finalName = driversFileName[4];
            } else if (attachType === OperationFileType.DO_DRIVER_RECEIPIENT) {
                // eslint-disable-next-line prefer-destructuring
                finalName = driversFileName[5];
            } else if (attachType === OperationFileType.DO_DRIVER_WATER) {
                // eslint-disable-next-line prefer-destructuring
                finalName = driversFileName[6];
            } else if (
                attachType === OperationFileType.DO_DRIVER_FINISH_PROJECT
            ) {
                // eslint-disable-next-line prefer-destructuring
                finalName = driversFileName[7];
            }
            break;
        case EntryType.DISPATCH:
            if (attachType === OperationFileType.DO_SECURITY) {
                // eslint-disable-next-line prefer-destructuring
                finalName = securityDispatchFileName[0];
            } else if (attachType === OperationFileType.DO_DRIVER_SECURITY) {
                // eslint-disable-next-line prefer-destructuring
                finalName = securityDispatchFileName[1];
            } else if (attachType === OperationFileType.DO_LICENSE_SECURITY) {
                // eslint-disable-next-line prefer-destructuring
                finalName = securityDispatchFileName[2];
            } else if (attachType === OperationFileType.DO_SEAL_SECURITY) {
                // eslint-disable-next-line prefer-destructuring
                finalName = securityDispatchFileName[3];
            } else if (attachType === OperationFileType.DO_KONDOM_SECURITY) {
                // eslint-disable-next-line prefer-destructuring
                finalName = securityDispatchFileName[4];
            }
            break;
        case EntryType.RETURN:
            if (attachType === OperationFileType.DO_RETURN_SECURITY) {
                // eslint-disable-next-line prefer-destructuring
                finalName = securityReturnFileName[0];
            } else if (
                attachType ===
                OperationFileType.DO_RETURN_TRUCK_CONDITION_SECURITY
            ) {
                // eslint-disable-next-line prefer-destructuring
                finalName = securityReturnFileName[1];
            }
            break;
        case EntryType.IN:
            if (attachType === OperationFileType.DO_WEIGHT_IN) {
                // eslint-disable-next-line prefer-destructuring
                finalName = wbsInFileName[0];
            } else if (attachType === OperationFileType.WEIGHT_IN) {
                // eslint-disable-next-line prefer-destructuring
                finalName = wbsInFileName[1];
            }
            break;
        case EntryType.OUT:
            if (attachType === OperationFileType.WB_OUT_DO) {
                // eslint-disable-next-line prefer-destructuring
                finalName = wbsOutFileName[0];
            } else if (attachType === OperationFileType.WB_OUT_RESULT) {
                // eslint-disable-next-line prefer-destructuring
                finalName = wbsOutFileName[1];
            }
            break;
        default:
            break;
    }
    return finalName;
}

export function mapFileNameToTypeDO(type: string, attachType?: string): string {
    let finalName = "";
    switch (type) {
        case EntryType.DRIVER:
            if (attachType === driversFileName[0]) {
                finalName = OperationFileType.DO_DRIVER_ARRIVE_PROJECT;
            } else if (attachType === driversFileName[1]) {
                finalName = OperationFileType.DO_DRIVER_BNIB;
            } else if (attachType === driversFileName[2]) {
                finalName = OperationFileType.DO_DRIVER_UNBOXING;
            } else if (attachType === driversFileName[3]) {
                finalName = OperationFileType.DO_DRIVER_EMPTY;
            } else if (attachType === driversFileName[4]) {
                finalName = OperationFileType.DO_DRIVER_DO;
            } else if (attachType === driversFileName[5]) {
                finalName = OperationFileType.DO_DRIVER_RECEIPIENT;
            } else if (attachType === driversFileName[6]) {
                finalName = OperationFileType.DO_DRIVER_WATER;
            } else if (attachType === driversFileName[7]) {
                finalName = OperationFileType.DO_DRIVER_FINISH_PROJECT;
            }
            break;
        case EntryType.DISPATCH:
            if (attachType === securityDispatchFileName[0]) {
                finalName = OperationFileType.DO_SECURITY;
            } else if (attachType === securityDispatchFileName[1]) {
                finalName = OperationFileType.DO_DRIVER_SECURITY;
            } else if (attachType === securityDispatchFileName[2]) {
                finalName = OperationFileType.DO_LICENSE_SECURITY;
            } else if (attachType === securityDispatchFileName[3]) {
                finalName = OperationFileType.DO_SEAL_SECURITY;
            } else if (attachType === securityDispatchFileName[4]) {
                finalName = OperationFileType.DO_KONDOM_SECURITY;
            }
            break;
        case EntryType.RETURN:
            if (attachType === securityReturnFileName[0]) {
                finalName = OperationFileType.DO_RETURN_SECURITY;
            } else if (attachType === securityReturnFileName[1]) {
                finalName =
                    OperationFileType.DO_RETURN_TRUCK_CONDITION_SECURITY;
            }
            break;
        case EntryType.IN:
            if (attachType === wbsInFileName[0]) {
                finalName = OperationFileType.DO_WEIGHT_IN;
            } else if (attachType === wbsInFileName[1]) {
                finalName = OperationFileType.WEIGHT_IN;
            }
            break;
        case EntryType.OUT:
            if (attachType === wbsOutFileName[0]) {
                finalName = OperationFileType.WB_OUT_DO;
            } else if (attachType === wbsOutFileName[1]) {
                finalName = OperationFileType.WB_OUT_RESULT;
            }
            break;
        default:
            break;
    }
    return finalName;
}

export function mapDOPhotoFromBE(
    files: OperationsDeliveryOrderFileResponse[],
    userType?: string
): LocalFileType[] {
    let beGalleryFiles: LocalFileType[] = [];
    switch (userType) {
        case EntryType.DRIVER: {
            const filteredFiles: OperationsDeliveryOrderFileResponse[] =
                getFileGalleryFromBE(files, driversFileType);
            const finalFiles: LocalFileType[] = [];
            mapFileFromBEToGallery(filteredFiles).forEach((it) => {
                finalFiles.push({
                    ...it,
                    attachType: mapFileTypeToNameDO(
                        EntryType.DRIVER,
                        it.attachType
                    )
                });
            });
            beGalleryFiles = finalFiles;
            break;
        }
        case EntryType.DISPATCH: {
            const filteredFiles: OperationsDeliveryOrderFileResponse[] =
                getFileGalleryFromBE(files, securityDispatchFileType);
            const finalFiles: LocalFileType[] = [];
            mapFileFromBEToGallery(filteredFiles).forEach((it) => {
                finalFiles.push({
                    ...it,
                    attachType: mapFileTypeToNameDO(
                        EntryType.DISPATCH,
                        it.attachType
                    )
                });
            });
            beGalleryFiles = finalFiles;
            break;
        }
        case EntryType.RETURN: {
            const filteredFiles: OperationsDeliveryOrderFileResponse[] =
                getFileGalleryFromBE(files, securityReturnFileType);
            const finalFiles: LocalFileType[] = [];
            mapFileFromBEToGallery(filteredFiles).forEach((it) => {
                finalFiles.push({
                    ...it,
                    attachType: mapFileTypeToNameDO(
                        EntryType.RETURN,
                        it.attachType
                    )
                });
            });
            beGalleryFiles = finalFiles;
            break;
        }
        case EntryType.IN: {
            const filteredFiles: OperationsDeliveryOrderFileResponse[] =
                getFileGalleryFromBE(files, wbsInFileType);
            const finalFiles: LocalFileType[] = [];
            mapFileFromBEToGallery(filteredFiles).forEach((it) => {
                finalFiles.push({
                    ...it,
                    attachType: mapFileTypeToNameDO(EntryType.IN, it.attachType)
                });
            });
            beGalleryFiles = finalFiles;
            break;
        }
        case EntryType.OUT: {
            const filteredFiles: OperationsDeliveryOrderFileResponse[] =
                getFileGalleryFromBE(files, wbsOutFileType);
            const finalFiles: LocalFileType[] = [];
            mapFileFromBEToGallery(filteredFiles).forEach((it) => {
                finalFiles.push({
                    ...it,
                    attachType: mapFileTypeToNameDO(
                        EntryType.OUT,
                        it.attachType
                    )
                });
            });
            beGalleryFiles = finalFiles;
            break;
        }
        default: {
            break;
        }
    }
    return beGalleryFiles;
}

export const convertTimeString = (time: number) =>
    moment().startOf("day").seconds(time).format("mm:ss");
