import {
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  TextStyle,
} from 'react-native';

interface Input {
  label: string;
  isRequire: boolean;
  type:
    | 'textInput'
    | 'cardOption'
    | 'comboDropdown'
    | 'area'
    | 'dropdown'
    | 'PIC';
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
    valueOne?: any;
    valueTwo?: any;
  };
  onSelect?: (index: number) => void; //eg for pic radio
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

export type {
  Input,
  Styles,
  CreateVisitationState,
  CreateVisitationSecondStep,
  CreateVisitationThirdStep,
  NavigationProps,
  PIC,
};
