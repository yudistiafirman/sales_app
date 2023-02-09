import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { colors, fonts, layout } from '@/constants';
import { resScale } from '@/utils';
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
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
    lineHeight: resScale(14),
    backgroundColor: colors.white,
    color: colors.textInput.input,
    borderRadius: resScale(4),
    borderColor: colors.textInput.inActive,
    zIndex: 1,
  },
  activeInput: {
    borderColor: colors.black,
    borderWidth: 1,
    borderBottomEndRadius: layout.radius.sm,
    borderBottomStartRadius: layout.radius.sm,
  },
  active: {
    position: 'absolute',
    top: resScale(50),
    borderRadius: layout.radius.sm,
    borderColor: colors.border.default,
    borderWidth: 1,
  },
  dropdown: {
    backgroundColor: colors.white,
    zIndex: 10,
  },
  separator: {
    backgroundColor: colors.border.default,
    paddingHorizontal: resScale(5),
    width: '95%',
    alignSelf: 'center',
  },
  error: {
    borderColor: colors.primary,
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
          style: {
            fontFamily: fonts.family.montserrat[400],
            color: colors.textInput.input,
          },
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
