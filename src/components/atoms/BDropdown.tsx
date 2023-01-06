import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Colors, Font, Layout } from '@/constants';
import { scaleSize } from '@/utils';
import { Styles } from '@/interfaces';
import BText from './BText';

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
  isError?: boolean;
  errorMessage?: string;
}

const styles: Styles = {
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
  activeInput: {
    borderColor: Colors.black,
    borderWidth: 1,
    borderBottomEndRadius: Layout.radius.sm,
    borderBottomStartRadius: Layout.radius.sm,
  },
  active: {
    position: 'absolute',
    top: scaleSize.verticalScale(50),
    borderRadius: Layout.radius.sm,
    borderColor: Colors.border.default,
    borderWidth: 1,
  },
  dropdown: {
    backgroundColor: Colors.white,
    zIndex: 10,
  },
  separator: {
    backgroundColor: Colors.border.default,
    paddingHorizontal: scaleSize.moderateScale(5),
    width: '95%',
    alignSelf: 'center',
  },
  error: {
    borderColor: Colors.primary,
  },
};

const BDropdown = (props: IProps) => {
  const { isError, errorMessage } = props;
  const [open, setOpen] = React.useState(props.open);
  const [value, setValue] = React.useState(props.value);
  const [items, setItems] = React.useState(props.items);

  return (
    <React.Fragment>
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
        style={[
          styles.base,
          open
            ? [styles.activeInput, styles.dropdown]
            : isError
            ? [styles.error]
            : {},
        ]}
        dropDownContainerStyle={[
          styles.base,
          open ? [styles.active, styles.dropdown] : {},
        ]}
        itemSeparator={true}
        itemSeparatorStyle={styles.separator}
        onClose={() => {
          setOpen(false);
        }}
      />
      {isError && (
        <BText size="small" color="primary" bold="100">
          {errorMessage}
        </BText>
      )}
    </React.Fragment>
  );
};

export default BDropdown;
