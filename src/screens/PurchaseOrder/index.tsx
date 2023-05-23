import {
    StackActions,
    useFocusEffect,
    useNavigation
} from "@react-navigation/native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { BackHandler, SafeAreaView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import bStorage from "@/actions";
import {
    BBackContinueBtn,
    BHeaderIcon,
    BSpacer,
    BStepperIndicator,
    PopUpQuestion
} from "@/components";
import { layout } from "@/constants";
import { useKeyboardActive } from "@/hooks";
import { PO, TAB_ROOT } from "@/navigation/ScreenNames";
import { AppDispatch, RootState } from "@/redux/store";
import DetailProduk from "./element/ProductDetail";
import UploadFiles from "./element/PaymentDetail";
import CreatePo from "./element/CreatePo";

const styles = StyleSheet.create({
    poContainer: {
        flex: 1,
        marginHorizontal: layout.pad.lg + layout.pad.xs,
        marginBottom: layout.pad.lg
    },
    stepperIndicator: { alignSelf: "center" },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        bottom: 0
    }
});

function PurchaseOrder() {
    const navigation = useNavigation();
    const poState = useSelector((state: RootState) => state.purchaseOrder);
    const dispatch = useDispatch<AppDispatch>();
    const {
        currentStep,
        poNumber,
        choosenSphDataFromModal,
        files,
        selectedProducts,
        poImages,
        stepsDone,
        paymentType,
        checked,
        fiveToSix,
        lessThanFive,
        customerType
    } = poState.currentState.context;
    const { keyboardVisible } = useKeyboardActive();
    const [isPopupExitVisible, setIsPopupExitVisible] = useState(false);
    const labels = ["Cari PT / Proyek", "Detil Pembayaran", "Detil Produk"];
    const isBtnFooterShown = !poState.currentState.matches(
        "firstStep.SearchSph"
    );

    const checkHasSpecialMobilizationPrice = () => {
        if (checked === "first") {
            if (fiveToSix === "" && lessThanFive === "") {
                return true;
            }
            if (fiveToSix[0] === "0" || lessThanFive[0] === "0") {
                return true;
            }
            return false;
        } else {
            return false;
        }
    };

    const handleDisableContinueBtn = () => {
        if (currentStep === 0) {
            if (customerType === "INDIVIDU") {
                return JSON.stringify(choosenSphDataFromModal) === "{}";
            }
            return (
                poNumber.length === 0 ||
                JSON.stringify(choosenSphDataFromModal) === "{}" ||
                poImages.length <= 1
            );
        }
        if (currentStep === 1) {
            const isRequiredFileEmpty = files.filter(
                (v) => v.isRequire && v.value === null
            );
            const isFilesValueNull = files.filter((v) => v.value === null);
            return paymentType === "CBD"
                ? isRequiredFileEmpty.length > 0
                : isFilesValueNull.length > 0;
        }
        const hasNoQuantityMultiProducts = selectedProducts.filter(
            (v) => v.quantity.length === 0 || v.quantity[0] === "0"
        );
        return (
            hasNoQuantityMultiProducts.length > 0 ||
            selectedProducts.length === 0 ||
            checkHasSpecialMobilizationPrice()
        );
    };

    const handleBack = useCallback(() => {
        if (currentStep === 0) {
            if (poState.currentState.matches("firstStep.SearchSph")) {
                dispatch({ type: "backToAddPo" });
            } else {
                bStorage.getItem(PO).then((value) => {
                    if (value) {
                        setIsPopupExitVisible(true);
                    } else {
                        dispatch({
                            type: "backToBeginningState"
                        });
                        navigation.dispatch(StackActions.popToTop());
                    }
                });
            }
        } else if (currentStep === 1) {
            dispatch({ type: "goBackToFirstStep" });
        } else if (currentStep === 2) {
            dispatch({ type: "goBackToSecondStep" });
        }
    }, [currentStep, dispatch, navigation, poState.currentState]);

    const handleNext = useCallback(() => {
        if (currentStep === 0) {
            dispatch({
                type: "goToSecondStep"
            });

            const dataToSaved = {
                ...poState.currentState.context,
                currentStep: 0,
                stepsDone: [0]
            };
            bStorage.setItem(PO, {
                poContext: dataToSaved
            });
        } else if (currentStep === 1) {
            dispatch({ type: "goToThirdStep" });
            const dataToSaved = {
                ...poState.currentState.context,
                currentStep: 1,
                stepsDone: [0, 1]
            };
            bStorage.setItem(PO, {
                poContext: dataToSaved
            });
        } else {
            dispatch({ type: "goToPostPo" });
        }
    }, [currentStep, dispatch, poState.currentState.context]);

    const handleClose = useCallback(() => {
        if (currentStep === 0) {
            bStorage.getItem(PO).then((value) => {
                if (value) {
                    setIsPopupExitVisible(true);
                } else {
                    dispatch({
                        type: "backToBeginningState"
                    });
                    navigation.dispatch(StackActions.popToTop());
                }
            });
        } else {
            setIsPopupExitVisible(true);
        }
    }, []);

    const renderHeaderLeft = useCallback(
        () => (
            <BHeaderIcon
                size={layout.pad.lg + layout.pad.md}
                iconName="x"
                marginRight={layout.pad.lg}
                onBack={handleClose}
            />
        ),
        [handleBack]
    );

    const renderTitle = useCallback(() => {
        let title = customerType === "INDIVIDU" ? "Buat SO" : "Buat PO";
        if (poState.currentState.matches("firstStep.SearchSph")) {
            title = "Cari PT / Proyek";
        }
        return title;
    }, [poState.currentState]);

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                handleBack();
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
            return () => backHandler.remove();
        }, [handleBack])
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackVisible: false,
            headerLeft: () => renderHeaderLeft(),
            headerTitle: renderTitle()
        });
    }, [navigation, renderHeaderLeft, renderTitle]);

    const onPressStepper = (pressedNum: number) => {
        if (pressedNum !== currentStep) {
            if (pressedNum === 1) {
                if (currentStep === 0) {
                    dispatch({
                        type: "goToSecondStepFromStepOnePressed",
                        value: pressedNum
                    });
                } else {
                    dispatch({
                        type: "goToStepTwoFromStepThreePressed",
                        value: pressedNum
                    });
                }
            } else if (pressedNum === 2) {
                if (currentStep === 0) {
                    dispatch({
                        type: "goToThirdFromStepOnePressed",
                        value: pressedNum
                    });
                } else {
                    dispatch({
                        type: "goToStepThreeFromStepTwoPressed",
                        value: pressedNum
                    });
                }
            } else if (currentStep === 1) {
                dispatch({
                    type: "goToStepOneFromStepTwoPressed",
                    value: pressedNum
                });
            } else {
                dispatch({
                    type: "goToStepOneFromStepThreePressed",
                    value: pressedNum
                });
            }
        }
    };

    const renderContinueText = () => {
        if (currentStep === 2) {
            if (customerType === "INDIVIDU") {
                return "Buat SO";
            }
            return "Buat PO";
        }
        return "Lanjut";
    };

    const stepToRender = [<CreatePo />, <UploadFiles />, <DetailProduk />];

    return (
        <SafeAreaView style={styles.poContainer}>
            <View style={styles.stepperIndicator}>
                <BStepperIndicator
                    labels={labels}
                    currentStep={currentStep}
                    stepsDone={stepsDone}
                    stepOnPress={onPressStepper}
                />
            </View>
            <BSpacer size="medium" />
            {stepToRender[currentStep]}
            {isBtnFooterShown && !keyboardVisible && (
                <View style={styles.footer}>
                    <BBackContinueBtn
                        isContinueIcon={currentStep < 2}
                        onPressContinue={handleNext}
                        onPressBack={handleBack}
                        continueText={renderContinueText()}
                        disableContinue={handleDisableContinueBtn()}
                    />
                </View>
            )}
            <PopUpQuestion
                isVisible={isPopupExitVisible}
                setIsPopupVisible={() => {
                    if (currentStep === 0) {
                        dispatch({
                            type: "backToBeginningState"
                        });
                        navigation.dispatch(StackActions.replace(TAB_ROOT));
                    } else if (currentStep === 1) {
                        dispatch({
                            type: "backToBeginningStateFromSecondStep"
                        });
                        navigation.dispatch(StackActions.replace(TAB_ROOT));
                    } else {
                        dispatch({
                            type: "backToBeginningStateFromThirdStep"
                        });
                        navigation.dispatch(StackActions.replace(TAB_ROOT));
                    }
                }}
                actionButton={() => setIsPopupExitVisible(false)}
                cancelText="Keluar"
                actionText="Lanjutkan"
                desc="Progres pembuatan PO Anda sudah tersimpan."
                text="Apakah Anda yakin ingin keluar?"
            />
        </SafeAreaView>
    );
}

export default PurchaseOrder;
