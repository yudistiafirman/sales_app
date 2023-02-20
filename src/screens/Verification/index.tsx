import { BHeaderIcon, BSpacer } from '@/components';
import BErrorText from '@/components/atoms/BErrorText';
import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
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
import crashlytics from '@react-native-firebase/crashlytics';
import { VERIFICATION } from '@/navigation/ScreenNames';
import { ENTRY_TYPE } from '@/models/EnumModel';
import analytics from '@react-native-firebase/analytics';

const Verification = () => {
  const { phoneNumber } = useSelector(
    (state: RootState) => state.auth.loginCredential
  );
  const navigation = useNavigation();
  const [verificationState, setVerificationState] = React.useState({
    otpValue: '',
    errorOtp: '',
    loading: false,
    countDownOtp: 10,
  });
  const dispatch = useDispatch();
  const { otpValue, errorOtp, loading, countDownOtp } = verificationState;
  let timer = React.useRef<number | undefined>();
  React.useEffect(() => {
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

  React.useEffect(() => {
    crashlytics().log(VERIFICATION);

    if (otpValue.length === 6) {
      onLogin();
    }
  }, [otpValue]);

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
        dispatch(
          setUserData({ userData: decoded, entryType: ENTRY_TYPE.SALES })
        );
        setVerificationState({
          ...verificationState,
          errorOtp: '',
          otpValue: '',
          loading: false,
        });
        analytics().setUserId(response.data.id);
        analytics().setUserProperties({
          role: response.data.type,
          email: response.data.email,
          username: response.data.phone,
        });
        crashlytics().setUserId(response.data.id);
        crashlytics().setAttributes({
          role: response.data.type,
          email: response.data.email,
          username: response.data.phone,
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

  const renderHeaderLeft = React.useCallback(
    () => (
      <BHeaderIcon
        size={layout.pad.xl}
        iconName="chevron-left"
        marginRight={layout.pad.xs}
        marginLeft={layout.pad.sm}
        onBack={() => {
          navigation.goBack();
        }}
      />
    ),
    [navigation]
  );
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => renderHeaderLeft(),
    });
  }, [navigation, renderHeaderLeft]);

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
