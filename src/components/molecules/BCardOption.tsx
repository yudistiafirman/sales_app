import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  ImageStyle,
  ImageProps,
} from 'react-native';
import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import BSpacer from '../atoms/BSpacer';
import BSvg from '../atoms/BSvg';
import BText from '../atoms/BText';

interface IProps {
  children?: React.ReactNode;
  icon: string | ImageProps;
  title: string;
  fullWidth?: boolean;
  isActive?: boolean;
  isClickable?: boolean;
  onPress?: () => void;
  flexDirection?: 'column' | 'row';
}

const baseStyle: StyleProp<ViewStyle> = {
  backgroundColor: colors.offWhite,
  borderRadius: layout.radius.md,
  height: resScale(80),
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
};

const baseStyleImage: StyleProp<ViewStyle> = {
  width: resScale(24),
  height: resScale(24),
};

const makeStyle = (props: IProps): StyleProp<ViewStyle> => {
  const { fullWidth = false, isActive = false, flexDirection = 'column' } = props;
  let style = { ...baseStyle, flexDirection };

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

const makeStyleImage = ({ isActive }: Partial<IProps>): StyleProp<ImageStyle> => {
  if (isActive) {
    return {
      ...baseStyleImage,
      tintColor: colors.primary,
    };
  }

  return {
    ...baseStyleImage,
    tintColor: colors.textInput.input,
  };
};

function BCardOption(props: IProps) {
  const { isClickable, icon, title, isActive, onPress, flexDirection } = props;

  return (
    <TouchableOpacity
      disabled={isClickable !== undefined ? !isClickable : false}
      style={makeStyle(props)}
      onPress={onPress}>
      {typeof icon === 'string' ? (
        <BSvg
          color={isActive ? colors.primary : colors.textInput.input}
          svgName={icon}
          type="fill"
        />
      ) : (
        <Image source={icon} style={makeStyleImage({ isActive })} />
      )}
      <BSpacer size="verySmall" />
      <BText {...(isActive && { color: 'primary' })}>{title}</BText>
    </TouchableOpacity>
  );
}

export default BCardOption;
