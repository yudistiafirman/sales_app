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
    <TouchableOpacity onPress={onPress} disabled={disable}>
      <View
        style={[
          style.buttonContainer,
          buttonStyle,
          isOutline ? style.outlineButton : null,
          disable ? style.disableStyle : null,
        ]}
        pointerEvents={isLoading ? 'none' : 'auto'}
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
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  buttonContainer: {
    paddingVertical: resScale(12),
    paddingHorizontal: resScale(12),
    borderRadius: 12,
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
    fontSize: respFS(16),
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
