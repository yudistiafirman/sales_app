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

interface QuotationRequests {
  id: string;
  totalPrice: string;
  QuotationLetter: {
    number: string;
  };
  RequestedProducts: RequestedProducts[];
}

interface CreatedSPHListResponse {
  id: string;
  name: string;
  ShippingAddress: ShippingAddress;
  QuotationRequest: QuotationRequests[];
}

export {
  ShippingAddress,
  RequestedProducts,
  QuotationRequests,
  CreatedSPHListResponse,
};
