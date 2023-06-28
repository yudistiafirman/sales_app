import React, { useContext, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Modal from "react-native-modal";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { BContainer, BForm, BSpacer, BButtonPrimary } from "@/components";
import { colors, fonts, layout } from "@/constants";
import { Input, PIC } from "@/interfaces";
import { updateSelectedCompany } from "@/redux/reducers/SphReducer";
import { RootState } from "@/redux/store";
import { resScale } from "@/utils";
import { SphContext } from "./context/SphContext";

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
    },
    tambahPicContainer: {
        justifyContent: "flex-end",
        flexDirection: "row",
        alignItems: "center"
    },
    tambahPicText: {
        color: colors.primary,
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.sm
    },
    loadingShimmer: {
        width: resScale(335),
        height: resScale(100),
        borderRadius: layout.radius.md
    }
});

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type DummyType = {
    id: string;
    name: string;
    position: string;
    phone: number;
    email: string;
};
const dummyData: DummyType[] = [
    {
        id: "kwos0299",
        name: "Agus",
        position: "Finance",
        phone: 81128869884,
        email: "agus@gmail.com"
    },
    {
        id: "1233okjs",
        name: "Joko",
        position: "Finance",
        phone: 81128869884,
        email: "Joko@gmail.com"
    },
    {
        id: "jsncijc828",
        name: "Johny",
        position: "Finance",
        phone: 81128869884,
        email: "Johny@gmail.com"
    }
];
function dummyReq() {
    return new Promise<DummyType[]>((resolve) => {
        setTimeout(() => {
            resolve(dummyData);
        }, 5000);
    });
}

type ChoosePicModalType = {
    isModalVisible: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    openAddPic: () => void;
    selectPic?: (pic?: PIC) => void;
};

export default function ChoosePicModal({
    isModalVisible,
    setIsModalVisible,
    openAddPic = () => {},
    selectPic = () => {}
}: ChoosePicModalType) {
    const [isLoading, setIsLoading] = useState(false);
    const [, stateUpdate] = useContext(SphContext);
    const sphData = useSelector((state: RootState) => state.sph);
    const dispatch = useDispatch();

    const [scrollOffSet, setScrollOffSet] = useState<number | undefined>(
        undefined
    );

    function selectedPicData() {
        if (
            sphData?.selectedCompany?.Pics &&
            sphData?.selectedCompany?.Pics?.length > 0
        ) {
            const listPic = sphData?.selectedCompany?.Pics;
            for (let i = 0; i < listPic?.length; i += 1) {
                if (listPic[i]?.isSelected) {
                    return listPic[i];
                }
            }
        }
        return undefined;
    }

    const inputsData: Input[] = useMemo(
        () => [
            {
                label: "PIC",
                isRequire: true,
                isError: false,
                type: "PIC",
                value: sphData?.selectedCompany?.Pics
                    ? sphData?.selectedCompany?.Pics
                    : [],
                hidePicLabel: true,
                onSelect: (index: number) => {
                    const listPic: any[] = [];
                    sphData?.selectedCompany?.Pics?.forEach((pic, picIndex) => {
                        const picChanged = { ...pic };
                        if (index === picIndex) {
                            picChanged.isSelected = true;
                        } else {
                            picChanged.isSelected = false;
                        }
                        listPic?.push(picChanged);
                    });
                    dispatch(
                        updateSelectedCompany({
                            ...sphData?.selectedCompany,
                            Pics: listPic
                        })
                    );
                }
            }
        ],
        [sphData?.selectedCompany]
    );

    return (
        <Modal
            hideModalContentWhileAnimating
            backdropOpacity={0.3}
            isVisible={isModalVisible}
            onBackButtonPress={() => setIsModalVisible((curr) => !curr)}
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
                                <Text style={style.headerText}>Pilih PIC</Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        setIsModalVisible((curr) => !curr)
                                    }
                                >
                                    <MaterialCommunityIcons
                                        name="close"
                                        size={30}
                                        color="#000000"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: resScale(250) }}>
                                <View style={style.tambahPicContainer}>
                                    <TouchableOpacity onPress={openAddPic}>
                                        <Text style={style.tambahPicText}>
                                            + Tambah PIC
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <BSpacer size="extraSmall" />
                                <ScrollView
                                    onScroll={(event) => {
                                        setScrollOffSet(
                                            event?.nativeEvent?.contentOffset?.y
                                        );
                                    }}
                                >
                                    {!isLoading && (
                                        <BForm
                                            titleBold="500"
                                            inputs={inputsData}
                                        />
                                    )}
                                    {isLoading && (
                                        <View>
                                            <BSpacer size="extraSmall" />
                                            <ShimmerPlaceHolder
                                                style={style.loadingShimmer}
                                            />
                                            <BSpacer size="extraSmall" />
                                            <ShimmerPlaceHolder
                                                style={style.loadingShimmer}
                                            />
                                        </View>
                                    )}
                                </ScrollView>
                            </View>
                            <BButtonPrimary
                                title="Pilih"
                                onPress={() => {
                                    selectPic(selectedPicData());
                                }}
                            />
                        </View>
                    </View>
                </BContainer>
            </View>
        </Modal>
    );
}
