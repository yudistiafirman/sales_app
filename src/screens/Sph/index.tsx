import crashlytics from "@react-native-firebase/crashlytics";
import {
    useFocusEffect,
    useNavigation,
    useRoute
} from "@react-navigation/native";
import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    useContext
} from "react";
import { View, ScrollView, StyleSheet, BackHandler } from "react-native";
import { Region } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import {
    getLocationCoordinates,
    projectGetOneById
} from "@/actions/CommonActions";
import {
    BHeaderIcon,
    BStepperIndicator as StepperIndicator,
    PopUpQuestion
} from "@/components";
import useCustomHeaderLeft from "@/hooks/useCustomHeaderLeft";
import { SphStateInterface } from "@/interfaces";
import { SPH } from "@/navigation/ScreenNames";
import {
    resetSPHState,
    resetStepperFocused,
    setStepperFocused,
    updateDistanceFromLegok,
    updateSelectedCompany,
    updateSelectedPic
} from "@/redux/reducers/SphReducer";
import { updateRegion } from "@/redux/reducers/locationReducer";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import { RootState } from "@/redux/store";
import { resScale } from "@/utils";
import {
    checkSelectedSPHPic,
    shouldAllowSPHStateToContinue
} from "@/utils/generalFunc";
import { SphContext, SphProvider } from "./elements/context/SphContext";
import Steps from "./elements/Steps";
import FifthStep from "./elements/5fifthStep";
import FourthStep from "./elements/4fourthStep";
import ThirdStep from "./elements/3thirdStep";
import SecondStep from "./elements/2secondStep";
import FirstStep from "./elements/1firstStep";

const style = StyleSheet.create({
    container: {
        flex: 1
    }
});

const labels = [
    "Cari PT / Proyek",
    "Konfirmasi Alamat",
    "Tipe Pembayaran",
    "Pilih Produk",
    "Ringkasan"
];

const stepsToRender = [
    <FirstStep />,
    <SecondStep />,
    <ThirdStep />,
    <FourthStep />,
    <FifthStep />
];

function stepHandler(
    sphData: SphStateInterface,
    stepsDone: number[],
    setSteps: (e: number[] | ((curr: number[]) => number[])) => void,
    stepController: (step: number) => void
) {
    if (sphData?.selectedCompany) {
        if (checkSelectedSPHPic(sphData?.selectedCompany?.Pics)) {
            if (!stepsDone?.includes(0)) {
                setSteps((curr) => [...new Set(curr), 0]);
            }
        }
    } else {
        setSteps((curr) => curr?.filter((num) => num !== 0));
    }

    const billingAddressFilled =
        !Object?.values(sphData?.billingAddress)?.every((val) => !val) &&
        Object?.entries(sphData?.billingAddress?.addressAutoComplete) &&
        Object?.entries(sphData?.billingAddress?.addressAutoComplete)?.length >
            1;

    if (
        (sphData?.isBillingAddressSame || billingAddressFilled) &&
        sphData?.distanceFromLegok !== null
    ) {
        setSteps((curr) => [...new Set(curr), 1]);
    } else {
        setSteps((curr) => curr?.filter((num) => num !== 1));
    }

    const paymentCondition =
        sphData?.paymentType === "CREDIT"
            ? sphData?.paymentBankGuarantee
            : true;

    if (sphData?.paymentType && paymentCondition) {
        setSteps((curr) => [...new Set(curr), 2]);
    } else {
        setSteps((curr) => curr?.filter((num) => num !== 2));
    }

    if (sphData?.chosenProducts?.length) {
        setSteps((curr) => [...new Set(curr), 3]);
    } else {
        setSteps((curr) => curr?.filter((num) => num !== 3));
    }
    const max = Math.max(...stepsDone);

    stepController(max);
}

function SphContent() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const stepRef = useRef<ScrollView>(null);
    // const [currentPosition, setCurrentPosition] = useState<number>(0);
    const [stepsDone, setStepsDone] = useState<number[]>([]);
    const [, updateState, setCurrentPosition, currentPosition] =
        useContext(SphContext);
    const stepControll = useCallback((step: number) => {}, []);
    const sphData = useSelector((state: RootState) => state.sph);
    const { selectedBatchingPlant } = useSelector(
        (state: RootState) => state.auth
    );
    const [isPopupVisible, setPopupVisible] = React.useState(false);
    const projectId = route?.params?.projectId;
    const abortControllerRef = React.useRef<AbortController>(
        new AbortController()
    );

    const handleStepperFocus = () => {
        // to continue stepper focus when entering sph page
        if (!sphData?.stepperSPHShouldNotFocused) {
            if (sphData?.stepSPHFourFinished) setCurrentPosition(4);
            else if (sphData?.stepSPHThreeFinished) setCurrentPosition(3);
            else if (sphData?.stepSPHTwoFinished) setCurrentPosition(2);
            else if (sphData?.stepSPHOneFinished) setCurrentPosition(1);
        }

        // to reset stepper focus when continuing progress data
        if (
            sphData?.stepperSPHShouldNotFocused &&
            currentPosition === 0 &&
            !sphData?.selectedCompany
        ) {
            dispatch(resetStepperFocused(1));
        }
        const billingAddressFilled =
            !Object?.values(sphData?.billingAddress)?.every((val) => !val) &&
            Object?.entries(sphData?.billingAddress?.addressAutoComplete) &&
            Object?.entries(sphData?.billingAddress?.addressAutoComplete)
                ?.length > 1;
        if (
            sphData?.stepperSPHShouldNotFocused &&
            currentPosition === 1 &&
            ((!sphData?.isBillingAddressSame && !billingAddressFilled) ||
                sphData?.distanceFromLegok === null)
        ) {
            dispatch(resetStepperFocused(2));
        }
        const paymentCondition =
            sphData?.paymentType === "CREDIT"
                ? sphData?.paymentBankGuarantee
                : true;
        if (
            sphData?.stepperSPHShouldNotFocused &&
            currentPosition === 2 &&
            (!sphData?.paymentType || !paymentCondition)
        ) {
            dispatch(resetStepperFocused(3));
        }
        if (
            sphData?.stepperSPHShouldNotFocused &&
            currentPosition === 3 &&
            (!sphData?.chosenProducts || !sphData?.chosenProducts?.length)
        ) {
            dispatch(resetStepperFocused(4));
        }
    };

    const getLocationCoord = async (coordinate: Region) => {
        try {
            abortControllerRef?.current?.abort();
            if (abortControllerRef?.current?.signal?.aborted)
                abortControllerRef.current = new AbortController();
            const { data } = await getLocationCoordinates(
                // '',
                coordinate?.longitude as unknown as number,
                coordinate?.latitude as unknown as number,
                selectedBatchingPlant?.name,
                abortControllerRef?.current?.signal
            );
            const { result } = data;
            if (!result) {
                throw data;
            }
            const coordinateToSet = {
                latitude: result?.lat,
                longitude: result?.lon,
                formattedAddress: result?.formattedAddress,
                PostalId: result?.PostalId
            };

            if (typeof result?.lon === "string") {
                coordinateToSet.longitude = Number(result.lon);
                coordinateToSet.lon = Number(result.lon);
            }

            if (typeof result?.lat === "string") {
                coordinateToSet.latitude = Number(result.lat);
                coordinateToSet.lat = Number(result.lat);
            }

            dispatch(updateDistanceFromLegok(result?.distance?.value));
            dispatch(updateRegion(coordinateToSet));
        } catch (error) {
            if (error?.message !== "canceled")
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText:
                            error?.message ||
                            "Terjadi error saat pengambilan data coordinate",
                        outsideClickClosePopUp: true
                    })
                );
        }
    };

    async function getProjectById() {
        try {
            dispatch(resetSPHState());
            dispatch(
                openPopUp({
                    popUpType: "loading",
                    popUpText: "loading fetching data",
                    outsideClickClosePopUp: false
                })
            );
            const response = await projectGetOneById(projectId).catch((err) =>
                Error(err)
            );

            if (response?.data?.success && response?.data?.success !== false) {
                dispatch(closePopUp());
                const project = response?.data?.data;
                const { LocationAddress } = project;
                if (project?.Pic) {
                    dispatch(updateSelectedPic(project?.Pic));
                }

                dispatch(updateSelectedCompany(project));

                if (LocationAddress) {
                    if (LocationAddress?.lon && LocationAddress?.lat) {
                        const longitude =
                            LocationAddress?.lon !== null &&
                            LocationAddress?.lon !== undefined
                                ? +LocationAddress.lon
                                : undefined;
                        const latitude =
                            LocationAddress?.lat !== null &&
                            LocationAddress?.lat !== undefined
                                ? +LocationAddress.lat
                                : undefined;
                        if (
                            longitude !== null &&
                            longitude !== undefined &&
                            latitude !== undefined &&
                            latitude !== null
                        )
                            getLocationCoord({ longitude, latitude });
                    }
                }
            } else {
                dispatch(closePopUp());
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText: "Terjadi error saat pengambilan data Proyek",
                        outsideClickClosePopUp: true
                    })
                );
            }
        } catch (error) {
            dispatch(closePopUp());
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        error?.message ||
                        "Terjadi error saat pengambilan data Proyek",
                    outsideClickClosePopUp: true
                })
            );
        }
    }

    useEffect(() => {
        crashlytics().log(SPH);

        if (projectId && !sphData?.alreadyCalledProjectOnce) {
            getProjectById();
        }

        stepHandler(sphData, stepsDone, setStepsDone, stepControll);
        handleStepperFocus();

        return () => {
            abortControllerRef?.current?.abort();
        };
    }, [
        sphData?.selectedCompany,
        sphData?.isBillingAddressSame,
        sphData?.billingAddress,
        sphData?.distanceFromLegok,
        sphData?.paymentType,
        sphData?.paymentBankGuarantee,
        sphData?.chosenProducts
    ]);

    const actionBackButton = (popupVisible = false) => {
        if (popupVisible) {
            if (sphData?.selectedCompany) {
                setPopupVisible(true);
            } else {
                navigation.goBack();
            }
        } else {
            setPopupVisible(false);
            navigation.goBack();
        }
    };

    useCustomHeaderLeft({
        customHeaderLeft: (
            <BHeaderIcon
                size={resScale(23)}
                onBack={() => {
                    actionBackButton(true);
                }}
                iconName="x"
            />
        )
    });

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                if (currentPosition > 0) {
                    dispatch(setStepperFocused(currentPosition - 1));
                    setCurrentPosition(currentPosition - 1);
                } else {
                    actionBackButton(true);
                }
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
            return () => backHandler.remove();
        }, [currentPosition, navigation, setCurrentPosition, sphData])
    );

    return (
        <View style={style.container}>
            <StepperIndicator
                stepsDone={stepsDone}
                stepOnPress={(pos) => {
                    if (shouldAllowSPHStateToContinue(pos, sphData)) {
                        dispatch(setStepperFocused(pos));
                        setCurrentPosition(pos);
                    }
                }}
                currentStep={currentPosition}
                labels={labels}
                ref={stepRef}
            />
            <Steps
                currentPosition={currentPosition}
                stepsToRender={stepsToRender}
            />
            <PopUpQuestion
                isVisible={isPopupVisible}
                setIsPopupVisible={() => actionBackButton(false)}
                actionButton={() => {
                    setPopupVisible(false);
                }}
                cancelText="Keluar"
                actionText="Lanjutkan"
                desc="Progres pembuatan SPH Anda sudah tersimpan."
                text="Apakah Anda yakin ingin keluar?"
            />
        </View>
    );
}

export default function Sph() {
    return (
        <SphProvider>
            <SphContent />
        </SphProvider>
    );
}
