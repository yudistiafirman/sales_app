import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import crashlytics from "@react-native-firebase/crashlytics";
import {
    useFocusEffect,
    useNavigation,
    useRoute
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, DeviceEventEmitter, BackHandler } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
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
import { useKeyboardActive } from "@/hooks";
import useCustomHeaderLeft from "@/hooks/useCustomHeaderLeft";
import { PIC, Styles, visitationListResponse } from "@/interfaces";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import { CREATE_VISITATION } from "@/navigation/ScreenNames";
import {
    resetStepperFocused,
    resetVisitationState,
    setSearchProject,
    setSearchQuery,
    setStepperFocused,
    updateCurrentStep,
    updateDataVisitation,
    updateExistingVisitationID,
    updateShouldScrollView,
    VisitationGlobalState
} from "@/redux/reducers/VisitationReducer";
import { resetImageURLS } from "@/redux/reducers/cameraReducer";
import { updateRegion } from "@/redux/reducers/locationReducer";
import { RootState } from "@/redux/store";
import { resScale } from "@/utils";
import { shouldAllowVisitationStateToContinue } from "@/utils/generalFunc";
import ThirdStep from "./elements/third";
import BSheetAddPic from "./elements/second/BottomSheetAddPic";
import SecondStep from "./elements/second";
import Fourth from "./elements/fourth";
import FirstStep from "./elements/first";
import Fifth from "./elements/fifth";

const labels = [
    "Alamat Proyek",
    "Data Pelanggan",
    "Data Proyek",
    "Kompetitor",
    "Kelengkapan Foto"
];

const styles: Styles = {
    footer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    button: { flexDirection: "row-reverse" },
    container: {
        justifyContent: "space-between",
        flex: 1
    },
    conButton: {
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row"
    },
    buttonOne: {
        flex: 1,
        paddingEnd: layout.pad.md
    },
    buttonTwo: {
        flex: 1.5,
        paddingStart: layout.pad.md
    }
};

function stepHandler(
    state: VisitationGlobalState,
    setStepsDone: (e: number[] | ((curr: number[]) => number[])) => void
) {
    if (
        state?.createdLocation?.formattedAddress &&
        state?.locationAddress?.formattedAddress
    ) {
        setStepsDone((curr) => [...new Set(curr), 0]);
    } else {
        setStepsDone((curr) => curr.filter((num) => num !== 0));
    }
    const selectedPic = state?.pics?.filter((v) => v.isSelected);
    console.log(selectedPic);
    const customerTypeCond =
        state?.customerType === "COMPANY" ? !!state?.companyName : true;
    if (
        state?.customerType &&
        customerTypeCond &&
        state?.projectName &&
        selectedPic.length > 0
    ) {
        setStepsDone((curr) => [...new Set(curr), 1]);
    } else {
        setStepsDone((curr) => curr.filter((num) => num !== 1));
    }

    if (
        state?.stageProject &&
        state?.products?.length > 0 &&
        state?.estimationDate?.estimationMonth &&
        state?.estimationDate?.estimationWeek &&
        state?.paymentType
    ) {
        setStepsDone((curr) => [...new Set(curr), 2]);
    } else {
        setStepsDone((curr) => curr.filter((num) => num !== 2));
    }

    if (state?.competitors?.length > 0) {
        setStepsDone((curr) => [...new Set(curr), 3]);
    } else {
        setStepsDone((curr) => curr.filter((num) => num !== 3));
    }

    const filteredImages = state?.images?.filter((it) => it?.file !== null);
    if (filteredImages?.length > 0) {
        setStepsDone((curr) => [...new Set(curr), 4]);
    } else {
        setStepsDone((curr) => curr.filter((num) => num !== 4));
    }
}

function CreateVisitation() {
    const route = useRoute<RootStackScreenProps>();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const visitationData = useSelector((state: RootState) => state.visitation);
    const { keyboardVisible } = useKeyboardActive();
    const [stepsDone, setStepsDone] = useState<number[]>([0, 1, 2, 3]);
    const [isPopupVisible, setPopupVisible] = React.useState(false);

    const existingVisitation: visitationListResponse =
        route?.params?.existingVisitation;

    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const stepRender = [
        <FirstStep />,
        <SecondStep openBottomSheet={openBottomSheet} />,
        <ThirdStep />,
        <Fourth />,
        <Fifth />
    ];

    function populateData(existingData: visitationListResponse) {
        const { project } = existingData;
        const { company, Pics: picList, mainPic } = project;
        dispatch(
            updateDataVisitation({ type: "projectId", value: project.id })
        );
        dispatch(
            updateDataVisitation({ type: "projectName", value: project.name })
        );
        if (company) {
            dispatch(
                updateDataVisitation({ type: "customerType", value: "COMPANY" })
            );
            dispatch(
                updateDataVisitation({
                    type: "companyName",
                    value: company.displayName
                })
            );
        } else {
            dispatch(
                updateDataVisitation({
                    type: "customerType",
                    value: "INDIVIDU"
                })
            );
        }

        if (existingData.project?.stage) {
            dispatch(
                updateDataVisitation({
                    type: "stageProject",
                    value: existingData.project?.stage
                })
            );
        }

        if (existingData.project?.type) {
            dispatch(
                updateDataVisitation({
                    type: "typeProject",
                    value: existingData.project?.type
                })
            );
        }

        if (existingData.project?.Competitors?.length > 0) {
            dispatch(
                updateDataVisitation({
                    type: "competitors",
                    value: existingData.project?.Competitors
                })
            );
            // dispatch(
            //   updateDataVisitation({
            //     type: 'currentCompetitor',
            //     value: existingData.project?.Competitors[0],
            //   })
            // );
        }

        if (existingData.paymentType) {
            dispatch(
                updateDataVisitation({
                    type: "paymentType",
                    value: existingData.paymentType
                })
            );
        }

        if (existingData.visitNotes) {
            dispatch(
                updateDataVisitation({
                    type: "notes",
                    value: existingData.visitNotes
                })
            );
        }

        let estimationDate = {};

        if (existingData.estimationWeek) {
            estimationDate = {
                ...estimationDate,
                estimationWeek: Number(existingData.estimationWeek)
            };
        }
        if (existingData.estimationMonth) {
            estimationDate = {
                ...estimationDate,
                estimationMonth: Number(existingData.estimationMonth)
            };
        }
        if (estimationDate) {
            dispatch(
                updateDataVisitation({
                    type: "estimationDate",
                    value: estimationDate
                })
            );
        }

        if (existingData.products?.length > 0) {
            const newProductIDList = [];
            existingData.products.forEach((it) => {
                const newProduct = {
                    id: it.productId,
                    name: it.Product?.name,
                    display_name: it.Product?.displayName,
                    properties: it.Product?.properties,
                    pouringMethod: it?.pouringMethod,
                    quantity: it?.quantity,
                    Category: {
                        name: it.Product?.category?.name,
                        Parent: {
                            name: it.Product?.category?.parent?.name
                        }
                    }
                };
                newProductIDList.push(newProduct);
            });

            dispatch(
                updateDataVisitation({
                    type: "products",
                    value: newProductIDList
                })
            );
        }

        if (picList) {
            const list = picList.map((pic) => {
                if (mainPic) {
                    if (pic.id === mainPic.id) {
                        return {
                            ...pic,
                            isSelected: true
                        };
                    }
                }
                return {
                    ...pic,
                    isSelected: false
                };
            });
            dispatch(updateDataVisitation({ type: "pics", value: list }));
        } else if (project.Pic) {
            const selectedPic = { ...project.Pic };
            selectedPic.isSelected = true;
            dispatch(
                updateDataVisitation({ type: "pics", value: [selectedPic] })
            );
        }
    }

    const next = (nextStep: number) => () => {
        const totalStep = stepRender.length;
        if (nextStep < totalStep && nextStep >= 0) {
            dispatch(updateCurrentStep(nextStep));
        }
    };

    const actionBackButton = (directlyClose = false) => {
        if (visitationData.step > 0 && !directlyClose) {
            next(visitationData.step - 1)();
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

    useEffect(() => {
        crashlytics().log(CREATE_VISITATION);

        if (existingVisitation) {
            dispatch(updateExistingVisitationID(existingVisitation?.id));
            populateData(existingVisitation);
            const { project } = existingVisitation;
            const { LocationAddress } = project;
            dispatch(
                updateDataVisitation({
                    type: "existingLocationId",
                    value: LocationAddress?.id
                })
            );
            if (LocationAddress) {
                if (LocationAddress?.lon && LocationAddress?.lat) {
                    const longitude = Number(LocationAddress?.lon);
                    const latitude = Number(LocationAddress?.lat);
                    dispatch(
                        updateRegion({
                            formattedAddress: LocationAddress?.line1,
                            latitude,
                            longitude,
                            lat: latitude,
                            long: latitude,
                            PostalId: undefined,
                            line2: LocationAddress?.line2
                        })
                    );
                }
            }
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                if (bottomSheetRef?.current) bottomSheetRef?.current?.close();
                if (visitationData.isSearchProject) {
                    if (
                        visitationData.searchQuery &&
                        visitationData.searchQuery.trim() !== ""
                    ) {
                        dispatch(setSearchQuery(""));
                    } else {
                        dispatch(updateShouldScrollView(true));
                        dispatch(setSearchProject(false));
                    }
                } else {
                    actionBackButton(false);
                }
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
            return () => backHandler.remove();
        }, [
            visitationData.isSearchProject,
            visitationData.searchQuery,
            dispatch
        ])
    );

    const handleStepperFocus = () => {
        // to continue stepper focus when entering visitation page
        if (!visitationData.stepperVisitationShouldNotFocused) {
            if (visitationData.stepThreeVisitationFinished)
                dispatch(updateCurrentStep(3));
            else if (visitationData.stepTwoVisitationFinished)
                dispatch(updateCurrentStep(2));
            else if (visitationData.stepOneVisitationFinished)
                dispatch(updateCurrentStep(1));
        }

        // to reset stepper focus when continuing progress data
        if (
            visitationData.stepperVisitationShouldNotFocused &&
            visitationData.step === 0 &&
            (!visitationData.createdLocation?.formattedAddress ||
                !visitationData.locationAddress?.formattedAddress)
        ) {
            dispatch(resetStepperFocused(1));
        }
        const selectedPic = visitationData.pics?.filter((v) => v.isSelected);
        const customerTypeCond =
            visitationData.customerType === "COMPANY"
                ? !!visitationData.companyName
                : true;
        if (
            visitationData.stepperVisitationShouldNotFocused &&
            visitationData.step === 1 &&
            (visitationData.customerType ||
                customerTypeCond ||
                visitationData.projectName ||
                selectedPic)
        ) {
            dispatch(resetStepperFocused(2));
        }
        if (
            visitationData.stepperVisitationShouldNotFocused &&
            visitationData.step === 2 &&
            (visitationData.stageProject ||
                visitationData.products?.length <= 0 ||
                visitationData.estimationDate?.estimationMonth ||
                visitationData.estimationDate?.estimationWeek ||
                visitationData.paymentType)
        ) {
            dispatch(resetStepperFocused(3));
        }

        if (
            visitationData.stepperVisitationShouldNotFocused &&
            visitationData.step === 3 &&
            visitationData.competitors?.length <= 0
        ) {
            dispatch(resetStepperFocused(4));
        }
    };

    useEffect(() => {
        stepHandler(visitationData, setStepsDone);
        handleStepperFocus();
    }, [
        visitationData.createdLocation,
        visitationData.locationAddress,
        visitationData.pics,
        visitationData.stageProject,
        visitationData.products,
        visitationData.customerType,
        visitationData.companyName,
        visitationData.typeProject,
        visitationData.estimationDate.estimationMonth,
        visitationData.estimationDate.estimationWeek,
        visitationData.paymentType,
        visitationData.competitors,
        visitationData.images
    ]);

    const addPic = (state: PIC) => {
        const pic = state;
        pic.isSelected = true;
        const finalPIC = [...visitationData.pics];
        if (visitationData.pics && visitationData.pics.length > 0) {
            finalPIC.forEach((it, index) => {
                finalPIC[index] = {
                    ...finalPIC[index],
                    isSelected: false
                };
            });
        }
        dispatch(
            updateDataVisitation({
                type: "pics",
                value: [...finalPIC, pic]
            })
        );
    };

    return (
        <>
            <BStepperIndicator
                stepsDone={stepsDone}
                stepOnPress={(pos: number) => {
                    if (
                        shouldAllowVisitationStateToContinue(
                            pos,
                            visitationData
                        )
                    ) {
                        dispatch(setStepperFocused(pos));
                        next(pos)();
                    }
                }}
                currentStep={visitationData.step}
                labels={labels}
            />

            <BContainer paddingHorizontal={layout.pad.lg + layout.pad.xs}>
                <View style={styles.container}>
                    {stepRender[visitationData.step]}
                    <BSpacer size="extraSmall" />
                    {!keyboardVisible && visitationData.shouldScrollView && (
                        <BBackContinueBtn
                            onPressContinue={() => {
                                const step = visitationData.step + 1;
                                next(step)();
                                dispatch(setStepperFocused(step));
                                DeviceEventEmitter.emit(
                                    "CreateVisitation.continueButton",
                                    true
                                );
                            }}
                            onPressBack={() => actionBackButton(false)}
                            disableContinue={
                                !stepsDone.includes(visitationData.step)
                            }
                        />
                    )}
                    {/* {visitationData?.step === 0 && (
            <View style={styles.conButton}>
              <View style={styles.buttonOne}>
                <BButtonPrimary
                  title="Kembali"
                  isOutline
                  emptyIconEnable
                  onPress={() => actionBackButton()}
                />
              </View>
              <View style={styles.buttonTwo}>
                <BButtonPrimary
                  disable={!stepsDone.includes(visitationData?.step)}
                  title="Lanjut"
                  onPress={next(visitationData?.step + 1)}
                  rightIcon={ContinueIcon}
                />
              </View>
            </View>
          )} */}
                </View>
                <BSheetAddPic
                    ref={bottomSheetRef}
                    initialIndex={-1}
                    addPic={addPic}
                />
                <PopUpQuestion
                    isVisible={isPopupVisible}
                    setIsPopupVisible={() => {
                        dispatch(resetImageURLS({ source: CREATE_VISITATION }));
                        dispatch(resetVisitationState());
                        setPopupVisible(false);
                        navigation.goBack();
                    }}
                    actionButton={() => {
                        setPopupVisible(false);
                    }}
                    cancelText="Keluar"
                    actionText="Lanjutkan"
                    text="Apakah Anda yakin ingin keluar?"
                />
            </BContainer>
        </>
    );
}

export default CreateVisitation;
