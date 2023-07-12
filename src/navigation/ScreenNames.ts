import { OperationFileType } from "@/interfaces/Operation";

/*
    Screen Keys
*/
export const TAB_ROOT = "TAB_ROOT";

export const TAB_RETURN = "TAB.RETURN";
export const TAB_WB_OUT = "TAB.WB_OUT";
export const TAB_DISPATCH = "TAB.DISPATCH";
export const TAB_WB_IN = "TAB.WB_IN";
export const TAB_HOME = "TAB.HOME";
export const TAB_TRANSACTION = "TAB.TRANSACTION";
export const TAB_PROFILE = "TAB.PROFILE";
export const TAB_CUSTOMER = "TAB.CUSTOMER";
export const TAB_PRICE_LIST = "TAB.PRICE_LIST";

export const SPLASH = "SPLASH";

export const OPSMANAGER = "OPSMANAGER";
export const BATCHER = "BATCHER";
export const DRIVER = "DRIVER";
export const LOGIN = "LOGIN";
export const VERIFICATION = "VERIFICATION";
export const CAMERA = "CAMERA";
export const IMAGE_PREVIEW = "IMAGE_PREVIEW";
export const CREATE_DO = "CREATE_DO";
export const SUBMIT_FORM = "SUBMIT_FORM";
export const CREATE_VISITATION = "CREATE_VISITATION";
export const GALLERY_VISITATION = "GALLERY_VISITATION";
export const SPH = "SPH";
export const PO = "PO";
export const SEARCH_PRODUCT = "SEARCH_PRODUCT";
export const LOCATION = "LOCATION";
export const SEARCH_AREA = "SEARCH_AREA";
export const CALENDAR = "CALENDAR";
export const TRANSACTION_DETAIL = "TRANSACTION_DETAIL";
export const PROJECT_DETAIL = "PROJECT_DETAIL";
export const CUSTOMER_DETAIL = "CUSTOMER_DETAIL";
export const CUSTOMER_DOCUMENT = "CUSTOMER_DOCUMENT";
export const CREATE_SCHEDULE = "CREATE_SCHEDULE";
export const CREATE_DEPOSIT = "CREATE_DEPOSIT";
export const GALLERY_DEPOSIT = "GALLERY_DEPOSIT";
export const ALL_PRODUCT = "ALL_PRODUCT";
export const APPOINTMENT = "APPOINTMENT";
export const HUNTER_AND_FARMER = "HUNTER_AND_FARMER";
export const DOCUMENTS = "DOCUMENTS";
export const OPERATION = "OPERATION";
export const VISIT_HISTORY = "VISIT_HISTORY";
export const BLANK_SCREEN = "BLANK_SCREEN";
export const SEARCH_SO = "SEARCH_SO";
export const FORM_SO = "FORM_SO";
export const GALLERY_SO = "GALLERY_SO";
export const GALLERY_OPERATION = "GALLERY_OPERATION";
export const INVOICE_LIST = "INVOICE_LIST";
export const INVOICE_DETAIL = "INVOICE_DETAIL";
export const INVOICE_FILTER = "INVOICE_FILTER";

/*
    Screen Title
*/
export const TAB_HOME_TITLE = "Beranda";
export const TAB_TRANSACTION_TITLE = "Transaksi";
export const TAB_PROFILE_TITLE = "Profil";
export const TAB_PRICE_LIST_TITLE = "Harga";
export const TAB_WB_OUT_TITLE = "Keberangkatan";
export const TAB_WB_IN_TITLE = "Kedatangan";
export const TAB_DISPATCH_TITLE = "Keberangkatan";
export const TAB_RETURN_TITLE = "Kedatangan";
export const TAB_CUSTOMER_TITLE = "Pelanggan";

export const SALES_TAB_TITLE = "Beranda";
export const SECURITY_TAB_TITLE = "Beranda";
export const OPSMANAGER_TITLE = "Beranda";
export const BATCHER_TITLE = "Beranda";
export const DRIVER_TITLE = "Beranda";

export const LOGIN_TITLE = "Log in";
export const VERIFICATION_TITLE = "Kode Verifikasi";
export const LIST_CUSTOMER_TITLE = "Pelanggan";
export const CAMERA_TITLE = "Camera";
export const IMAGE_PREVIEW_TITLE = "Image Preview";
export const SCHEDULE_TITLE = "Schedule";
export const SUBMIT_FORM_TITLE = "Submit Form";
export const CREATE_VISITATION_TITLE = "Buat Kunjungan";
export const SPH_TITLE = "Buat SPH";
export const SEARCH_PRODUCT_TITLE = "Cari Produk";
export const LOCATION_TITLE = "Pilih Area Proyek";
export const SEARCH_AREA_TITLE = "Pilih Area Proyek";
export const CALENDAR_TITLE = "Pilih Tanggal";
export const TRANSACTION_DETAIL_TITLE = "Detail Transaksi";
export const PROJECT_DETAIL_TITLE = "Detil Proyek";
export const CUSTOMER_DETAIL_TITLE = "Detil Pelanggan";
export const CREATE_SCHEDULE_TITLE = "Buat Jadwal";
export const CREATE_DEPOSIT_TITLE = "Buat Deposit";
export const ALL_PRODUCT_TITLE = "Semua Produk";
export const APPOINTMENT_TITLE = "Buat Janji Temu";
export const HUNTER_AND_FARMER_TITLE = "Hunter & Farmer";
export const DOCUMENTS_TITLE = "Dokumen";
export const SEARCH_SO_TITLE = "Cari File SO";
export const FORM_SO_TITLE = "Sign SO";
export const INVOICE_LIST_TITLE = "List Tagihan";

export const HOME_MENU = {
    SPH: "Buat SPH",
    PO: "Buat PO/SO",
    DEPOSIT: "Buat Deposit",
    SCHEDULE: "Buat Jadwal",
    APPOINTMENT: "Buat Janji Temu",
    SIGN_SO: "Upload Signed SO",
    INVOICE: "List Tagihan"
};

export const driversFileType = [
    OperationFileType.DO_DRIVER_ARRIVE_PROJECT,
    OperationFileType.DO_DRIVER_BNIB,
    OperationFileType.DO_DRIVER_UNBOXING,
    OperationFileType.DO_DRIVER_EMPTY,
    OperationFileType.DO_DRIVER_DO,
    OperationFileType.DO_DRIVER_RECEIPIENT,
    OperationFileType.DO_DRIVER_WATER,
    OperationFileType.DO_DRIVER_FINISH_PROJECT
];

export const driversFileName = [
    "Tiba di lokasi",
    "Dalam gentong isi",
    "Tuang beton",
    "Cuci gentong",
    "DO",
    "Penerima",
    "Penambahan air",
    "Tambahan"
];

export const wbsInFileType = [
    OperationFileType.DO_WEIGHT_IN,
    OperationFileType.WEIGHT_IN
];

export const wbsInFileName = ["DO", "Hasil"];

export const wbsOutFileType = [
    OperationFileType.WB_OUT_DO,
    OperationFileType.WB_OUT_RESULT
];

export const wbsOutFileName = ["DO", "Hasil"];

export const securityDispatchFileType = [
    OperationFileType.DO_SECURITY,
    OperationFileType.DO_DRIVER_SECURITY,
    OperationFileType.DO_LICENSE_SECURITY,
    OperationFileType.DO_SEAL_SECURITY,
    OperationFileType.DO_KONDOM_SECURITY
];

export const securityDispatchFileName = [
    "DO",
    "Driver",
    "No Polisi TM",
    "Segel",
    "Kondom"
];

export const securityReturnFileType = [
    OperationFileType.DO_RETURN_SECURITY,
    OperationFileType.DO_RETURN_TRUCK_CONDITION_SECURITY
];

export const securityReturnFileName = ["DO", "Kondisi TM"];
