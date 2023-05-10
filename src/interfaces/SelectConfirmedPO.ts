export enum PurchaseOrderStatus {
  SUBMITTED = "SUBMITTED",
  CONFIRMED = "CONFIRMED",
  DECLINED = "DECLINED",
}

export enum DepositStatus {
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
}

export interface DepositPurchaseOrders {
  value?: number;
  status?: DepositStatus;
}

export interface PoProductData {
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

export interface SalesOrdersData {
  id?: string;
  number?: string;
  usedQuantity?: number;
  PoProduct?: PoProductData;
}

export interface PurchaseOrdersData {
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

export interface CreatedPurchaseOrderListResponse {
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
