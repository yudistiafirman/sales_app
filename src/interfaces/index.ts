import {
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';

import * as React from 'react';
import { Details } from 'react-native-maps';

interface Input {
  label: string;
  isRequire: boolean;
  type:
    | 'quantity'
    | 'textInput'
    | 'cardOption'
    | 'comboDropdown'
    | 'area'
    | 'dropdown'
    | 'PIC'
    | 'autocomplete'
    | 'checkbox'
    | 'switch'
    | 'fileInput'
    | 'map'
    | 'autocomplete';
  hidePicLabel?: boolean;
  onChange?: (e: any) => void;
  onFocus?: (e: any) => void;
  value: string | any;
  placeholder?: string;
  loading?: boolean;
  isError?: boolean;
  customerErrorMsg?: string;
  LeftIcon?: () => JSX.Element;
  items?: any;
  keyboardType?: KeyboardTypeOptions;
  options?: Array<{
    title: string;
    value: string | any;
    onChange: () => void;
    icon?: ImageSourcePropType | undefined;
  }>;
  dropdown?: {
    items: {
      label: string;
      value: string | number | any;
    }[];
    onChange:
      | ((value: any) => void)
      | ((value: any[] | null) => void)
      | undefined;
    placeholder: string;
  };
  comboDropdown?: {
    itemsOne: {
      label: string;
      value: string | number | any;
    }[];
    itemsTwo: {
      label: string;
      value: string | number | any;
    }[];
    onChangeOne:
      | ((value: any) => void)
      | ((value: any[] | null) => void)
      | undefined;
    onChangeTwo:
      | ((value: any) => void)
      | ((value: any[] | null) => void)
      | undefined;
    placeholderOne: string;
    placeholderTwo: string;
    isErrorOne?: boolean;
    isErrorTwo?: boolean;
    errorMessageOne?: string;
    errorMessageTwo?: string;
    valueOne?: any;
    valueTwo?: any;
  };
  checkbox?: {
    disabled?: boolean;
    value: any;
    onValueChange: (value: any) => void;
  };
  onSelect?: (index: number | any) => void; //eg for pic radio
  isInputDisable?: boolean;
}

interface Styles {
  [key: string]: StyleProp<ViewStyle | TextStyle>;
}

interface Address {
  lat: any;
  id?: string;
  formattedAddress?: string;
  lan?: number;
  lon?: number;
  line1?: string;
  name?: string;
  longitude?: number;
  latitude?: number;
  postalId?: number;
  line2?: string;
}

// create visitation
interface CreateVisitationFirstStep {
  createdLocation: Address;
  locationAddress: Address;
  existingLocationId?: string;
}
interface CreateVisitationSecondStep {
  companyName: string;
  customerType: 'INDIVIDU' | 'COMPANY';
  projectName: string;
  projectId?: string;
  location: { [key: string]: any };
  pics: PIC[];
  options: {
    loading: boolean;
    items: { title: string; id: string }[] | null;
  };
  visitationId?: string;
  existingOrderNum?: number;
}
interface CreateVisitationThirdStep {
  stageProject: 'LAND_PREP' | 'FOUNDATION' | 'FORMWORK' | 'FINISHING';
  products: any[];
  estimationDate: {
    estimationWeek: number | null;
    estimationMonth: number | null;
  };
  paymentType: 'CBD' | 'CREDIT';
  notes: string;
}

interface CreateVisitationFourthStep {
  selectedDate: any;
  images: any[];
  kategoriAlasan?: 'FINISHED' | 'MOU_COMPETITOR';
  alasanPenolakan: string;
}

interface CreateVisitationState {
  step: number;
  stepOne: CreateVisitationFirstStep;
  stepTwo: CreateVisitationSecondStep;
  stepThree: CreateVisitationThirdStep;
  stepFour: CreateVisitationFourthStep;
  sheetIndex: number;
  shouldScrollView: boolean;
  existingVisitationId: string | null;
}

interface PIC {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  position?: string;
  isSelected?: boolean;
}

interface NavigationProps {
  navigate: (screen?: string) => void;
}

interface LatLang {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
  formattedAddress?: string;
  name?: string;
  PostalId?: any;
  line1?: string;
  distance?: {
    text?: string;
    value?: number;
  };
}

interface Region {
  longitude(
    arg0: string,
    longitude: any,
    latitude: any,
    arg3: string
  ): { result: any } | PromiseLike<{ result: any }>;
  latitude(
    arg0: string,
    longitude: any,
    latitude: any,
    arg3: string
  ): { result: any } | PromiseLike<{ result: any }>;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface BLocationProps {
  mapStyle?: ViewStyle | undefined;
  region?: Region & LatLang;
  onRegionChangeComplete?:
    | ((region: Region & LatLang, details: Details) => void)
    | undefined;
  CustomMarker?: React.ReactNode | undefined;
  isUninteractable?: boolean;
}

interface selectedCompanyInterface {
  id: string;
  name: string;
  Company: {
    id: string | null;
    name: string | null;
  };
  PIC: PIC[];
  Visitation: {
    finish_date: string | null;
    id: string;
    order: number;
    visitation_id: string | null;
  };
  locationAddress: {
    city?: string;
    district?: string;
    line1?: string;
    postalCode?: number;
    rural?: string;
  };
  mainPic: {
    id: string | null;
    name: string | null;
  };
}

interface SphStateInterface {
  selectedCompany: selectedCompanyInterface | null;
  picList: PIC[];
  selectedPic: any;
  isBillingAddressSame: boolean;
  billingAddress: {
    name: string;
    phone: string | number;
    addressAutoComplete: { [key: string]: any };
    fullAddress: string;
  };
  paymentType: string;
  paymentRequiredDocuments: { [key: string]: any };
  paymentDocumentsFullfilled: boolean;
  paymentBankGuarantee: boolean;
  chosenProducts: any[];
  useHighway: boolean;
}

type SphContextInterface = [
  SphStateInterface,
  (key: keyof SphStateInterface) => (data: any) => void,
  (index: number) => void,
  number
];

interface AdditionalPricesInterface {
  id: string;
  categoryId: string;
  createdById?: string;
  unit: string;
  price: number;
  type: string;
  min: number;
  max: number;
  createdAt: Date;
  updatedAt: Date;
}

interface productParentInterface {
  id: string;
  name: string;
  AdditionalPrices: AdditionalPricesInterface[];
}

interface ProductDataInterface {
  id: string;
  name: string;
  Price: {
    id: string;
    price: number;
  };
  Category: {
    id: string;
    name: string;
    parent_id: string;
    Parent: productParentInterface;
  };
}

interface visitationListResponse {
  id: string;
  visitationId: string | null;
  order: number;
  dateVisit: string;
  finishDate: string | null;
  isBooking: boolean;
  status: 'VISIT' | 'SPH' | 'PO' | 'SCHEDULING' | 'DO' | 'REJECTED';
  address: {
    id: string;
  };
  project: {
    id: string;
    name: string;
    stage: 'LAND_PREP' | 'FOUNDATION' | 'FORMWORK' | 'FINISHING';
    PIC: PIC[];
    mainPic: PIC & { type?: string };
    company: {
      id: string;
      name: string;
      displayName: string;
    };
    locationAddress: {
      id: string;
      line1?: string;
      line2?: string;
      rural?: string;
      district?: string;
      postalCode?: number;
      city?: string;
      lat?: string;
      lon?: string;
    };
  };
}

interface customerDataInterface {
  display_name: string;
  type: string;
  name: string;
  email: string | null;
  phone: string;
  position: string;
}

interface locationPayloadType {
  formattedAddress: string;
  postalId: number;
  lon: number;
  lat: number;
  line2?: string;
}

interface visitationPayload {
  id?: string;
  visitationId?: string;
  order: number;
  location: locationPayloadType;
  customerType?: 'INDIVIDU' | 'COMPANY';
  paymentType?: 'CBD' | 'CREDIT';
  estimationWeek?: number;
  estimationMonth?: number;
  visitationNotes?: string;
  dateVisit?: number;
  finishDate?: number; // ??
  bookingDate?: number;
  rejectNotes?: string;
  rejectCategory?: 'FINISHED' | 'MOU_COMPETITOR';
  isBooking?: boolean; // ??
  status?: 'VISIT' | 'SPH' | 'REJECTED' | '';
  files: filesType[];
  products: { id: string }[];
}

interface filesType {
  id: string;
  type: 'GALLERY' | 'COVER';
}

interface projectPayloadType {
  id?: string;
  locationAddressId?: string;
  name?: string;
  companyDisplayName?: string;
  location: locationPayloadType;
  stage?: 'LAND_PREP' | 'FOUNDATION' | 'FORMWORK' | 'FINISHING';
}

interface picPayloadType {
  name?: string;
  position?: string;
  phone?: string;
  email?: string;
  type?: 'PROJECT' | 'RECEIPENT' | 'SUPPLIER';
  isSelected?: boolean;
}

interface payloadPostType {
  visitation: visitationPayload;
  project: projectPayloadType;
  pic: picPayloadType[];
  files: filesType[];
}

interface visitationDataType {
  id?: number;
  name: string;
  location?: string;
  time?: string;
  status?: string;
  pilNames?: string[];
  pilStatus?: 'Selesai' | 'Belum Selesai';
}

interface projectResponseType {
  id: string;
  name: string;
  display_name: string;
  line1: string;
  rural: string;
  district: string;
  postal_code: number;
  city: string;
  projects: {
    id: string;
    name: string;
  }[];
  project_count: string;
}

export type {
  Input,
  Styles,
  CreateVisitationState,
  CreateVisitationFirstStep,
  CreateVisitationSecondStep,
  CreateVisitationThirdStep,
  PIC,
  NavigationProps,
  BLocationProps,
  Region,
  SphStateInterface,
  SphContextInterface,
  AdditionalPricesInterface,
  productParentInterface,
  ProductDataInterface,
  CreateVisitationFourthStep,
  visitationListResponse,
  customerDataInterface,
  locationPayloadType,
  visitationPayload,
  projectPayloadType,
  picPayloadType,
  payloadPostType,
  visitationDataType,
  projectResponseType,
  selectedCompanyInterface,
};
