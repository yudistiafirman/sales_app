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
    id: string;
  };
  RequestedProducts: RequestedProducts[];
}

interface CreatedSPHListResponse {
  id: string;
  name: string;
  ShippingAddress: ShippingAddress;
  QuotationRequests: QuotationRequests[];
}

interface Documents {
  id?: string;
  name?: string;
  paymentType?: 'CREDIT' | 'CBD';
  isRequired?: boolean;
}

interface ProjectDocs {
  projectDocId?: string | null;
  File?: null;
  Document?: Documents;
}

interface DocumentsData {
  id?: string;
  QuotationRequest?: {
    id?: string;
    paymentType?: 'CREDIT' | 'CBD';
    ProjectDocs?: ProjectDocs[];
  };
}

export {
  ShippingAddress,
  RequestedProducts,
  QuotationRequests,
  CreatedSPHListResponse,
  DocumentsData,
  ProjectDocs,
};
