import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import {
    BSearchBar,
    BSpacer,
    BForm,
    BTouchableText,
    BGallery,
    BVisitationCard,
    BNestedProductCard
} from "@/components";
import SelectPurchaseOrderData from "@/components/templates/SelectPurchaseOrder";
import { layout } from "@/constants";
import { QuotationRequests } from "@/interfaces/createPurchaseOrder";
import { CAMERA, PO } from "@/navigation/ScreenNames";
import { RootState, AppDispatch } from "@/redux/store";
import { resScale } from "@/utils";

const styles = StyleSheet.create({
    firstStepContainer: {
        flex: 1,
        paddingBottom: layout.pad.xxl
    }
});

function CreatePo() {
    const navigation = useNavigation();
    const poState = useSelector((state: RootState) => state.purchaseOrder);
    const dispatch = useDispatch<AppDispatch>();
    const navRoutes = useRoute();
    const {
        poImages,
        choosenSphDataFromModal,
        openCamera,
        poNumber,
        customerType
    } = poState.currentState.context;
    const isUserChoosedSph = JSON.stringify(choosenSphDataFromModal) !== "{}";
    const [expandData, setExpandData] = React.useState<any[]>([]);
    const addMoreImages = useCallback(() => {
        dispatch({ type: "addMoreImages" });
    }, [dispatch]);

    const goToCamera = useCallback(() => {
        navigation.navigate(CAMERA, {
            photoTitle: "File PO",
            navigateTo: PO,
            disabledDocPicker: false,
            disabledGalleryPicker: false,
            closeButton: true
        });
    }, [navigation]);

    const deleteImages = (i: number) => {
        dispatch({
            type: "deleteImage",
            value: i + 1
        });
    };

    useEffect(() => {
        if (openCamera) {
            goToCamera();
        }
    }, [
        dispatch,
        goToCamera,
        navRoutes.params,
        openCamera,
        poState.currentState
    ]);

    const inputs: Input[] = [
        {
            label: "No. Purchase Order",
            isRequire: true,
            isError: false,
            type: "textInput",
            onChange: (e: any) => {
                dispatch({
                    type: "inputSph",
                    value: e.nativeEvent.text
                });
            },
            value: poNumber
        }
    ];

    const onPressCompleted = ({
        parentData,
        data
    }: {
        parentData: {
            companyName: string;
            locationName: string;
            projectId: string;
        };
        data: QuotationRequests;
    }) => {
        const selectedSphFromModal = {};
        selectedSphFromModal.name = parentData.companyName;
        selectedSphFromModal.locationName = parentData.locationName;
        selectedSphFromModal.id = parentData.projectId;
        selectedSphFromModal.QuotationRequests = data;

        dispatch({
            type: "addChoosenSph",
            value: selectedSphFromModal
        });
    };

    const renderCustomButton = () => (
        <BTouchableText
            onPress={() => dispatch({ type: "searchingSph" })}
            title="Ganti"
        />
    );

    const onExpand = (index: number, data: any) => {
        let newExpandsetExpandData;
        const isExisted = expandData?.findIndex(
            (val) => val?.QuotationLetter?.id === data?.QuotationLetter?.id
        );
        if (isExisted === -1) {
            newExpandsetExpandData = [...expandData, data];
        } else {
            newExpandsetExpandData = expandData.filter(
                (val) => val?.QuotationLetter?.id !== data?.QuotationLetter?.id
            );
        }
        setExpandData(newExpandsetExpandData);
    };

    return (
        <View style={styles.firstStepContainer}>
            {poState.currentState.matches("firstStep.SearchSph") ? (
                <SelectPurchaseOrderData
                    dataToGet="SPHDATA"
                    filterSphDataBy={customerType}
                    onDismiss={() => dispatch({ type: "backToAddPo" })}
                    onSubmitData={({ parentData, data }) =>
                        onPressCompleted({ parentData, data })
                    }
                />
            ) : (
                <View style={{ height: "100%", flexDirection: "row" }}>
                    <FlashList
                        estimatedItemSize={1}
                        data={[1]}
                        renderItem={() => <BSpacer size="verySmall" />}
                        ListHeaderComponent={
                            <View>
                                {customerType === "COMPANY" && (
                                    <>
                                        <BGallery
                                            addMorePict={addMoreImages}
                                            picts={poImages}
                                            removePict={deleteImages}
                                        />
                                        <BSpacer size="extraSmall" />
                                        <BForm inputs={inputs} />
                                    </>
                                )}

                                {isUserChoosedSph ? (
                                    <>
                                        <View style={{ height: resScale(57) }}>
                                            <BVisitationCard
                                                item={{
                                                    name: choosenSphDataFromModal.name,
                                                    location:
                                                        choosenSphDataFromModal.locationName
                                                }}
                                                isRenderIcon
                                                customIcon={renderCustomButton}
                                            />
                                        </View>

                                        <BSpacer size="extraSmall" />
                                        <BNestedProductCard
                                            withoutHeader={false}
                                            data={
                                                choosenSphDataFromModal?.QuotationRequests
                                            }
                                            expandData={expandData}
                                            onExpand={onExpand}
                                        />
                                    </>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() =>
                                            dispatch({ type: "searchingSph" })
                                        }
                                        style={{ height: resScale(50) }}
                                    >
                                        <BSearchBar
                                            left={
                                                <TextInput.Icon
                                                    forceTextInputFocus={false}
                                                    icon="magnify"
                                                />
                                            }
                                            disabled
                                            placeholder="Cari PT / Proyek"
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        }
                    />
                </View>
            )}
        </View>
    );
}

export default CreatePo;
