import {
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  TextStyle,
} from 'react-native';

import * as React from 'react';
import { Details } from 'react-native-maps';

interface Input {
  label: string;
  isRequire: boolean;
  type:
    | 'textInput'
    | 'cardOption'
    | 'comboDropdown'
    | 'area'
    | 'dropdown'
    | 'PIC'
    | 'autocomplete'
    | 'switch'
    | 'fileInput'
    | 'map';
  hidePicLabel?: boolean;
  onChange?: (e: any) => void;
  onFocus?: (e: any) => void;
  value: string | any;
  placeholder?: string;
  loading?: boolean;
  isError?: boolean;
  items?: any;
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
  onSelect?: (index: number | any) => void; //eg for pic radio
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
}

// create visitation
interface CreateVisitationFirstStep {
  createdLocation: Address;
  locationAddress: Address;
}
interface CreateVisitationSecondStep {
  companyName: string;
  customerType: string;
  projectName: string;
  pics: PIC[];
  options: {
    loading: false;
    items: any[] | null;
  };
}
interface CreateVisitationThirdStep {
  stageProject: string;
  products: any[];
  estimationDate: {
    estimationWeek: number | null;
    estimationMonth: number | null;
  };
  paymentType: string;
  notes: string;
}
interface CreateVisitationState {
  step: number;
  stepOne: CreateVisitationFirstStep;
  stepTwo: CreateVisitationSecondStep;
  stepThree: CreateVisitationThirdStep;
  sheetIndex: number;
  shouldScrollView: boolean;
}

interface PIC {
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

interface SphStateInterface {
  selectedCompany: any;
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
  (key: string) => (data: any) => void,
  (index: number) => void
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
};
