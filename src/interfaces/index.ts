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
  type: 'textInput' | 'cardOption' | 'comboDropdown' | 'area' | 'dropdown';
  onChange?: (e: any) => void;
  value: string | any;
  isError?: boolean;
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
  };
}

interface Styles {
  [key: string]: StyleProp<ViewStyle | TextStyle>;
}

// create visitation
interface CreateVisitationState {
  step: number;
  state: any[];
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
  NavigationProps,
  Location,
  BLocationProps

};
