import React from 'react';
import loginStyle from '../style';
import { BText } from '@/components';

function Instruction() {
  return (
    <BText style={loginStyle.textInfo}>
      Masukkan No. Telepon
      <BText style={loginStyle.whatsapp}>{' WhatsApp '}</BText>
      untuk Lanjut.
    </BText>
  );
}
export default Instruction;
