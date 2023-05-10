import React from "react";
import { View } from "react-native";
import { BText } from "@/components";
import { colors } from "@/constants";
import loginStyle from "../style";

function Label() {
  return (
    <View style={{ flexDirection: "row", width: "100%" }}>
      <BText style={loginStyle.inputLabel}>Nomor WhatsApp</BText>
      <BText style={[loginStyle.inputLabel, { color: colors.primary }]}>
        {" * "}
      </BText>
    </View>
  );
}
export default Label;
