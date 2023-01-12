/* eslint-disable react-native/no-inline-styles */
import { BText, BTouchableText } from '@/components';
import { resScale } from '@/utils';
import React from 'react';
import { View } from 'react-native';
import VerificationStyles from '../styles';
const VIntstruction = ({ phoneNumber }: { phoneNumber: number }) => {
  return (
    <View style={{ alignItems: 'center', marginBottom: resScale(20) }}>
      <View style={{ flexDirection: 'row' }}>
        <BText style={VerificationStyles.intructionsTextDark}>
          Masukkan OTP yang sudah dikirim ke
        </BText>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <BText style={VerificationStyles.intructionsTextRed}>
          {' WhatsApp '}
        </BText>
        <BText style={VerificationStyles.intrutructionsTextDarkBold}>
          {`${phoneNumber}  `}
        </BText>
        <BTouchableText
          textStyle={VerificationStyles.intructionsTextRed}
          title="Ganti?"
        />
      </View>
    </View>
  );
};
export default VIntstruction;
