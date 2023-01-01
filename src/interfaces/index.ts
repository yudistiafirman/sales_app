import { StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';

interface Input {
  label: string;
  isRequire: boolean;
  type: 'textInput' | 'cardOption' | 'estimationDate' | 'area';
  onChange?: (e: any) => void;
  value: string | any;
  options?: Array<{
    icon: ImageSourcePropType | undefined;
    title: string;
    value: string;
    onChange: () => void;
  }>;
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
