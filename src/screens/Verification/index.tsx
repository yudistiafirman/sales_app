import { BButtonPrimary } from '@/components';
import BErrorText from '@/components/atoms/BErrorText';
import BHeaderIcon from '@/components/atoms/BHeaderIcon';
import { resScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { View, Image } from 'react-native';
import OTPField from './element/OTPField';
import OTPFieldLabel from './element/OTPFieldLabel';
import ResendOTP from './element/ResendOTP';
import VIntstruction from './element/VInstruction';
import VerificationStyles from './styles';
const Verification = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: renderHeaderLeft,
    });
  }, [navigation]);
  const renderHeaderLeft = () => (
    <BHeaderIcon
      size={resScale(30)}
      onBack={() => navigation.goBack()}
      iconName="chevron-left"
    />
  );
  return (
    <View style={VerificationStyles.container}>
      <Image
        style={VerificationStyles.otpMessageImage}
        source={require('@/assets/illustration/ic_otp_message.png')}
      />
      <VIntstruction />
      <OTPFieldLabel />
      <OTPField />
      <BErrorText text="Nomor yang Anda masukkan tidak terdaftar" />
      <ResendOTP />
      <BButtonPrimary
        buttonStyle={{ width: resScale(338) }}
        onPress={() => navigation.navigate('Verification')}
        title="Log In"
      />
    </View>
  );
};
export default Verification;