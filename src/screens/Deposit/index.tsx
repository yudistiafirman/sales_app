import {
    StackActions,
    useFocusEffect,
    useNavigation
} from "@react-navigation/native";
import moment from "moment";
import * as React from "react";
import { View, DeviceEventEmitter, BackHandler } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
    BBackContinueBtn,
    BContainer,
    BHeaderIcon,
    BSpacer,
    PopUpQuestion,
    BStepperIndicator
} from "@/components";
import { layout } from "@/constants";
import {
    CreateDepositContext,
    CreateDepositProvider
} from "@/context/CreateDepositContext";
import { useKeyboardActive } from "@/hooks";
import useCustomHeaderLeft from "@/hooks/useCustomHeaderLeft";
import useHeaderTitleChanged from "@/hooks/useHeaderTitleChanged";
import { Styles } from "@/interfaces";
import { CreateDepositState } from "@/interfaces/CreateDeposit";
import { CREATE_DEPOSIT } from "@/navigation/ScreenNames";
import { resetImageURLS } from "@/redux/reducers/cameraReducer";
import { openPopUp } from "@/redux/reducers/modalReducer";
import { resScale } from "@/utils";
import { CreatePayment } from "@/models/CreatePayment";
import { uploadFileImage } from "@/actions/CommonActions";
import { postPayment } from "@/actions/FinanceActions";
import { RootState } from "@/redux/store";
import crashlytics from "@react-native-firebase/crashlytics";
import { DepositStatus } from "@/interfaces/SelectConfirmedPO";
import SecondStep from "./element/SecondStep";
import FirstStep from "./element/FirstStep";

const styles: Styles = {
    container: {
        justifyContent: "space-between",
        flex: 1
    }
};

const labels = ["Data Pelanggan", "Cari Proyek"];

function stepHandler(
    state: CreateDepositState,
    setStepsDone: (e: number[] | ((curr: number[]) => number[])) => void
) {
    const { stepOne, stepTwo, existingProjectID } = state;

    const images = stepOne?.deposit?.picts?.filter((v) => v?.file !== null);
    if (
        images &&
        images?.length > 0 &&
        stepOne?.deposit?.createdAt &&
        stepOne?.deposit?.nominal
    ) {
        setStepsDone((curr) => [...new Set(curr), 0]);
    } else {
        setStepsDone((curr) => curr?.filter((num) => num !== 0));
    }

    if (
        stepTwo?.companyName &&
        stepTwo?.purchaseOrders &&
        existingProjectID &&
        stepTwo?.purchaseOrders[0]?.status === DepositStatus.APPROVED
    ) {
        setStepsDone((curr) => [...new Set(curr), 1]);
    } else {
        setStepsDone((curr) => curr?.filter((num) => num !== 1));
    }
}

function Deposit() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { values, action } = React.useContext(CreateDepositContext);
    const { keyboardVisible } = useKeyboardActive();
    const [stepsDone, setStepsDone] = React.useState<number[]>([0, 1]);
    const [isPopupVisible, setPopupVisible] = React.useState(false);
    const authState = useSelector((state: RootState) => state.auth);

    const stepRender = [<FirstStep />, <SecondStep />];

    const next = (nextStep: number) => async () => {
        const totalStep = stepRender.length;
        if (nextStep < totalStep && nextStep >= 0) {
            action.updateValue("step", nextStep);
        } else {
            try {
                dispatch(
                    openPopUp({
                        popUpType: "loading",
                        popUpText: "Menambahkan deposit",
                        highlightedText: "Deposit",
                        outsideClickClosePopUp: false
                    })
                );
                const photoFiles = values?.stepOne?.deposit?.picts
                    ?.filter((v) => v?.file !== null)
                    ?.map((photo) => ({
                        ...photo?.file,
                        uri: photo?.file?.uri?.replace("file:", "file://")
                    }));
                let uploadedImage;
                if (photoFiles && photoFiles?.length > 0)
                    uploadedImage = await uploadFileImage(
                        photoFiles,
                        "deposit"
                    ).catch((err) => Error(err));

                const payload: CreatePayment = {
                    projectId: values?.existingProjectID,
                    amount: values?.stepOne?.deposit?.nominal,
                    paymentDate: moment(
                        values?.stepOne?.deposit?.createdAt,
                        "DD/MM/yyyy"
                    ).valueOf(),
                    status: "SUBMITTED",
                    type: "DEPOSIT",
                    files: [],
                    saleOrderId: values?.stepTwo?.selectedSaleOrder?.id,
                    batchingPlantId: authState.selectedBatchingPlant?.id
                };

                if (
                    uploadedImage?.data?.success &&
                    uploadedImage?.data?.success !== false
                )
                    uploadedImage?.data?.data?.forEach((item: any) => {
                        payload.files?.push({ fileId: item?.id });
                    });
                const response = await postPayment(payload).catch((err) =>
                    Error(err)
                );

                if (
                    response?.data?.success &&
                    response?.data?.success !== false
                ) {
                    navigation.dispatch(StackActions.popToTop());
                    dispatch(
                        openPopUp({
                            popUpType: "success",
                            popUpText: "Penambahan Deposit\nBerhasil",
                            highlightedText: "Deposit",
                            outsideClickClosePopUp: true
                        })
                    );
                } else {
                    dispatch(
                        openPopUp({
                            popUpType: "error",
                            popUpText: "Penambahan Deposit\nGagal",
                            highlightedText: "Deposit",
                            outsideClickClosePopUp: true
                        })
                    );
                }
            } catch (error) {
                const message = error?.message || "Penambahan Deposit\nGagal";
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText: message,
                        highlightedText: "Deposit",
                        outsideClickClosePopUp: true
                    })
                );
            }
        }
    };

    const actionBackButton = (directlyClose = false) => {
        if (values?.isSearchingPurchaseOrder === true) {
            action.updateValue("isSearchingPurchaseOrder", false);
        } else if (values?.step > 0 && !directlyClose) {
            next((values?.step || 0) - 1)();
        } else {
            setPopupVisible(true);
        }
    };

    useCustomHeaderLeft({
        customHeaderLeft: (
            <BHeaderIcon
                size={resScale(23)}
                onBack={() => actionBackButton(true)}
                iconName="x"
            />
        )
    });

    useHeaderTitleChanged({
        title:
            values?.isSearchingPurchaseOrder === true
                ? "Cari Pelanggan / Proyek"
                : "Buat Deposit",
        selectedBP: authState.selectedBatchingPlant
    });

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                actionBackButton(false);
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
            return () => backHandler.remove();
        }, [values?.step, values?.isSearchingPurchaseOrder])
    );

    React.useEffect(
        () => () => {
            dispatch(resetImageURLS({ source: CREATE_DEPOSIT }));
        },
        []
    );

    React.useEffect(() => {
        crashlytics().log(CREATE_DEPOSIT);
        stepHandler(values, setStepsDone);
    }, [values]);

    return (
        <>
            {values?.isSearchingPurchaseOrder === false && (
                <BStepperIndicator
                    stepsDone={stepsDone}
                    stepOnPress={(pos: number) => {
                        next(pos)();
                    }}
                    currentStep={values?.step}
                    labels={labels}
                />
            )}

            <BContainer paddingHorizontal={layout.pad.lg + layout.pad.xs}>
                <View style={styles.container}>
                    {stepRender[values?.step]}
                    <BSpacer size="extraSmall" />
                    {!keyboardVisible &&
                        values?.shouldScrollView &&
                        values?.step > -1 && (
                            <BBackContinueBtn
                                onPressContinue={() => {
                                    next((values?.step || 0) + 1)();
                                    DeviceEventEmitter.emit(
                                        "Deposit.continueButton",
                                        true
                                    );
                                }}
                                onPressBack={() => actionBackButton(false)}
                                continueText={
                                    values?.step > 0 ? "Buat Deposit" : "Lanjut"
                                }
                                disableContinue={
                                    !stepsDone?.includes(values?.step)
                                }
                                isContinueIcon={values?.step < 1}
                            />
                        )}
                </View>
                <PopUpQuestion
                    isVisible={isPopupVisible}
                    setIsPopupVisible={() => {
                        setPopupVisible(false);
                        navigation.goBack();
                    }}
                    actionButton={() => {
                        setPopupVisible(false);
                    }}
                    cancelText="Keluar"
                    actionText="Lanjutkan"
                    text="Apakah Anda yakin ingin keluar?"
                    desc="Progres pembuatan Deposit anda akan hilang"
                />
            </BContainer>
        </>
    );
}

function DepositWithProvider(props: any) {
    return (
        <CreateDepositProvider>
            <Deposit {...props} />
        </CreateDepositProvider>
    );
}

export default DepositWithProvider;
