interface ShippingAddress {
  id: string;
  Postal: {
    City: {
      name: string;
    };
  };
  CityName?: string;
}

interface Products {
  id: string;
  offeringPrice: number;
  quantity: number;
  Product: {
    name: string;
    unit: string;
    displayName:string;
    category: {
      name: string,
      Parent: {
          name: string
      }
  }
  };
}

interface QuotationRequests {
  id: string;
  totalPrice: string;
  QuotationLetter: {
    number: string;
    id: string;
  };
  products: Products[];
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
  isRequiredPo?: boolean;
}

interface ProjectDocs {
  projectDocId?: string | null;
  File?: null;
  Document?: Documents;
}

interface PostPoPayload {
  quotationLetterId: string; //uuid,
  projectId: string; //uuid,
  poFiles: { fileId: string }[];
  projectDocs: {
    // projectDocId: string
    documentId: string;
    fileId: string;
  }[];
  poNumber: string;
  totalPrice: number;
  poProducts: {
    requestedProductId: string;
    requestedQuantity: number;
  }[];
}

interface DocumentsData {
  id?: string;
  QuotationRequest?: {
    id?: string;
    paymentType?: 'CREDIT' | 'CBD';
    ProjectDocs?: ProjectDocs[];
  };
}

interface UploadFilesResponsePayload {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  name: string;
  url: string;
}

export {
  ShippingAddress,
  Products,
  QuotationRequests,
  CreatedSPHListResponse,
  DocumentsData,
  ProjectDocs,
  PostPoPayload,
  UploadFilesResponsePayload
};
