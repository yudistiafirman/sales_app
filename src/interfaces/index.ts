import { StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';

interface Input {
  label: string;
  isRequire: boolean;
  type: 'textInput' | 'cardOption' | 'comboDropdown' | 'area' | 'dropdown';
  onChange?: (e: any) => void;
  value: string | any;
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
  };
}

interface Styles {
  [key: string]: StyleProp<ViewStyle>;
}

// create visitation
interface CreateVisitationState {
  step: number;
  state: any[];
}

export type { Input, Styles, CreateVisitationState };
