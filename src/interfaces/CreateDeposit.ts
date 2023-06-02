import { PurchaseOrdersData, SalesOrdersData } from "./SelectConfirmedPO";

interface CreateDepositFirstStep {
    deposit?: {
        createdAt: string;
        nominal: number;
        picts: any[];
    };
}

interface CreateDepositSecondStep {
    companyName: string;
    locationName?: string;
    purchaseOrders: PurchaseOrdersData[];
    selectedSaleOrder: any;
    availableDeposit: number;
}

interface CreateDepositState {
    step: number;
    stepOne?: CreateDepositFirstStep;
    stepTwo?: CreateDepositSecondStep;
    sheetIndex: number;
    shouldScrollView: boolean;
    existingProjectID: string | undefined;
    isSearchingPurchaseOrder: boolean;
}

export type {
    CreateDepositState,
    CreateDepositFirstStep,
    CreateDepositSecondStep
};
