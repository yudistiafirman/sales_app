import { BButtonPrimary, BErrorText, BSpacer } from '@/components';
import { resScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { Image, SafeAreaView } from 'react-native';
import PhoneInput from './element/PhoneInput';
import Instruction from './element/Intstruction';
import Label from './element/Label';
import loginStyle from './style';
import { colors, layout } from '@/constants';
import { setPhoneNumber } from '@/redux/reducers/authReducer';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import BrikApiCommon from '@/brikApi/BrikApiCommon';
import Spinner from 'react-native-loading-spinner-overlay';
interface LoginState {
  errorMessage: string | unknown;
  loading: boolean;
  phoneNumber: string;
}
const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loginState, setLoginState] = useState<LoginState>({
    errorMessage: '',
    loading: false,
    phoneNumber: '',
  });

  const { errorMessage, loading, phoneNumber } = loginState;
  const disableBtn = phoneNumber.length < 10;

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
    const params = new URLSearchParams({ phone: phoneNumber });
    setLoginState({ ...loginState, loading: true });
    try {
      const response = await axios.post(
        BrikApiCommon.login(),
        params.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      if (response.data.success) {
        dispatch(setPhoneNumber(phoneNumber));
        setLoginState({
          ...loginState,
          loading: false,
          errorMessage: '',
          phoneNumber: '',
        });
        navigation.navigate('Verification');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setLoginState({
        ...loginState,
        loading: false,
        phoneNumber: '',
        errorMessage: error.message,
      });
    }
  };

  return (
    <SafeAreaView style={loginStyle.container}>
      <Instruction />
      <BSpacer size={layout.pad.lg} />
      <Label />
      <PhoneInput
        value={phoneNumber}
        onChangeText={(val) =>
          setLoginState({ ...loginState, phoneNumber: val })
        }
      />
      <BSpacer size={layout.pad.sm} />
      <>
        {errorMessage && <BErrorText text={errorMessage} />}

      </>
      <BButtonPrimary
        disable={disableBtn}
        buttonStyle={[loginStyle.buttonStyle, { backgroundColor: disableBtn ? `${colors.primary}40` : colors.primary, }]}
        onPress={sendOtp}
        title="Kirim OTP"
      />
      <Spinner
        visible={loading}
        size="large"
        overlayColor="rgba(0, 0, 0, 0.25)"
        color={colors.primary}
      />
    </SafeAreaView>
  );
};
export default Login;
