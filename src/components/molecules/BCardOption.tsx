import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';

import BText from '../atoms/BText';
import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import BSpacer from '../atoms/BSpacer';

interface IProps {
  children?: React.ReactNode;
  icon: ImageSourcePropType | undefined;
  title: string;
  fullWidth?: boolean;
  isActive?: boolean;
  onPress?: () => void;
}

const baseStyle: StyleProp<ViewStyle> = {
  backgroundColor: colors.offWhite,
  borderRadius: layout.radius.md,
  height: resScale(80),
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
};

const makeStyle = (props: IProps): StyleProp<ViewStyle> => {
  const { fullWidth = false, isActive = false } = props;
  let style = baseStyle;

  if (fullWidth) {
    style = {
      ...style,
      flex: 1,
    };
  }

  if (isActive) {
    style = {
      ...style,
      borderColor: colors.primary,
      borderWidth: 1,
    };
  }

  return style;
};

const makeStyleImage = ({
  isActive,
}: Partial<IProps>): StyleProp<ImageStyle> => {
  if (isActive) {
    return {
      tintColor: colors.primary,
    };
  }

  return {
    tintColor: colors.textInput.input,
  };
};

const BCardOption = (props: IProps) => {
  const { icon, title, isActive, onPress } = props;

  return (
    <TouchableOpacity style={makeStyle(props)} onPress={onPress}>
      <Image source={icon} style={makeStyleImage({ isActive })} />
      <BSpacer size={'verySmall'} />
      <BText {...(isActive && { color: 'primary' })}>{title}</BText>
    </TouchableOpacity>
  );
};

export default BCardOption;
