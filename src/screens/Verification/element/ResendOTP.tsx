import React from "react";
import { View } from "react-native";
import { BText, BTouchableText } from "@/components";
import VerificationStyles from "../styles";
import CountDown from "./CountDown";

function ResendOTP({
  count,
  onPress,
}: {
  count: number;
  onPress?: () => void;
}) {
  return (
    <View style={VerificationStyles.resendContainer}>
      <BText style={VerificationStyles.intrutructionsTextDarkBold}>
        Tidak menerima OTP?{" "}
      </BText>
      {count === 0 ? (
        <BTouchableText
          onPress={onPress}
          title=" Kirim Lagi"
          textStyle={VerificationStyles.intructionsTextRed}
        />
      ) : (
        <CountDown count={count} />
      )}
    </View>
  );
}
export default ResendOTP;
