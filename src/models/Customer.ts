import { Address, Docs, ProjectDetail } from '@/interfaces';
import { PIC } from '@/interfaces';

export interface ICustomerListData {
  id: string;
  name: string;
  displayName?: string;
  type: 'INDIVIDU' | 'COMPANY';
  npwp?: string;
  nik?: string;
}

export interface IDocument {
  id?: string;
  name?: string;
  paymentType?: 'CBD' | 'CREDIT';
  isRequired?: boolean;
}

export interface ICustomerDeposit {
  availableDeposit?: number;
  totalDeposit?: number;
  scheduleDeposit?: number;
  usedDeposit?: number;
}

export interface CustomerFile {
  id?: string;
  type?: string;
  name?: string;
  url?: string;
}

export interface CustomerDocsPayType {
  customerDocId?: string;
  File?: CustomerFile;
  Document?: IDocument;
}

export interface CustomerDocs {
  cbd?: CustomerDocsPayType[];
  credit?: CustomerDocsPayType[];
}

export interface ICustomerDetail {
  id: string;
  displayName?: string;
  type: 'COMPANY' | 'INDIVIDU';
  paymentType: 'Cash Before Delivery' | 'Credit';
  npwp?: string;
  nik?: string;
  Pic?: PIC;
  CustomerDeposit?: ICustomerDeposit;
  BillingAddress?: Address;
  Projects: ProjectDetail[];
  CustomerDocs?: CustomerDocs;
}

export interface ICustomerState {
  customerListData?: CustomerListData[];
  isLoading: boolean;
  isRefreshing?: boolean;
  isLoadMore?: boolean;
  searchQuery?: string;
}
