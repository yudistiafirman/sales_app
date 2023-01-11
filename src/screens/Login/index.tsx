import { BButtonPrimary } from '@/components';
import { resScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { Image, SafeAreaView } from 'react-native';
import PhoneInput from './element/PhoneInput';
import Instruction from './element/Intstruction';
import Label from './element/Label';
import loginStyle from './style';
const Login = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState('');
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
  return (
    <SafeAreaView style={loginStyle.container}>
      <Instruction />
      <Label />
      <PhoneInput value={value} onChangeText={setValue} />
      <BButtonPrimary
        buttonStyle={{ width: resScale(328) }}
        onPress={() => navigation.navigate('Verification')}
        title="Kirim OTP"
      />
    </SafeAreaView>
  );
};
export default Login;