import * as React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from "react-native";
import Modal from "react-native-modal";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch } from "react-redux";
import {
    BContainer,
    BNestedProductCard,
    BSpacer,
    BVisitationCard,
    BButtonPrimary
} from "@/components";
import { colors, fonts, layout } from "@/constants";
import { openPopUp } from "@/redux/reducers/modalReducer";
import { AppDispatch } from "@/redux/store";
import { resScale } from "@/utils";

const style = StyleSheet.create({
    modal: { justifyContent: "flex-end", margin: 0 },
    container: {
        justifyContent: "space-between",
        height: resScale(300)
    },
    modalContent: {
        backgroundColor: "white",
        height: resScale(350),
        borderTopLeftRadius: layout.radius.lg,
        borderTopRightRadius: layout.radius.lg
    },
    modalHeader: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
    },
    headerText: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[700],
        fontSize: fonts.size.lg
    }
});

type PoModalData = {
    companyName: string;
    locationName?: string;
    listData: any;
};

type SelectedPOModalType = {
    isModalVisible: boolean;
    onCloseModal: () => void;
    poData: PoModalData;
    onPressCompleted: (data: any) => void;
    modalTitle: string;
    isDeposit?: boolean;
    dataToGet?: "SPHDATA" | "DEPOSITDATA" | "SCHEDULEDATA";
};

export default function SelectedPOModal({
    isModalVisible,
    onCloseModal,
    poData,
    onPressCompleted,
    modalTitle,
    isDeposit,
    dataToGet
}: SelectedPOModalType) {
    const [sphData, setSphData] = React.useState<any[]>([]);
    const [expandData, setExpandData] = React.useState<any[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const [scrollOffSet, setScrollOffSet] = React.useState<number | undefined>(
        undefined
    );

    React.useEffect(() => {
        const listData =
            poData?.listData && dataToGet === "SCHEDULEDATA"
                ? poData?.listData.filter((v) => v.SaleOrders.length > 0)
                : poData?.listData;
        setSphData(listData);
    }, [poData?.listData]);

    const onSelectButton = (idx: number) => {
        const newSphData = [...sphData];
        const selectedSphData: any[] = newSphData.map((v, i) => ({
            ...v,
            isSelected: idx === i
        }));
        setSphData(selectedSphData);
    };

    const onExpand = (index: number, data: any) => {
        let newExpandData;
        const isExisted = sphData[0]?.QuotationLetter?.id
            ? expandData?.findIndex(
                  (val) =>
                      val?.QuotationLetter?.id === data?.QuotationLetter?.id
              )
            : expandData?.findIndex((val) => val?.id === data?.id);
        if (isExisted === -1) {
            newExpandData = [...expandData, data];
        } else {
            newExpandData = sphData[0]?.QuotationLetter?.id
                ? expandData.filter(
                      (val) =>
                          val?.QuotationLetter?.id !== data?.QuotationLetter?.id
                  )
                : expandData.filter((val) => val?.id !== data?.id);
        }
        setExpandData(newExpandData);
    };

    const onCloseSelectedPoModal = () => {
        setSphData([...sphData]);
        setExpandData([]);
        onCloseModal();
    };

    const onSaveSelectedPo = () => {
        if (sphData.length === 1) {
            onPressCompleted(sphData);
            onCloseSelectedPoModal();
        } else {
            const selectedSphData = sphData.filter((v) => v.isSelected);
            if (selectedSphData.length > 0) {
                onPressCompleted(selectedSphData);
                onCloseSelectedPoModal();
            } else {
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        outsideClickClosePopUp: true,
                        popUpText: "Salah Satu SPH harus di pilih"
                    })
                );
            }
        }
    };

    return (
        <Modal
            hideModalContentWhileAnimating
            backdropOpacity={0.3}
            isVisible={isModalVisible}
            onBackButtonPress={onCloseModal}
            style={style.modal}
            scrollOffset={scrollOffSet}
            scrollOffsetMax={resScale(350) - resScale(190)}
            propagateSwipe
        >
            <View style={style.modalContent}>
                <BContainer>
                    <View style={style.container}>
                        <View>
                            <View style={style.modalHeader}>
                                <Text style={style.headerText}>
                                    {modalTitle}
                                </Text>
                                <TouchableOpacity
                                    onPress={onCloseSelectedPoModal}
                                >
                                    <MaterialCommunityIcons
                                        name="close"
                                        size={25}
                                        color="#000000"
                                    />
                                </TouchableOpacity>
                            </View>
                            <BSpacer size="extraSmall" />
                            <View style={{ height: resScale(250) }}>
                                <ScrollView
                                    onScroll={(event) => {
                                        setScrollOffSet(
                                            event.nativeEvent.contentOffset.y
                                        );
                                    }}
                                >
                                    <BVisitationCard
                                        item={{
                                            name: poData?.companyName,
                                            location: poData?.locationName
                                        }}
                                        isRenderIcon={false}
                                    />
                                    <BSpacer size="extraSmall" />
                                    {poData?.listData &&
                                        poData?.listData.length > 0 && (
                                            <BNestedProductCard
                                                isOption={
                                                    poData?.listData.length > 1
                                                }
                                                withoutHeader={false}
                                                data={sphData}
                                                isDeposit={isDeposit}
                                                expandData={expandData}
                                                onSelect={onSelectButton}
                                                onExpand={onExpand}
                                            />
                                        )}
                                </ScrollView>
                            </View>

                            <BButtonPrimary
                                title="Simpan"
                                onPress={onSaveSelectedPo}
                            />
                        </View>
                    </View>
                </BContainer>
            </View>
        </Modal>
    );
}
