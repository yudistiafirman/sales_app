import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import { useNavigation } from "@react-navigation/native";
import jwtDecode from "jwt-decode";
import * as React from "react";
import { Image, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";
import { useDispatch, useSelector } from "react-redux";
import bStorage from "@/actions/BStorage";
import { getBatchingPlants, signIn } from "@/actions/CommonActions";
import { BHeaderIcon, BSpacer } from "@/components";
import BErrorText from "@/components/atoms/BErrorText";
import { colors, layout } from "@/constants";
import storageKey from "@/constants/storageKey";
import UserModel from "@/models/User";
import { VERIFICATION } from "@/navigation/ScreenNames";
import { setUserData } from "@/redux/reducers/authReducer";
import { RootState } from "@/redux/store";
import { resScale } from "@/utils";
import otpMessageImage from "@/assets/illustration/ic_otp_message.png";
import VerificationStyles from "./styles";
import VIntstruction from "./element/VInstruction";
import ResendOTP from "./element/ResendOTP";
import OTPFieldLabel from "./element/OTPFieldLabel";
import OTPField from "./element/OTPField";

function Verification() {
    const { phoneNumber } = useSelector(
        (state: RootState) => state.auth.loginCredential
    );
    const navigation = useNavigation();
    const [verificationState, setVerificationState] = React.useState({
        otpValue: "",
        errorOtp: "",
        loading: false,
        countDownOtp: 10
    });
    const dispatch = useDispatch();
    const { otpValue, errorOtp, loading, countDownOtp } = verificationState;
    const timer = React.useRef<number | undefined>();
    React.useEffect(() => {
        timer.current = setInterval(() => {
            if (countDownOtp !== 0) {
                setVerificationState((prevState) => ({
                    ...prevState,
                    countDownOtp: countDownOtp - 1
                }));
            }
        }, 1000);
        return () => {
            clearInterval(timer.current);
        };
    }, [countDownOtp]);

    const onLogin = async () => {
        const params = { phone: phoneNumber, otp: otpValue };
        setVerificationState({
            ...verificationState,
            loading: true
        });
        try {
            const response = await signIn(params);
            if (response.data.success) {
                const { accessToken } = response.data.data;
                const decoded =
                    jwtDecode<UserModel.DataSuccessLogin>(accessToken);
                await bStorage.setItem(storageKey.userToken, accessToken);
                const batchingPlantsResponse = await getBatchingPlants();
                if (batchingPlantsResponse?.data?.data?.data)
                    dispatch(
                        setUserData({
                            userData: decoded,
                            batchingPlants:
                                batchingPlantsResponse?.data?.data?.data
                        })
                    );
                else
                    dispatch(
                        setUserData({
                            userData: decoded
                        })
                    );
                setVerificationState({
                    ...verificationState,
                    errorOtp: "",
                    otpValue: "",
                    loading: false
                });
                analytics().setUserId(response.data.id);
                analytics().setUserProperties({
                    role: response.data.type,
                    email: response.data.email,
                    username: response.data.phone
                });
                crashlytics().setUserId(response.data.id);
                crashlytics().setAttributes({
                    role: response.data.type,
                    email: response.data.email,
                    username: response.data.phone
                });
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            setVerificationState({
                ...verificationState,
                errorOtp: error?.message,
                otpValue: "",
                loading: false
            });
        }
    };

    React.useEffect(() => {
        crashlytics().log(VERIFICATION);

        if (otpValue.length === 6) {
            onLogin();
        }
    }, [otpValue]);

    const onResendOtp = async () => {
        const params = { phone: phoneNumber };
        try {
            const response = await signIn(params);
            if (response.data.success) {
                setVerificationState({
                    ...verificationState,
                    errorOtp: "",
                    otpValue: "",
                    countDownOtp: 10
                });
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            setVerificationState({
                ...verificationState,
                errorOtp: error?.message,
                otpValue: "",
                countDownOtp: 10
            });
        }
    };
    const onBack = () => {
        clearInterval(timer.current);
        setVerificationState({
            ...verificationState,
            otpValue: "",
            errorOtp: "",
            countDownOtp: 10
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
            headerLeft: () => renderHeaderLeft()
        });
    }, [navigation, renderHeaderLeft]);

    return (
        <KeyboardAwareScrollView>
            <SafeAreaView style={VerificationStyles.container}>
                <BSpacer size={resScale(40)} />
                <Image
                    style={VerificationStyles.otpMessageImage}
                    source={otpMessageImage}
                />
                <BSpacer size="large" />
                <VIntstruction onPress={onBack} phoneNumber={phoneNumber} />
                <BSpacer size="large" />

                <OTPFieldLabel />
                <BSpacer size="extraSmall" />
                <OTPField
                    value={otpValue}
                    setValue={(code) =>
                        setVerificationState({
                            ...verificationState,
                            otpValue: code
                        })
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
}
export default Verification;
