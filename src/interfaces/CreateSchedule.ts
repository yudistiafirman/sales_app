import { PurchaseOrdersData, SalesOrdersData } from './SelectConfirmedPO';

interface CreateScheduleFirstStep {
  companyName: string;
  locationName?: string;
  purchaseOrders: PurchaseOrdersData[];
}

interface CreateScheduleSecondStep {
  deliveryDate?: string;
  deliveryTime?: string;
  method?: string;
  isConsecutive?: boolean;
  hasTechnicalRequest?: boolean;
  totalDeposit?: number;
  inputtedVolume?: number;
  salesOrder?: SalesOrdersData;
}

interface CreateScheduleState {
  step: number;
  stepOne: CreateScheduleFirstStep;
  stepTwo: CreateScheduleSecondStep;
  sheetIndex: number;
  shouldScrollView: boolean;
  existingProjectID: string | undefined;
  isSearchingPurchaseOrder: boolean;
}

export type {
  CreateScheduleState,
  CreateScheduleFirstStep,
  CreateScheduleSecondStep,
};
