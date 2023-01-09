import colors from '@/constants/colors';
import font from '@/constants/fonts';
import { resScale } from '@/utils';
import * as React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';

interface BSearchBarProp {
  mode?: 'flat' | 'outlined' | undefined;
  left?: React.ReactNode;
  right?: React.ReactNode;
  placeholder?: string | undefined;
  onChangeText?: (((text: string) => void) & Function) | undefined;
  value?: string | undefined;
  multiline?: boolean | undefined;
  numberOfLines?: number | undefined;
  label?: string | undefined;
  disabled?: boolean | undefined;
  secureTextEntry?: boolean | undefined;
  activeOutlineColor?: string | undefined;
  outlineColor?: string | undefined;
  textInputStyle?: TextStyle | undefined;
  editable?: boolean | undefined;
  outlineStyle?: ViewStyle | undefined;
  placeHolderTextColor?: string | undefined;
  dense?: boolean | undefined;
  onFocus?: () => void;
}

const BSearchBarDefaultTextStyle = {
  fontFamily: font.family.montserrat['400'],
  fontSize: font.size.md,
  lineHeight: resScale(14),
  backgroundColor: colors.white,
  color: colors.textInput.input,
};

const BSearchBarDefaultContainerStyle = {
  borderRadius: resScale(4),
  height: resScale(40),
};

const BSearchBarDefaultProps = {
  mode: 'outlined',
  outlineColor: colors.textInput.inActive,
  activeOutlineColor: colors.primary,
  textInputStyle: BSearchBarDefaultTextStyle,
  outlineStyle: BSearchBarDefaultContainerStyle,
  placeHolderTextColor: colors.textInput.placeHolder,
  dense: true,
};

const BSearchBar = ({
  mode,
  left,
  right,
  placeholder,
  onChangeText,
  value,
  multiline,
  numberOfLines,
  label,
  disabled,
  secureTextEntry,
  activeOutlineColor,
  outlineColor,
  textInputStyle,
  editable,
  outlineStyle,
  placeHolderTextColor,
  dense,
  onFocus,
}: BSearchBarProp & typeof BSearchBarDefaultProps) => {
  return (
    <TextInput
      onFocus={onFocus}
      mode={mode}
      left={left}
      right={right}
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      multiline={multiline}
      numberOfLines={numberOfLines}
      label={label}
      disabled={disabled}
      secureTextEntry={secureTextEntry}
      activeOutlineColor={activeOutlineColor}
      outlineColor={outlineColor}
      style={textInputStyle}
      editable={editable}
      outlineStyle={outlineStyle}
      placeholderTextColor={placeHolderTextColor}
      dense={dense}
    />
  );
};

BSearchBar.defaultProps = BSearchBarDefaultProps;

export default BSearchBar;
