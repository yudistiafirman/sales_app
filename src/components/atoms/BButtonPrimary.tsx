import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import respFS from '@/utils/resFontSize';
import resScale from '@/utils/resScale';
import { layout } from '@/constants';

type BButtonPrimaryType = {
  title: string;
  onPress?: () => void;
  buttonStyle?: ViewStyle;
  titleStyle?: ViewStyle;
  isOutline?: boolean;
  rightIcon?: () => JSX.Element;
  leftIcon?: () => JSX.Element;
  disable?: boolean;
  isLoading?: boolean;
};
export default function BButtonPrimary({
  title,
  onPress = () => {},
  buttonStyle,
  titleStyle,
  isOutline = false,
  rightIcon,
  leftIcon,
  disable,
  isLoading,
}: BButtonPrimaryType) {
  return (
    <View pointerEvents={isLoading ? 'none' : 'auto'}>
      <TouchableOpacity
        style={[
          style.buttonContainer,
          buttonStyle,
          isOutline ? style.outlineButton : null,
          disable ? style.disableStyle : null,
        ]}
        onPress={onPress}
        disabled={disable}
      >
        <View>{leftIcon ? leftIcon() : null}</View>
        {isLoading ? (
          <ActivityIndicator size={resScale(24)} color={'white'} />
        ) : (
          <Text
            style={[
              style.buttonTitle,
              titleStyle,
              isOutline ? style.outlineTitle : null,
            ]}
          >
            {title}
          </Text>
        )}

        <View>{rightIcon ? rightIcon() : null}</View>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  buttonContainer: {
    padding: layout.pad.md,
    borderRadius: layout.radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  disableStyle: {
    backgroundColor: colors.disabled,
  },
  buttonTitle: {
    textAlign: 'center',
    color: colors.white,
    fontFamily: font.family.montserrat[600],
    fontSize: font.size.lg,
    fontWeight: '600',
  },
  outlineTitle: {
    color: colors.primary,
  },
  outlineButton: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: resScale(1),
  },
});
