/* eslint-disable react-native/no-inline-styles */
import { BText, BTouchableText } from '@/components';
import { resScale } from '@/utils';
import React from 'react';
import { View } from 'react-native';
import VerificationStyles from '../styles';
const VIntstruction = ({ phoneNumber, onPress }: { phoneNumber: string, onPress: () => void }) => {
  return (
    <View style={{ alignItems: 'center' }}>
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
          onPress={onPress}
          textStyle={VerificationStyles.intructionsTextRed}
          title="Ganti?"
        />
      </View>
    </View>
  );
};
export default VIntstruction;
