import { BButtonPrimary, BErrorText } from '@/components';
import { resScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { Image, SafeAreaView } from 'react-native';
import PhoneInput from './element/PhoneInput';
import Instruction from './element/Intstruction';
import Label from './element/Label';
import loginStyle from './style';
import { colors } from '@/constants';
const Login = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | unknown>('');

  const disableBtn = value.length < 10;

  const renderLogo = () => (
    <Image
      style={{ width: resScale(70), height: resScale(33) }}
      source={require('@/assets/logo/brik_logo.png')}
    />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => renderLogo(),
    });
  }, [navigation]);

  const sendOtp = async () => {
    let phoneNumberToSend = `+62${value}`;

    try {
      if (phoneNumberToSend !== '+6281321456789') {
        throw new Error('Nomor yang anda masukkan tidak terdaftar');
      }
      navigation.navigate('Verification', { phoneNumber: phoneNumberToSend });
      setValue('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <SafeAreaView style={loginStyle.container}>
      <Instruction />
      <Label />
      <PhoneInput value={value} onChangeText={setValue} />
      {errorMessage && <BErrorText text={errorMessage} />}
      <BButtonPrimary
        disable={disableBtn}
        buttonStyle={{
          width: resScale(328),
          marginTop: resScale(20),
          backgroundColor: disableBtn ? `${colors.primary}40` : colors.primary,
        }}
        onPress={sendOtp}
        title="Kirim OTP"
      />
    </SafeAreaView>
  );
};
export default Login;
