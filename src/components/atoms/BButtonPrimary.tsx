import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  TextStyle,
} from "react-native";
import React from "react";
import colors from "@/constants/colors";
import font from "@/constants/fonts";
import resScale from "@/utils/resScale";
import { layout } from "@/constants";

type BButtonPrimaryType = {
  title: string;
  onPress?: () => void;
  buttonStyle?: ViewStyle;
  titleStyle?: TextStyle;
  isOutline?: boolean;
  rightIcon?: (() => JSX.Element) | null;
  leftIcon?: (() => JSX.Element) | null;
  emptyIconEnable?: boolean;
  isLoading?: boolean;
  disable?: boolean;
};
export default function BButtonPrimary({
  title,
  onPress = () => {},
  buttonStyle,
  titleStyle,
  disable,
  isOutline = false,
  rightIcon,
  leftIcon,
  emptyIconEnable = false,
  isLoading,
}: BButtonPrimaryType) {
  return (
    <View pointerEvents={isLoading ? "none" : "auto"}>
      <TouchableOpacity
        style={[
          style.buttonContainer,
          buttonStyle,
          isOutline && style.outlineButton,
          disable && style.disableStyle,
        ]}
        onPress={onPress}
        disabled={disable}
      >
        <View>{leftIcon && leftIcon()}</View>
        <>{emptyIconEnable && <View style={{ height: resScale(24) }} />}</>
        {isLoading ? (
          <ActivityIndicator size={resScale(24)} color="white" />
        ) : (
          <Text
            style={[
              style.buttonTitle,
              titleStyle,
              isOutline ? style.outlineTitle : null,
              disable && style.disableText,
            ]}
          >
            {title}
          </Text>
        )}

        <View>{rightIcon && rightIcon()}</View>
        <>{emptyIconEnable && <View style={{ height: resScale(24) }} />}</>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  buttonContainer: {
    padding: layout.pad.md,
    borderRadius: layout.radius.md,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: colors.primary,
    borderWidth: resScale(1),
    alignItems: "center",
  },
  disableStyle: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  disableText: {
    color: colors.tertiary,
  },
  buttonTitle: {
    textAlign: "center",
    color: colors.white,
    fontFamily: font.family.montserrat[600],
    fontSize: font.size.lg,
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
