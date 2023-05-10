import React from "react";
import { StyleProp, ViewStyle, View } from "react-native";
import { resScale } from "@/utils";
import { colors, layout } from "@/constants";

interface IProps {
  children: React.ReactNode;
  bgc?: "grey";
  radius?: "sm" | "md" | "lg";
  border?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

const containerStyle: StyleProp<ViewStyle> = {
  flex: 1,
  padding: layout.pad.md + layout.pad.ml,
};

const makeStyle = ({
  bgc,
  radius,
  border,
  paddingHorizontal,
  paddingVertical,
}: IProps): StyleProp<ViewStyle> => {
  let styles = containerStyle;
  if (bgc === "grey") {
    styles = {
      ...styles,
      backgroundColor: colors.offWhite,
    };
  }

  if (paddingHorizontal || paddingHorizontal === 0) {
    styles = {
      ...styles,
      paddingHorizontal,
    };
  }

  if (paddingVertical || paddingVertical === 0) {
    styles = {
      ...styles,
      paddingVertical,
    };
  }

  if (radius) {
    styles = {
      ...styles,
      borderRadius:
        radius === "sm"
          ? layout.radius.sm
          : radius === "md"
          ? layout.radius.md
          : layout.radius.lg,
    };
  }

  if (border) {
    styles = {
      ...styles,
      borderWidth: 1,
      borderColor: colors.border.default,
    };
  }

  return styles;
};

function BContainer(props: IProps) {
  const { children } = props;
  return <View style={makeStyle(props)}>{children}</View>;
}

export default BContainer;
