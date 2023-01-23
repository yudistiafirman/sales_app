import { BSpacer } from '@/components';
import BErrorText from '@/components/atoms/BErrorText';
import BHeaderIcon from '@/components/atoms/BHeaderIcon';
import { colors } from '@/constants';
import { resScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Image, SafeAreaView } from 'react-native';
import OTPField from './element/OTPField';
import OTPFieldLabel from './element/OTPFieldLabel';
import ResendOTP from './element/ResendOTP';
import VIntstruction from './element/VInstruction';
import VerificationStyles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Spinner from 'react-native-loading-spinner-overlay';
import { setUserData } from '@/redux/reducers/authReducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import bStorage from '@/actions/BStorage';
import { signIn } from '@/actions/CommonActions';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import storageKey from '@/constants/storageKey';
const Verification = () => {
  const { phoneNumber } = useSelector(
    (state: RootState) => state.auth.loginCredential
  );
  const navigation = useNavigation();
  const [verificationState, setVerificationState] = useState({
    otpValue: '',
    errorOtp: '',
    loading: false,
    countDownOtp: 10,
  });
  const dispatch = useDispatch();
  const { otpValue, errorOtp, loading, countDownOtp } = verificationState;
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
        setVerificationState((prevState) => ({
          ...prevState,
          countDownOtp: countDownOtp - 1,
        }));
      }
    }, 1000);
    return () => {
      clearInterval(timer.current);
    };
  }, [countDownOtp]);

  useEffect(() => {
    if (otpValue.length === 6) {
      onLogin();
    }
  }, [otpValue]);

  const renderHeaderLeft = () => (
    <BHeaderIcon size={resScale(30)} onBack={onBack} iconName="chevron-left" />
  );

  const onLogin = async () => {
    const params = { phone: phoneNumber, otp: otpValue };
    setVerificationState({
      ...verificationState,
      loading: true,
    });
    try {
      const response = await signIn(params);
      if (response.data.success) {
        const { accessToken } = response.data.data;
        const decoded = jwtDecode<JwtPayload>(accessToken);
        await bStorage.setItem(storageKey.userToken, accessToken);
        dispatch(setUserData(decoded));
        setVerificationState({
          ...verificationState,
          errorOtp: '',
          otpValue: '',
          loading: false,
        });
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
    const params = { phone: phoneNumber };
    try {
      const response = await signIn(params);
      if (response.data.success) {
        setVerificationState({
          ...verificationState,
          errorOtp: '',
          otpValue: '',
          countDownOtp: 10,
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setVerificationState({
        ...verificationState,
        errorOtp: error.message,
        otpValue: '',
        countDownOtp: 10,
      });
    }
  };
  const onBack = () => {
    clearInterval(timer.current);
    setVerificationState({
      ...verificationState,
      otpValue: '',
      errorOtp: '',
      countDownOtp: 10,
    });
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
        <BSpacer size="large" />

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
