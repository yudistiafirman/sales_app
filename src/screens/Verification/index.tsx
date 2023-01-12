import { BButtonPrimary } from '@/components';
import BErrorText from '@/components/atoms/BErrorText';
import BHeaderIcon from '@/components/atoms/BHeaderIcon';
import { colors } from '@/constants';
import { resScale } from '@/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Image } from 'react-native';
import OTPField from './element/OTPField';
import OTPFieldLabel from './element/OTPFieldLabel';
import ResendOTP from './element/ResendOTP';
import VIntstruction from './element/VInstruction';
import VerificationStyles from './styles';

import {
  retrieveUserSession,
  storeUserSession,
} from '@/actions/StorageActions';
import EncryptedStorage from 'react-native-encrypted-storage';
const Verification = () => {
  const route = useRoute();
  const { phoneNumber } = route.params;
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const [countDownOtp, setCountDownOtp] = useState<number>(10);
  const [errorOtp, setErrorOtp] = useState<string | unknown>('');
  const disabled = value.length < 6;
  let timer = useRef();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: renderHeaderLeft,
    });
  }, [navigation]);
  useEffect(() => {
    timer.current = setInterval(() => {
      if (countDownOtp !== 0) {
        setCountDownOtp((prevState) => prevState - 1);
      }
    }, 1000);
    return () => {
      clearInterval(timer.current);
    };
  }, [countDownOtp]);

  const renderHeaderLeft = () => (
    <BHeaderIcon
      size={resScale(30)}
      onBack={() => navigation.goBack()}
      iconName="chevron-left"
    />
  );

  const onLogin = async () => {
    if (value.length === 6) {
      if (value === '123456') {
        await EncryptedStorage.setItem(
          'islogin',
          JSON.stringify({ phone: phoneNumber })
        );
        setErrorOtp('');
      } else {
        setErrorOtp('Kode yang anda masukan salah');
      }
    }
  };
  const onResendOtp = () => {
    setErrorOtp('');
    setCountDownOtp(10);
  };
  return (
    <View style={VerificationStyles.container}>
      <Image
        style={VerificationStyles.otpMessageImage}
        source={require('@/assets/illustration/ic_otp_message.png')}
      />
      <VIntstruction phoneNumber={phoneNumber} />
      <OTPFieldLabel />
      <OTPField value={value} setValue={setValue} />
      {errorOtp && <BErrorText text={errorOtp} />}

      <ResendOTP count={countDownOtp} onPress={onResendOtp} />

      <BButtonPrimary
        disable={disabled}
        buttonStyle={{
          width: resScale(338),
          backgroundColor: disabled ? `${colors.primary}40` : colors.primary,
        }}
        onPress={onLogin}
        title="Log In"
      />
    </View>
  );
};
export default Verification;
