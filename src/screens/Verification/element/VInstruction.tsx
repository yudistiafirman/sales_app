import { BText, BTouchableText } from '@/components';
import React from 'react';
import VerificationStyles from '../styles';
const VIntstruction = ({ phoneNumber }: { phoneNumber: number }) => {
  return (
    <BText style={VerificationStyles.intructionsTextDark}>
      Masukkan OTP yang sudah dikirim ke
      <BText style={VerificationStyles.intructionsTextRed}>
        {' WhatsApp '}
      </BText>
      <BText style={VerificationStyles.intrutructionsTextDarkBold}>
        {phoneNumber}
      </BText>
      <BTouchableText
        textStyle={VerificationStyles.intructionsTextRed}
        title="Ganti?"
      />
    </BText>
  );
};
export default VIntstruction;
