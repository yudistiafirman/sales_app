import React from 'react';
import { Colors, Font } from '@/constants';
import { TextStyle } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { scaleSize } from '@/utils';

interface IProps extends Partial<TextInputProps> {
  rounded?: boolean;
}

const baseStyle = {
  fontFamily: Font.family.montserrat['400'],
  fontSize: Font.size.md,
  lineHeight: scaleSize.moderateScale(14),
  backgroundColor: Colors.white,
  color: Colors.textInput.input,
};

const baseContainerStyle: TextStyle = {
  borderRadius: scaleSize.moderateScale(4),
  minHeight: scaleSize.moderateScale(40),
  backgroundColor: Colors.white,
};

const defaultProps = {
  mode: 'outlined',
  outlineColor: Colors.textInput.inActive,
  activeOutlineColor: Colors.primary,
  placeHolderTextColor: Colors.textInput.placeHolder,
  textInputStyle: baseStyle,
  outlineStyle: baseContainerStyle,
  dense: true,
};

const BTextInput = ({ ...props }: IProps & typeof defaultProps) => (
  <TextInput {...props} />
);

BTextInput.defaultProps = defaultProps;

export default BTextInput;
