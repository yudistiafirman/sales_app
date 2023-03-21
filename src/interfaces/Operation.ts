
interface OperationsDeliverOrderProjectResponse {
    companyName?: string;
    projectName?: string;
    id?: string;
    stage?: 'LAND_PREP' | 'FOUNDATION' | 'FORMWORK' | 'FINISHING';
    Company?: {
        id?: string;
        name?: string;
        displayName?: string
    };
    Address?: {
        id?: string;
        line1?: string | null;
        lat?: string | null;
        lon?: string | null;
        line2?: string | null
    }
}

interface OperationsDeliveryOrderScheduleResponse {
    totalPrice?: number;
    id?: string;
    number?: string;
    status?: 'SUBMITTED' | 'FINISHED';
    quantity?: number;
    SaleOrder?: {
        id?: string;
        number?: string;
        PoProduct?: {
            requestedQuantity?: number;
            requestedProduct?: {
                offeringPrice?: number
            }
        }
    }
}

export enum OperationFileType {
    DO_DEPARTURE = 'DO_DEPARTURE',
    ARRIVAL = 'ARRIVAL',
    TRUCK_CONDITION = 'TRUCK_CONDITION',
    DO_SIGNED = 'DO_SIGNED'
}


export interface OperationsDeliveryOrdersListResponse {
    id?: string;
    date?: string;
    number: string;
    sealNumber?: string;
    driverId?: string;
    status?: 'SUBMITTED' | 'FINISHED';
    conditionTruck?: string | null;
    project?: OperationsDeliverOrderProjectResponse;
    Schedule: OperationsDeliveryOrderScheduleResponse;
}