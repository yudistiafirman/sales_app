import React from "react";
import { View } from "react-native";
import { BText } from "@/components";
import { colors } from "@/constants";
import VerificationStyles from "../styles";

function OTPFieldLabel() {
  return (
    <View style={{ flexDirection: "row", width: "100%" }}>
      <BText style={VerificationStyles.otpLabel}>Kode OTP</BText>
      <BText style={[VerificationStyles.otpLabel, { color: colors.primary }]}>
        {" * "}
      </BText>
    </View>
  );
}
export default OTPFieldLabel;
