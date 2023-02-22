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
  title: string;
  product?: {
    product_id?: string;
    display_name?: string;
    offering_price?: number;
    total_price?: number;
    quantity?: string;
  };
}

interface CreateDepositState {
  step: number;
  stepOne: CreateDepositFirstStep;
  stepTwo: CreateDepositSecondStep;
  sheetIndex: number;
  shouldScrollView: boolean;
  existingDepositID: string | null;
}

interface CreateDepositListResponse {
  id: string;
  createDepositID: string | null;
  companyName: string;
  locationName?: string;
  sph: string;
  product: {
    product_id?: string;
    display_name?: string;
    offering_price?: number;
    total_price?: number;
    quantity?: string;
  };
  deposit?: {
    createdAt: string;
    nominal: number;
    picts: any[];
  };
}

export type {
  CreateDepositState,
  CreateDepositFirstStep,
  CreateDepositSecondStep,
  CreateDepositListResponse,
};
