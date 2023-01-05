export type buttonDataType = {
  icon: string | any;
  title: string;
  action: () => void;
};
export type QuickActionProps = {
  buttonProps: buttonDataType[];
  showsHorizontalScrollIndicator?: boolean;
  isHorizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  containerStyle?: {};
};
