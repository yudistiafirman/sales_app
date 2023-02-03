import React from 'react';
import { colors, fonts } from '@/constants';
import { TextStyle } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { resScale } from '@/utils';

interface IProps extends Partial<TextInputProps> {
  rounded?: boolean;
  disabled?: boolean;
}

const baseStyle: TextStyle = {
  fontFamily: fonts.family.montserrat['400'],
  fontSize: fonts.size.md,
  lineHeight: resScale(14),
  backgroundColor: colors.white,
  color: colors.textInput.input,
  // placeho
};

const baseContainerStyle: TextStyle = {
  borderRadius: resScale(4),
  minHeight: resScale(40),
  backgroundColor: colors.white,
};

const defaultProps = {
  mode: 'outlined',
  outlineColor: colors.textInput.inActive,
  activeOutlineColor: colors.primary,
  // placeHolderTextColor: colors.primary,
  textInputStyle: baseStyle,
  outlineStyle: baseContainerStyle,
  dense: true,
};

const BTextInput = ({ ...props }: IProps & typeof defaultProps) => (
  <TextInput {...props} placeholderTextColor={colors.textInput.placeHolder} />
);

BTextInput.defaultProps = defaultProps;

export default BTextInput;
