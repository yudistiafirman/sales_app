import React from "react";
import { BText } from "@/components";
import loginStyle from "../style";

function Instruction() {
  return (
    <BText style={loginStyle.textInfo}>
      Masukkan No. Telepon
      <BText style={loginStyle.whatsapp}>{" WhatsApp "}</BText>
      untuk Lanjut.
    </BText>
  );
}
export default Instruction;
