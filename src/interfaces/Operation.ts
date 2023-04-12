interface OperationsDeliverOrderProjectResponse {
  companyName?: string;
  projectName?: string;
  id?: string;
  stage?: 'LAND_PREP' | 'FOUNDATION' | 'FORMWORK' | 'FINISHING';
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
  status?: 'SUBMITTED' | 'FINISHED';
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

export enum OperationFileType {
  DO_DEPARTURE = 'DO_DEPARTURE',
  DO_DO_SECURITY = 'DO_SECURITY',
  DO_CONDOM_SECURITY = 'DO_KONDOM_SECURITY',
  DO_DRIVER_SECURITY = 'DO_DRIVER_SECURITY',
  DO_LICENSE_SECURITY = 'DO_LICENSE_SECURITY',
  DO_SEAL_SECURITY = 'DO_SEAL_SECURITY',
  DO_RETURN_SECURITY = 'DO_RETURN_SECURITY',
  DO_RETURN_TRUCK_CONDITION_SECURITY = 'DO_RETURN_TRUCK_CONDITION_SECURITY',
  ARRIVAL = 'ARRIVAL',
  TRUCK_CONDITION = 'TRUCK_CONDITION',
  DO_SIGNED = 'DO_SIGNED',
  WEIGHT_OUT = 'WEIGHT_OUT',
  WEIGHT_IN = 'WEIGHT_IN',
  WB_OUT_DO = 'WB_OUT_DO',
  WB_OUT_RESULT = 'WB_OUT_RESULT',
  DRIVER_ARRIVE_PROJECT = 'DO_DRIVER_ARRIVE_PROJECT',
  DRIVER_BNIB = 'DO_DRIVER_BNIB',
  DRIVER_RECEIPIENT = "DO_DRIVER_RECEIPIENT",
  DRIVER_WATER = "DO_DRIVER_WATER",
  DRIVER_DO = "DO_DRIVER_DO",
  DRIVER_UNBOXING = "DO_DRIVER_UNBOXING",
  DRIVER_EMTPY = "DO_DRIVER_EMPTY",
  DRIVER_FINISH = "DO_DRIVER_FINISH_PROJECT"
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
