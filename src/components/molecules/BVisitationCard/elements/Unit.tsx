import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Icons from "react-native-vector-icons/Entypo";
import resScale from "@/utils/resScale";
import { colors, fonts, layout } from "@/constants";

type UnitType = {
  unit?: string;
};
export default function Unit({ unit }: UnitType) {
  if (!unit) {
    return null;
  }
  return (
    <View style={[style.container]}>
      <Icons
        name="text-document"
        style={style.iconStyle}
        size={resScale(13)}
        color={colors.black}
      />
      <Text style={style.textStyle}>{unit}</Text>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    marginRight: layout.pad.md,
    alignItems: "center",
    flexDirection: "row",
  },
  iconStyle: {
    marginRight: layout.pad.md,
  },
  textStyle: {
    fontFamily: fonts.family.montserrat[300],
    color: colors.text.darker,
    fontSize: fonts.size.xs,
  },
});
