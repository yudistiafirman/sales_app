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
}

interface CreateDepositState {
  step: number;
  stepOne: CreateDepositFirstStep;
  stepTwo: CreateDepositSecondStep;
  sheetIndex: number;
  shouldScrollView: boolean;
  existingProjectID: string | null;
  isSearchingPurchaseOrder: boolean;
}

enum PurchaseOrderStatus {
  SUBMITTED = 'SUBMITTED',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
}

enum DepositStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
}

interface DepositPurchaseOrders {
  value?: number;
  status?: DepositStatus;
}

interface PoProductData {
  id?: string;
  requestedQuantity?: number;
  RequestedProduct?: {
    displayName?: string;
    name?: string;
    offeringPrice?: number;
    Product?: {
      id?: string;
      name?: string;
      unit?: string;
      displayName?: string;
      category?: {
        id?: string;
        name?: string;
        Parent?: {
          name?: string;
        };
      };
    };
  };
}

interface SalesOrdersData {
  id?: string;
  number?: string;
  PoProduct?: PoProductData;
}

interface PurchaseOrdersData {
  totalDeposit?: number;
  isExpired?: boolean;
  id?: string;
  status?: PurchaseOrderStatus;
  brikNumber?: string;
  customerNumber?: string;
  quotationLetterId?: string;
  createdAt?: string;
  updatedAt?: string;
  totalPrice?: number;
  SaleOrders?: SalesOrdersData[];
  DepositPurchaseOrders?: DepositPurchaseOrders[];
  PoProducts?: PoProductData[];
}

interface CreatedPurchaseOrderListResponse {
  companyName: string;
  id: string;
  name: string;
  address: {
    line1?: string | null;
    line2?: string | null;
    lat?: string | null;
    lon?: string | null;
  };
  Company: {
    id?: string;
    name?: string;
    displayName?: string;
  };
  PurchaseOrders: PurchaseOrdersData[];
}

export type {
  CreateDepositState,
  CreateDepositFirstStep,
  CreateDepositSecondStep,
  CreatedPurchaseOrderListResponse,
  SalesOrdersData,
  PurchaseOrdersData,
  PoProductData,
};
