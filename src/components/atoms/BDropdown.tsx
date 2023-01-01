import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Colors, Font } from '@/constants';
import { scaleSize } from '@/utils';

interface IProps {
  open: boolean;
  items: {
    label: string;
    value: string;
  }[];
  value: any;
  // setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // setValue: React.Dispatch<React.SetStateAction<null>>;
  // setItems: React.Dispatch<
  //   React.SetStateAction<
  //     {
  //       label: string;
  //       value: string;
  //     }[]
  //   >
  // >;
  onChange:
    | ((value: any) => void)
    | ((value: any[] | null) => void)
    | undefined;
  placeholder: string;
}

const styles = {
  base: {
    fontFamily: Font.family.montserrat[400],
    fontSize: Font.size.md,
    lineHeight: scaleSize.moderateScale(14),
    backgroundColor: Colors.white,
    color: Colors.textInput.input,
    borderRadius: scaleSize.moderateScale(4),
    borderColor: Colors.textInput.inActive,
    zIndex: 1,
  },
  active: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  dropdown: {
    backgroundColor: Colors.offWhite,
    zIndex: 10,
  },
};

const BDropdown = (props: IProps) => {
  const [open, setOpen] = React.useState(props.open);
  const [value, setValue] = React.useState(props.value);
  const [items, setItems] = React.useState(props.items);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      listMode="SCROLLVIEW"
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      onChangeValue={props.onChange}
      placeholder={props.placeholder}
      labelProps={{
        numberOfLines: 1,
      }}
      style={[styles.base, open ? [styles.active, styles.dropdown] : {}]}
      dropDownContainerStyle={[
        styles.base,
        open ? [styles.active, styles.dropdown] : {},
      ]}
      onClose={() => {
        setOpen(false);
      }}
    />
  );
};

export default BDropdown;
