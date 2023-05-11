export type ButtonDataType = {
  icon: string | any;
  title: string;
  action: () => void;
};
export type QuickActionProps = {
  buttonProps: ButtonDataType[];
  showsHorizontalScrollIndicator?: boolean;
  isHorizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  containerStyle?: {};
};
