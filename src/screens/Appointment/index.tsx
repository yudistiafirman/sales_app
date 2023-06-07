import crashlytics from "@react-native-firebase/crashlytics";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import moment from "moment";
import * as React from "react";
import { BackHandler, Dimensions, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { postBookingAppointment } from "@/actions/ProductivityActions";
import {
    BBackContinueBtn,
    BContainer,
    BHeaderIcon,
    BottomSheetAddPIC,
    BSpacer,
    BStepperIndicator
} from "@/components";

import useCustomHeaderLeft from "@/hooks/useCustomHeaderLeft";
import {
    Address,
    PIC,
    projectPayloadType,
    visitationPayload
} from "@/interfaces";
import { APPOINTMENT } from "@/navigation/ScreenNames";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import { AppDispatch, RootState } from "@/redux/store";
import { resScale } from "@/utils";
import {
    assignError,
    decreateStep,
    enableSearching,
    increaseStep,
    resetAppointmentState,
    setDate,
    setPics,
    StepOne,
    toggleModalPics
} from "@/redux/reducers/appointmentReducer";
import SecondStep from "./element/SecondStep";
import FirstStep from "./element/FirstStep";

const { width } = Dimensions.get("window");

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        position: "absolute",
        top: width + width - resScale(100)
    },
    buttonAction: {
        position: "absolute",
        bottom: 0,
        width: "100%"
    }
});

export default function Appointment() {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const appointmentState = useSelector(
        (state: RootState) => state.appoinment
    );
    const {
        searchQuery,
        stepOne,
        isModalPicVisible,
        step,
        stepDone,
        selectedDate,
        isSearching
    } = appointmentState;
    const customerType =
        stepOne.customerType === "company" ? "company" : "individu";
    const btnShown =
        searchQuery.length === 0 && stepOne.customerType.length > 0;
    const labels = ["Data Pelanggan", "Tanggal Kunjungan"];
    const inCustomerDataStep = step === 0;
    const inVisitationDateStep = step === 1;
    const stepsToRender = [<FirstStep />, <SecondStep />];

    useCustomHeaderLeft({
        customHeaderLeft: (
            <BHeaderIcon
                size={resScale(23)}
                onBack={() => navigation.goBack()}
                iconName="x"
            />
        )
    });

    React.useEffect(() => {
        crashlytics().log(APPOINTMENT);
    }, []);

    const onBackPress = React.useCallback(() => {
        if (inVisitationDateStep) {
            if (selectedDate) {
                dispatch(setDate({ value: null }));
            }
            dispatch(decreateStep());
        } else if (isSearching) {
            dispatch(enableSearching({ value: false }));
        } else {
            navigation.goBack();
        }
    }, [dispatch, inVisitationDateStep, navigation, selectedDate]);

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                if (step > 0) {
                    onBackPress();
                } else {
                    navigation.goBack();
                }
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
            return () => backHandler.remove();
        }, [step])
    );

    const validateCompanyDetailsForm = React.useCallback(() => {
        const errors: Partial<StepOne> = {};
        if (stepOne.customerType === "company") {
            if (!stepOne.company.Company?.title) {
                errors.errorCompany = "Nama perusahaan harus diisi";
            }
        }

        if (stepOne[customerType].name?.length === 0) {
            errors.errorProject = "Nama Proyek harus diisi";
        } else if (stepOne[customerType].name?.length < 4) {
            errors.errorProject =
                "Nama Proyek tidak boleh kurang dari 4 karakter";
        }
        if (stepOne[customerType].Pics.length === 0) {
            errors.errorPics = "Tambahkan minimal 1 PIC";
        } else if (stepOne[customerType].Pics.length > 1) {
            const selectedPic = stepOne[customerType].Pics.filter(
                (v) => v.isSelected
            );
            if (selectedPic.length === 0) {
                errors.errorPics = "Pilih salah satu PIC";
            }
        }
        return errors;
    }, [customerType, stepOne]);

    const goToVisitationDateStep = React.useCallback(() => {
        const errors = validateCompanyDetailsForm();
        if (JSON.stringify(errors) !== "{}" && errors) {
            Object.keys(errors).forEach((val) => {
                dispatch(assignError({ key: val, value: errors }));
            });
        } else {
            dispatch(increaseStep());
        }
    }, [dispatch, validateCompanyDetailsForm]);

    const submitAppoinmentData = React.useCallback(async () => {
        try {
            const today = moment();
            const payload = {
                visitation: {
                    location: {} as Address
                } as visitationPayload,
                project: {
                    location: {} as Address
                } as projectPayloadType,
                pic: [] as PIC[]
            };
            if (stepOne[customerType].Pics.length === 1) {
                const pic = [];
                pic.push({
                    ...stepOne[customerType].Pics[0],
                    isSelected: true
                });
                payload.pic = pic;
            } else {
                const selectedPic = stepOne[customerType].Pics.filter(
                    (v) => v.isSelected
                );
                payload.pic = selectedPic;
            }
            const typeCustomer =
                customerType === "individu" ? "INDIVIDU" : "COMPANY";
            if (stepOne[customerType].Visitation) {
                payload.visitation.order = stepOne[customerType].Visitation
                    .finishDate
                    ? stepOne[customerType].Visitation.order
                    : stepOne[customerType].Visitation.order - 1;
            } else {
                payload.visitation.order = 0;
            }
            payload.visitation.status = "VISIT";

            if (stepOne[customerType].locationAddress.line1) {
                payload.project.location.line1 =
                    stepOne[customerType].locationAddress.line1;
            }
            if (stepOne[customerType].locationAddress.line2) {
                payload.project.location.line2 =
                    stepOne[customerType].locationAddress.line2;
            }
            if (stepOne[customerType].locationAddress.postalCode) {
                payload.project.location.postalId =
                    stepOne[customerType].locationAddress.postalCode;
            }
            if (stepOne[customerType].locationAddress.formattedAddress) {
                payload.project.location.formattedAddress =
                    stepOne[customerType].locationAddress.formattedAddress;
            }
            if (stepOne[customerType].locationAddress.lon) {
                payload.project.location.lon =
                    stepOne[customerType].locationAddress.lon;
            }
            if (stepOne[customerType].locationAddress.lat) {
                payload.project.location.lat =
                    stepOne[customerType].locationAddress.lat;
            }
            if (stepOne.customerType) {
                payload.visitation.customerType = typeCustomer;
            }
            if (appointmentState.selectedDate) {
                const selectDate = moment(appointmentState.selectedDate.date);
                payload.visitation.bookingDate = selectDate.valueOf();
            }
            payload.visitation.dateVisit = today.valueOf();
            if (stepOne[customerType].name) {
                payload.project.name = stepOne[customerType].name;
            }
            if (stepOne.customerType === "company") {
                if (stepOne[customerType].Company?.title) {
                    payload.project.companyDisplayName =
                        stepOne[customerType].Company?.title;
                }
            }
            if (stepOne[customerType].Visitation?.id) {
                payload.visitation.visitationId =
                    stepOne[customerType].Visitation.id;
            }
            if (stepOne[customerType].id) {
                payload.project.id = stepOne[customerType].id;
            }

            payload.visitation.isBooking = true;

            const response = await postBookingAppointment({ payload });
            if (response.data.success) {
                dispatch(
                    openPopUp({
                        popUpType: "success",
                        popUpTitle:
                            "Apakah Anda Ingin Membuat Janji Temu Lagi?",
                        popUpText: "Janji Temu Berhasil Dibuat",
                        outlineBtnTitle: "Tidak",
                        outsideClickClosePopUp: false,
                        outlineBtnAction: () => {
                            navigation.goBack();
                            dispatch(closePopUp());
                        },
                        primaryBtnAction: () => {
                            dispatch(resetAppointmentState());
                            dispatch(closePopUp());
                        },
                        primaryBtnTitle: "Buat Janji",
                        isRenderActions: true
                    })
                );
            } else {
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText: "Gagal Membuat Janji Temu",
                        highlightedText: "error",
                        outsideClickClosePopUp: true
                    })
                );
            }
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText: error?.message || "Gagal Membuat Janji Temu",
                    highlightedText: "error",
                    outsideClickClosePopUp: true
                })
            );
        }
    }, [
        customerType,
        dispatch,
        navigation,
        stepOne,
        appointmentState.selectedDate
    ]);

    const onNext = React.useCallback(() => {
        if (inCustomerDataStep) {
            goToVisitationDateStep();
        } else {
            submitAppoinmentData();
        }
    }, [goToVisitationDateStep, inCustomerDataStep, submitAppoinmentData]);

    function isCanAdvanceToStep2() {
        const customerTypeCondition = stepOne.customerType;
        const companyNameCondition = stepOne.company.Company;
        const projectNameConditionIndividu = stepOne.individu.name;
        const projectNameConditionCompany = stepOne.company.name;
        const picIndividu = stepOne.individu.Pics ? stepOne.individu.Pics : [];
        const picCompany = stepOne.company.Pics ? stepOne.company.Pics : [];

        if (customerTypeCondition === "company") {
            return (
                !!companyNameCondition &&
                !!projectNameConditionCompany &&
                picCompany.length > 0
            );
        }
        if (customerTypeCondition === "individu") {
            return !!projectNameConditionIndividu && picIndividu.length > 0;
        }

        return undefined;
    }

    const onTabPress = (nextStep: number) => () => {
        if (step !== nextStep) {
            if (nextStep > 0) {
                onNext();
            } else {
                onBackPress();
            }
        }
    };

    return (
        <>
            <BStepperIndicator
                stepsDone={stepDone}
                stepOnPress={(pos: number) => {
                    onTabPress(pos)();
                }}
                currentStep={step}
                labels={labels}
            />

            <BContainer>
                <View style={style.container}>
                    {stepsToRender[step]}
                    <BSpacer size="extraSmall" />
                    {step > -1 && btnShown && (
                        <BBackContinueBtn
                            onPressContinue={onNext}
                            onPressBack={onBackPress}
                            continueText="Lanjut"
                            unrenderBack={!(step > 0)}
                            disableContinue={
                                step > 0
                                    ? !selectedDate
                                    : !isCanAdvanceToStep2() && !selectedDate
                            }
                        />
                    )}
                    <BottomSheetAddPIC
                        isVisible={isModalPicVisible}
                        addPic={(dataPic: PIC) => {
                            const finalPIC: any[] = [
                                ...stepOne[customerType].Pics
                            ];
                            let finalData;
                            if (dataPic) {
                                finalData = {
                                    ...dataPic,
                                    isSelected: true
                                };
                            }
                            if (
                                stepOne[customerType].Pics &&
                                stepOne[customerType].Pics.length > 0
                            ) {
                                finalPIC.forEach((it, index) => {
                                    finalPIC[index] = {
                                        ...finalPIC[index],
                                        isSelected: false
                                    };
                                });
                            }

                            dispatch(
                                setPics({
                                    key: customerType,
                                    value: [...finalPIC, finalData]
                                })
                            );
                        }}
                        onClose={() =>
                            dispatch(toggleModalPics({ value: false }))
                        }
                    />
                </View>
            </BContainer>
        </>
    );
}
