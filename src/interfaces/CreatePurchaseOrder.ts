interface ShippingAddress {
  id: string;
  Postal: {
    City: {
      name: string;
    };
  };
  CityName?: string;
}

interface RequestedProducts {
  id: string;
  offeringPrice: number;
  quantity: number;
  Product: {
    name: string;
    unit: string;
  };
}

interface QuotationLetters {
  id: string;
  number: string;
  QuotationRequest: {
    totalPrice: number;
  };
  RequestedProducts: RequestedProducts[];
}

interface CreatedSPHListResponse {
  id: string;
  name: string;
  ShippingAddress: ShippingAddress;
  QuotationLetters: QuotationLetters[];
}

export type {
  ShippingAddress,
  RequestedProducts,
  QuotationLetters,
  CreatedSPHListResponse,
};
