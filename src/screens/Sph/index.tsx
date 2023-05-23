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
import { getLocationCoordinates } from "@/actions/CommonActions";
import {
    BHeaderIcon,
    BStepperIndicator as StepperIndicator,
    PopUpQuestion
} from "@/components";
import useCustomHeaderLeft from "@/hooks/useCustomHeaderLeft";
import { SphStateInterface, PIC } from "@/interfaces";
import { SPH } from "@/navigation/ScreenNames";
import { getOneProjectById } from "@/redux/async-thunks/commonThunks";
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

// enum
function checkSelected(picList: PIC[]) {
    let isSelectedExist = false;

    const list = picList || [];
    list.forEach((pic) => {
        if (pic.isSelected) {
            isSelectedExist = true;
        }
    });
    return isSelectedExist;
}

function stepHandler(
    sphData: SphStateInterface,
    stepsDone: number[],
    setSteps: (e: number[] | ((curr: number[]) => number[])) => void,
    stepController: (step: number) => void
) {
    if (sphData.selectedCompany) {
        if (checkSelected(sphData.selectedCompany?.Pics)) {
            if (!stepsDone.includes(0)) {
                setSteps((curr) => [...new Set(curr), 0]);
            }
        }
    } else {
        setSteps((curr) => curr.filter((num) => num !== 0));
    }

    const billingAddressFilled =
        !Object.values(sphData.billingAddress).every((val) => !val) &&
        Object.entries(sphData.billingAddress.addressAutoComplete).length > 1;

    if (
        (sphData.isBillingAddressSame || billingAddressFilled) &&
        sphData.distanceFromLegok !== null
    ) {
        setSteps((curr) => [...new Set(curr), 1]);
    } else {
        setSteps((curr) => curr.filter((num) => num !== 1));
    }

    const paymentCondition =
        sphData.paymentType === "CREDIT" ? sphData.paymentBankGuarantee : true;

    if (sphData.paymentType && paymentCondition) {
        setSteps((curr) => [...new Set(curr), 2]);
    } else {
        setSteps((curr) => curr.filter((num) => num !== 2));
    }

    if (sphData.chosenProducts.length) {
        setSteps((curr) => [...new Set(curr), 3]);
    } else {
        setSteps((curr) => curr.filter((num) => num !== 3));
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
    const [isPopupVisible, setPopupVisible] = React.useState(false);

    useEffect(() => {
        crashlytics().log(SPH);

        stepHandler(sphData, stepsDone, setStepsDone, stepControll);
        handleStepperFocus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sphData]);

    const handleStepperFocus = () => {
        // to continue stepper focus when entering sph page
        if (!sphData.stepperSPHShouldNotFocused) {
            if (sphData.stepSPHFourFinished) setCurrentPosition(4);
            else if (sphData.stepSPHThreeFinished) setCurrentPosition(3);
            else if (sphData.stepSPHTwoFinished) setCurrentPosition(2);
            else if (sphData.stepSPHOneFinished) setCurrentPosition(1);
        }

        // to reset stepper focus when continuing progress data
        if (
            sphData.stepperSPHShouldNotFocused &&
            currentPosition === 0 &&
            !sphData.selectedCompany
        ) {
            dispatch(resetStepperFocused(1));
        }
        const billingAddressFilled =
            !Object.values(sphData.billingAddress).every((val) => !val) &&
            Object.entries(sphData.billingAddress?.addressAutoComplete).length >
                1;
        if (
            sphData.stepperSPHShouldNotFocused &&
            currentPosition === 1 &&
            ((!sphData.isBillingAddressSame && !billingAddressFilled) ||
                sphData.distanceFromLegok === null)
        ) {
            dispatch(resetStepperFocused(2));
        }
        const paymentCondition =
            sphData.paymentType === "CREDIT"
                ? sphData.paymentBankGuarantee
                : true;
        if (
            sphData.stepperSPHShouldNotFocused &&
            currentPosition === 2 &&
            (!sphData.paymentType || !paymentCondition)
        ) {
            dispatch(resetStepperFocused(3));
        }
        if (
            sphData.stepperSPHShouldNotFocused &&
            currentPosition === 3 &&
            (!sphData.chosenProducts || !sphData.chosenProducts?.length)
        ) {
            dispatch(resetStepperFocused(4));
        }
    };

    const getLocationCoord = async (coordinate: Region) => {
        try {
            const { data } = await getLocationCoordinates(
                // '',
                coordinate.longitude as unknown as number,
                coordinate.latitude as unknown as number,
                "BP-LEGOK"
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

            dispatch(updateDistanceFromLegok(result.distance.value));
            dispatch(updateRegion(coordinateToSet));
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        error.message ||
                        "Terjadi error saat pengambilan data coordinate",
                    outsideClickClosePopUp: true
                })
            );
        }
    };

    async function getProjectById(projectId: string) {
        try {
            dispatch(resetSPHState());
            dispatch(
                openPopUp({
                    popUpType: "loading",
                    popUpText: "loading fetching data",
                    outsideClickClosePopUp: false
                })
            );
            const response = await dispatch(
                getOneProjectById({ projectId })
            ).unwrap();
            dispatch(closePopUp());
            const project = response.data;
            const { LocationAddress } = project;
            if (project.Pic) {
                dispatch(updateSelectedPic(project.Pic));
            }

            dispatch(updateSelectedCompany(project));

            if (LocationAddress) {
                if (LocationAddress.lon && LocationAddress.lat) {
                    const longitude = +LocationAddress.lon;
                    const latitude = +LocationAddress.lat;
                    getLocationCoord({ longitude, latitude });
                }
            }
        } catch (error) {
            dispatch(closePopUp());
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        error.message ||
                        "Terjadi error saat pengambilan data Proyek",
                    outsideClickClosePopUp: true
                })
            );
        }
    }

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

    useEffect(() => {
        const projectId = route.params?.projectId;
        if (projectId) {
            getProjectById(projectId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const actionBackButton = (popupVisible = false) => {
        if (popupVisible) {
            if (sphData.selectedCompany) {
                setPopupVisible(true);
            } else {
                navigation.goBack();
            }
        } else {
            setPopupVisible(false);
            navigation.goBack();
        }
    };

    return (
        <View style={style.container}>
            <StepperIndicator
                stepsDone={stepsDone}
                stepOnPress={(num) => {
                    dispatch(setStepperFocused(num));
                    setCurrentPosition(num);
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
