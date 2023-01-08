import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React from 'react';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import respFS from '@/utils/respFS';
import scaleSize from '@/utils/scale';

type BButtonPrimaryType = {
  title: string;
  onPress?: () => void;
  buttonStyle?: ViewStyle;
  titleStyle?: ViewStyle;
  isOutline?: boolean;
};
export default function BButtonPrimary({
  title,
  onPress = () => {},
  buttonStyle,
  titleStyle,
  isOutline = false,
}: BButtonPrimaryType) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          style.buttonContainer,
          buttonStyle,
          isOutline ? style.outlineButton : null,
        ]}
      >
        <Text
          style={[
            style.buttonTitle,
            titleStyle,
            isOutline ? style.outlineTitle : null,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  container: {},
  buttonContainer: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
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
    borderWidth: scaleSize.moderateScale(1),
  },
});
