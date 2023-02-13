interface CreateScheduleFirstStep {
  companyName: string;
  locationName?: string;
  title: string;
  products: [
    {
      name?: string;
      price?: number;
      total?: number;
      unit?: string;
    }
  ];
  lastDeposit?: number;
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
      name?: string;
      price?: number;
      total?: number;
      unit?: string;
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
  sphs: string[];
  products: [
    {
      name?: string;
      price?: number;
      total?: number;
      unit?: string;
    }
  ];
  lastDeposit?: number;
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
