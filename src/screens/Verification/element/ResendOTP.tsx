import { BText, BTouchableText } from '@/components';
import React from 'react';
import { View } from 'react-native';
import VerificationStyles from '../styles';
const ResendOTP = () => {
  return (
    <View style={VerificationStyles.resendContainer}>
      <BText style={VerificationStyles.intrutructionsTextDarkBold}>
        Tidak menerima OTP?
      </BText>
      <BTouchableText
        title=" Kirim Lagi"
        textStyle={VerificationStyles.intructionsTextRed}
      />
    </View>
  );
};
export default ResendOTP;