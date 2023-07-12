interface OperationsDeliverOrderProjectResponse {
    companyName?: string;
    projectName?: string;
    id?: string;
    stage?: "LAND_PREP" | "FOUNDATION" | "FORMWORK" | "FINISHING";
    Company?: {
        id?: string;
        name?: string;
        displayName?: string;
    };
    Address?: {
        id?: string;
        line1?: string | null;
        lat?: string | null;
        lon?: string | null;
        line2?: string | null;
    };
}

interface OperationsDeliveryOrderScheduleResponse {
    totalPrice?: number;
    id?: string;
    number?: string;
    status?: "SUBMITTED" | "FINISHED";
    quantity?: number;
    SaleOrder?: {
        id?: string;
        number?: string;
        PoProduct?: {
            requestedQuantity?: number;
            requestedProduct?: {
                offeringPrice?: number;
            };
        };
    };
}

interface OperationsDeliveryOrderWeightResponse {
    id: string;
    weight: number;
    unit: string;
    type: string;
}

export interface OperationsDeliveryOrderFileResponse {
    id?: number;
    type?: string;
    File?: {
        id?: string;
        type?: string;
        name?: string;
        url?: string;
    };
}

export enum OperationFileType {
    DO_DEPARTURE = "DO_DEPARTURE",
    DO_SECURITY = "DO_SECURITY",
    DO_KONDOM_SECURITY = "DO_KONDOM_SECURITY",
    DO_DRIVER_SECURITY = "DO_DRIVER_SECURITY",
    DO_LICENSE_SECURITY = "DO_LICENSE_SECURITY",
    DO_SEAL_SECURITY = "DO_SEAL_SECURITY",
    DO_RETURN_SECURITY = "DO_RETURN_SECURITY",
    DO_RETURN_TRUCK_CONDITION_SECURITY = "DO_RETURN_TRUCK_CONDITION_SECURITY",
    ARRIVAL = "ARRIVAL",
    TRUCK_CONDITION = "TRUCK_CONDITION",
    DO_SIGNED = "DO_SIGNED",
    WEIGHT_OUT = "WEIGHT_OUT",
    DO_WEIGHT_IN = "DO_WEIGHT_IN",
    WEIGHT_IN = "WEIGHT_IN",
    WB_OUT_DO = "WB_OUT_DO",
    WB_OUT_RESULT = "WB_OUT_RESULT",
    DO_DRIVER_ARRIVE_PROJECT = "DO_DRIVER_ARRIVE_PROJECT",
    DO_DRIVER_BNIB = "DO_DRIVER_BNIB",
    DO_DRIVER_RECEIPIENT = "DO_DRIVER_RECEIPIENT",
    DO_DRIVER_WATER = "DO_DRIVER_WATER",
    DO_DRIVER_DO = "DO_DRIVER_DO",
    DO_DRIVER_UNBOXING = "DO_DRIVER_UNBOXING",
    DO_DRIVER_EMPTY = "DO_DRIVER_EMPTY",
    DO_DRIVER_FINISH_PROJECT = "DO_DRIVER_FINISH_PROJECT"
}

export interface OperationsDeliveryOrdersListResponse {
    id?: string;
    date?: string;
    number: string;
    sealNumber?: string;
    driverId?: string;
    quantity?: number;
    status?: "SUBMITTED" | "FINISHED";
    conditionTruck?: string | null;
    recipientName?: string;
    recipientNumber?: string;
    Weight: OperationsDeliveryOrderWeightResponse[];
    project?: OperationsDeliverOrderProjectResponse;
    Schedule: OperationsDeliveryOrderScheduleResponse;
    DeliveryOrderFile: OperationsDeliveryOrderFileResponse[];
}
