import React from 'react';
import { colors, font } from '@/constants';
import { TextStyle } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { scaleSize } from '@/utils';

interface IProps extends Partial<TextInputProps> {
  rounded?: boolean;
}

const baseStyle = {
  fontFamily: font.family.montserrat['400'],
  fontSize: font.size.md,
  lineHeight: scaleSize.moderateScale(14),
  backgroundColor: colors.white,
  color: colors.textInput.input,
};

const baseContainerStyle: TextStyle = {
  borderRadius: scaleSize.moderateScale(4),
  minHeight: scaleSize.moderateScale(40),
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
