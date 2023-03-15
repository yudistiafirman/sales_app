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
  sphs: [
    {
      name: string;
      products?: [
        {
          product_id?: string;
          display_name?: string;
          offering_price?: number;
          total_price?: number;
          quantity?: string;
        }
      ];
    }
  ];
}

interface CreateDepositState {
  step: number;
  stepOne: CreateDepositFirstStep;
  stepTwo: CreateDepositSecondStep;
  sheetIndex: number;
  shouldScrollView: boolean;
  existingDepositID: string | null;
}


enum PurchaseOrderStatus {
  SUBMITTED= 'SUBMITTED',
  CONFIRMED= 'CONFIRMED',
  DECLINED= 'DECLINED'
}

enum DepositStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED'
}

interface DepositPurchaseOrders {
  value?:number;
  status?:DepositStatus
}

interface PoProductData {
  requestedQuantity?:number;
  RequestedProduct?:{
    displayName?:string;
    name?:string;
    offeringPrice?:number;
    Product?:{
      id?:string;
      name?:string;
      unit?:string;
      displayName?:string;
      category?: {
        name?: string;
        Parent?: {
            name?: string
        }
    }
    }
  }
}

interface SalesOrdersData {
  id?:string;
  number?:string;
  PoProduct?:PoProductData
}




interface PurchaseOrdersData {
  totalDeposit?:number;
  isExpired?:boolean;
  id?:string;
  status?:PurchaseOrderStatus;
  brikNumber?:string;
  customerNumber?:string;
  quotationLetterId?:string;
  createdAt?:string;
  updatedAt?:string;
  totalPrice?:number;
  SaleOrders?:SalesOrdersData[]
  DepositPurchaseOrders?:DepositPurchaseOrders[]
  PoProducts?:PoProductData[]
}



interface CreatedPurchaseOrderListResponse {
  companyName:string;
  id:string;
  address:{
    line1?:string | null;
    line2?:string | null;
    lat?:string | null;
    lon?:string | null
  };
  Company:{
    id?:string;
    name?:string;
    displayName?:string;
  };
  PurchaseOrders:PurchaseOrdersData[]
}

interface CreateDepositListResponse {
  id: string;
  createDepositID: string | null;
  companyName: string;
  locationName?: string;
  sphs: [
    {
      name: string;
      products?: [
        {
          product_id?: string;
          display_name?: string;
          offering_price?: number;
          total_price?: number;
          quantity?: string;
        }
      ];
    }
  ];
  deposit?: {
    createdAt: string;
    nominal: number;
  };
}

export type {
  CreateDepositState,
  CreateDepositFirstStep,
  CreateDepositSecondStep,
  CreateDepositListResponse,
  CreatedPurchaseOrderListResponse,
  SalesOrdersData,
  PurchaseOrdersData,
  PoProductData
};
