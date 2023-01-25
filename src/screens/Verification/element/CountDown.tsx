import { BText } from '@/components';
import font from '@/constants/fonts';
import React from 'react';
import { colors } from '@/constants';
import VerificationStyles from '../styles';

const CountDown = ({ count }: { count: number }): JSX.Element => {
  return (
    <BText style={VerificationStyles.countDownText}>
      Kirim lagi {`(00:${count})`}
    </BText>
  );
};

export default CountDown;
