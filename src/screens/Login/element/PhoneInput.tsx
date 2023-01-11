import { BText } from '@/components';
import loginStyle from '@/screens/Login/style';
import React from 'react';
import { View } from 'react-native';
import MaskInput from 'react-native-mask-input';
const PhoneInput = ({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: ((text: string) => void) & Function;
}) => {
  const phonenumberMask = [
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  return (
    <View style={loginStyle.phoneNumberInputContainer}>
      <View style={loginStyle.countryCodeContainer}>
        <BText style={loginStyle.counterCodeText}>+62</BText>
      </View>
      <View style={[loginStyle.maskInputContainer]}>
        <MaskInput
          value={value}
          style={loginStyle.maskInputStyle}
          showObfuscatedValue={false}
          placeholderFillCharacter=""
          placeholder="Masukkan nomor whatsapp"
          keyboardType="number-pad"
          onChangeText={(masked) => {
            onChangeText(masked);
          }}
          mask={phonenumberMask}
        />
      </View>
    </View>
  );
};
export default PhoneInput;