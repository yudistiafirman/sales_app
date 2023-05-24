import { BButtonPrimary, BErrorText, BSpacer } from "@/components";
import { resScale } from "@/utils";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Image, SafeAreaView, TouchableOpacity, View } from "react-native";
import { colors, layout } from "@/constants";
import {
    setPhoneNumber,
    setShowButtonNetwork
} from "@/redux/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import { signIn } from "@/actions/CommonActions";
import useCustomHeaderLeft from "@/hooks/useCustomHeaderLeft";
import { LOGIN, VERIFICATION } from "@/navigation/ScreenNames";
import crashlytics from "@react-native-firebase/crashlytics";
import { RootState } from "@/redux/store";
import { isProduction } from "@/utils/generalFunc";
import loginStyle from "./style";
import Label from "./element/Label";
import Instruction from "./element/Intstruction";
import PhoneInput from "./element/PhoneInput";

interface LoginState {
    errorMessage: string | any;
    loading: boolean;
    phoneNumber: string;
}

const BrikLogo = require("@/assets/logo/brik_logo.png");

function Login() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { isShowButtonNetwork } = useSelector(
        (state: RootState) => state.auth
    );
    const [loginState, setLoginState] = React.useState<LoginState>({
        errorMessage: "",
        loading: false,
        phoneNumber: ""
    });

    const { errorMessage, loading, phoneNumber } = loginState;
    const disableBtn = phoneNumber.length < 6;
    let buttonCount = 0;

    const onVersionClick = () => {
        buttonCount += 1;
        if (buttonCount > 2) {
            dispatch(setShowButtonNetwork(!isShowButtonNetwork));
            buttonCount = 0;
        } else {
            setTimeout(() => {
                buttonCount = 0;
            }, 500);
        }
    };

    useCustomHeaderLeft({
        customHeaderLeft: (
            <View>
                {isProduction() && !__DEV__ ? (
                    <TouchableOpacity
                        onPress={
                            isProduction() && !__DEV__
                                ? onVersionClick
                                : undefined
                        }
                    >
                        <Image
                            style={{
                                width: resScale(70),
                                height: resScale(33)
                            }}
                            source={BrikLogo}
                        />
                    </TouchableOpacity>
                ) : (
                    <Image
                        style={{ width: resScale(70), height: resScale(33) }}
                        source={BrikLogo}
                    />
                )}
            </View>
        )
    });

    React.useEffect(() => {
        crashlytics().log(LOGIN);
    }, []);

    const sendOtp = async () => {
        setLoginState({ ...loginState, loading: true });
        try {
            const response = await signIn({ phone: phoneNumber });
            if (response.data.success) {
                dispatch(setPhoneNumber(phoneNumber));
                setLoginState({
                    ...loginState,
                    loading: false,
                    errorMessage: "",
                    phoneNumber: ""
                });
                navigation.navigate(VERIFICATION);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            setLoginState({
                ...loginState,
                loading: false,
                phoneNumber: "",
                errorMessage: error?.message
            });
        }
    };

    return (
        <SafeAreaView style={loginStyle.container}>
            <Instruction />
            <BSpacer size={layout.pad.lg} />
            <Label />
            <BSpacer size="extraSmall" />
            <PhoneInput
                value={phoneNumber}
                onChangeText={(val) =>
                    setLoginState({ ...loginState, phoneNumber: val })
                }
            />
            {errorMessage && <BErrorText text={errorMessage} />}
            <BSpacer size={resScale(40)} />
            <BButtonPrimary
                disable={disableBtn}
                buttonStyle={[
                    loginStyle.buttonStyle,
                    {
                        backgroundColor: disableBtn
                            ? `${colors.primary}40`
                            : colors.primary
                    }
                ]}
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
}
export default Login;
