import React from 'react';
import VerificationStyles from '../styles';
import { BText } from '@/components';

function CountDown({ count }: { count: number }): JSX.Element {
  let finalCount = count.toString();
  if (count.toString().match(/^\d$/)) {
    finalCount = `0${count.toString()}`;
  }
  return (
    <BText style={VerificationStyles.countDownText}>
      Kirim lagi
      {`(00:${finalCount})`}
    </BText>
  );
}

export default CountDown;
