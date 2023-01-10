import {
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  TextStyle,
} from 'react-native';

import * as React from 'react';
import { Details, Region } from 'react-native-maps';

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
    | 'autocomplete';
  onChange?: (e: any) => void;
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

// create visitation

interface CreateVisitationSecondStep {
  companyName: string;
  customerType: string;
  projectName: string;
  location: {};
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
  stepOne: {};
  stepTwo: CreateVisitationSecondStep;
  stepThree: CreateVisitationThirdStep;
  sheetIndex: number;
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

interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface BLocationProps {
  mapStyle?: ViewStyle | undefined;
  region?: Location;
  onRegionChange?: ((region: Region, details: Details) => void) | undefined;
  coordinate: Region;
  CustomMarker?: React.ReactNode | undefined;
}

export type {
  Input,
  Styles,
  CreateVisitationState,
  CreateVisitationSecondStep,
  CreateVisitationThirdStep,
  PIC,
  NavigationProps,
  Location,
  BLocationProps,
};
