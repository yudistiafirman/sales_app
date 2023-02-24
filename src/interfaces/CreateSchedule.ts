interface CreateScheduleFirstStep {
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
  lastDeposit?: {
    createdAt: string;
    nominal: number;
  };
  addedDeposit?: [
    {
      createdAt: string;
      nominal: number;
    }
  ];
}
interface CreateScheduleSecondStep {
  deliveryDate: string;
  deliveryTime: string;
  method: string;
  isConsecutive?: boolean;
  hasTechnicalRequest?: boolean;
  products: [
    {
      product_id?: string;
      display_name?: string;
      offering_price?: number;
      total_price?: number;
      quantity?: string;
    }
  ];
  totalDeposit: number;
}

interface CreateScheduleState {
  step: number;
  stepOne: CreateScheduleFirstStep;
  stepTwo: CreateScheduleSecondStep;
  sheetIndex: number;
  shouldScrollView: boolean;
  existingScheduleID: string | null;
}

interface CreateScheduleListResponse {
  id: string;
  createScheduleID: string | null;
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
  lastDeposit?: {
    createdAt: string;
    nominal: number;
  };
  addedDeposit?: [
    {
      createdAt: string;
      nominal: number;
    }
  ];
  deliveryDate: string;
  deliveryTime: string;
  method: string;
  isConsecutive?: boolean;
  hasTechnicalRequest?: boolean;
}

export type {
  CreateScheduleState,
  CreateScheduleFirstStep,
  CreateScheduleSecondStep,
  CreateScheduleListResponse,
};
