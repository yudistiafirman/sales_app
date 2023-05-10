import { View, Text, StyleSheet } from "react-native";
import * as React from "react";
import font from "@/constants/fonts";
import colors from "@/constants/colors";
import resScale from "@/utils/resScale";
import { layout } from "@/constants";

type pillStatusType = {
  pilStatus?: string;
  color?: string;
};
export default function PillStatus({ pilStatus, color }: pillStatusType) {
  if (!pilStatus) {
    return null;
  }
  return (
    <View
      style={[
        pilStatus ? style.greenPill : null,
        color ? { backgroundColor: color } : null,
      ]}
    >
      <Text style={style.greenPillText}>{pilStatus}</Text>
    </View>
  );
}
const style = StyleSheet.create({
  greenPill: {
    padding: layout.pad.xs,
    backgroundColor: "#C2FCC8",
    paddingVertical: layout.pad.xs,
    paddingHorizontal: layout.pad.xs + layout.pad.md,
    borderRadius: layout.radius.xl,
  },
  grayColor: {
    backgroundColor: colors.status.grey,
  },
  greenPillText: {
    fontFamily: font.family.montserrat[300],
    fontSize: font.size.xs,
    color: colors.textInput.input,
  },
});
