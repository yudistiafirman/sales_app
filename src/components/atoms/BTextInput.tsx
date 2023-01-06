import React from 'react';
import { colors, fonts } from '@/constants';
import { TextStyle } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { resScale } from '@/utils';

interface IProps extends Partial<TextInputProps> {
  rounded?: boolean;
}

const baseStyle = {
  fontFamily: fonts.family.montserrat['400'],
  fontSize: fonts.size.md,
  lineHeight: resScale(14),
  backgroundColor: colors.white,
  color: colors.textInput.input,
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
  placeHolderTextColor: colors.textInput.placeHolder,
  textInputStyle: baseStyle,
  outlineStyle: baseContainerStyle,
  dense: true,
};

const BTextInput = ({ ...props }: IProps & typeof defaultProps) => (
  <TextInput {...props} />
);

BTextInput.defaultProps = defaultProps;

export default BTextInput;
