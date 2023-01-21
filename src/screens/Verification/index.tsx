import { BSpacer } from '@/components';
import BErrorText from '@/components/atoms/BErrorText';
import BHeaderIcon from '@/components/atoms/BHeaderIcon';
import { colors } from '@/constants';
import { resScale } from '@/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Image, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import OTPField from './element/OTPField';
import OTPFieldLabel from './element/OTPFieldLabel';
import ResendOTP from './element/ResendOTP';
import VIntstruction from './element/VInstruction';
import VerificationStyles from './styles';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import BrikApiCommon from '@/brikApi/BrikApiCommon';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { setUserData } from '@/redux/reducers/authReducer';
import { KeyboardAwareScrollView, KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view';
const Verification = () => {
  const { phoneNumber } = useSelector(
    (state: RootState) => state.auth.loginCredential
  );
  const navigation = useNavigation();
  const [verificationState, setVerificationState] = useState({
    otpValue: '',
    errorOtp: '',
    loading: false,
  });
  const dispatch = useDispatch();
  const [countDownOtp, setCountDown] = useState(10);
  const { otpValue, errorOtp, loading } = verificationState;
  const disabled = otpValue.length < 6;
  let timer = useRef<number | undefined>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: renderHeaderLeft,
    });
  }, [navigation]);
  useEffect(() => {
    timer.current = setInterval(() => {
      if (countDownOtp !== 0) {
        setCountDown((prevstate) => prevstate - 1);
      }
    }, 1000);
    return () => {
      clearInterval(timer.current);
    };
  }, [countDownOtp]);

  const renderHeaderLeft = () => (
    <BHeaderIcon size={resScale(30)} onBack={onBack} iconName="chevron-left" />
  );

  const onLogin = async () => {
    const params = new URLSearchParams({ phone: phoneNumber, otp: otpValue });
    setVerificationState({
      ...verificationState,
      loading: true,
    });
    try {
      const response = await axios.post(
        BrikApiCommon.login(),
        params.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      if (response.data.success) {
        setVerificationState({
          ...verificationState,
          errorOtp: '',
          otpValue: '',
          loading: false,
        });
        await EncryptedStorage.setItem(
          'userSession',
          JSON.stringify(response.data.data)
        );
        dispatch(setUserData(response.data.data));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setVerificationState({
        ...verificationState,
        errorOtp: error.message,
        otpValue: '',
        loading: false,
      });
    }
  };
  const onResendOtp = async () => {
    setCountDown(10);
    const params = new URLSearchParams({ phone: phoneNumber });
    try {
      const response = await axios.post(
        BrikApiCommon.login(),
        params.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      if (response.data.success) {
        setVerificationState({
          ...verificationState,
          errorOtp: '',
          otpValue: '',
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setVerificationState({
        ...verificationState,
        errorOtp: error.message,
        otpValue: '',
      });
    }
  };
  const onBack = () => {
    clearInterval(timer.current);
    setCountDown(10);
    setVerificationState({ ...verificationState, otpValue: '', errorOtp: '' });
    navigation.goBack();
  };
  return (
    <KeyboardAwareScrollView>
      <SafeAreaView style={VerificationStyles.container}>
        <BSpacer size={resScale(40)} />
        <Image
          style={VerificationStyles.otpMessageImage}
          source={require('@/assets/illustration/ic_otp_message.png')}
        />
        <BSpacer size="large" />
        <VIntstruction onPress={onBack} phoneNumber={phoneNumber} />
        <BSpacer size='large' />

        <OTPFieldLabel />
        <OTPField
          value={otpValue}
          setValue={(code) =>
            setVerificationState({ ...verificationState, otpValue: code })
          }
        />
        {errorOtp && <BErrorText text={errorOtp} />}

        <BSpacer size={resScale(25)} />
        <ResendOTP count={countDownOtp} onPress={onResendOtp} />
        <BSpacer size={resScale(23)} />
        <Spinner
          overlayColor="rgba(0, 0, 0, 0.25)"
          visible={loading}
          size="large"
          color={colors.primary}
        />
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};
export default Verification;
