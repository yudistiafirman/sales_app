import React, { useState } from "react";
import { Dimensions, StyleSheet, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import AntDesign from "react-native-vector-icons/AntDesign";
import { BButtonPrimary, BForm, BSpacer, BText } from "@/components";
import { colors, layout } from "@/constants";
import { METHOD_LIST } from "@/constants/dropdown";
import font from "@/constants/fonts";
import { Input } from "@/interfaces";
import { resScale } from "@/utils";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-end",
        margin: 0
    },
    container: {
        height: width / 1.05,
        backgroundColor: colors.white,
        borderTopLeftRadius: layout.radius.md,
        borderTopRightRadius: layout.radius.md,
        padding: layout.pad.lg
    },
    headerTitle: {
        fontFamily: font.family.montserrat[700],
        fontSize: font.size.lg,
        color: colors.text.darker
    },
    popUpHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: layout.pad.lg
    },
    volumeInput: {
        width: width / 2
    },
    buttonWrapper: {
        bottom: layout.pad.xl,
        position: "absolute",
        flex: 1,
        width: "100%",
        alignSelf: "center"
    }
});

type IProductDetailModal = {
    isVisible: boolean;
    onClose: () => void;
    onChoose: (data: any) => void;
};

function ProductDetailModal({
    isVisible,
    onClose,
    onChoose
}: IProductDetailModal) {
    const [inputsValue, setInputsValue] = useState({
        volume: "",
        pouringMethods: ""
    });

    const volumeInputs: Input = {
        type: "quantity",
        label: "Volume",
        isRequire: true,
        value: inputsValue.volume,
        onChange: (v) => setInputsValue((prev) => ({ ...prev, volume: v })),
        placeholder: "0",
        isError: inputsValue.volume === ""
    };

    const pouringMethod: Input = {
        type: "dropdown",
        label: "Metode Penuangan",
        isRequire: true,
        value: inputsValue.pouringMethods,
        isError: inputsValue.pouringMethods === "",
        dropdown: {
            placeholder: "Pilih metode penuangan",
            items: METHOD_LIST,
            onChange: (value: any) => {
                setInputsValue((prev) => ({ ...prev, pouringMethods: value }));
            }
        }
    };
    return (
        <Modal style={styles.modal} isVisible={isVisible}>
            <View style={styles.container}>
                <View style={styles.popUpHeader}>
                    <BText style={styles.headerTitle}>
                        Detil Pemesanan Produk
                    </BText>
                    <TouchableOpacity
                        onPress={() => {
                            setInputsValue({ pouringMethods: "", volume: "" });
                            onClose();
                        }}
                    >
                        <AntDesign
                            name="close"
                            size={layout.pad.lg + layout.pad.xs}
                            color={colors.text.darker}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.volumeInput}>
                    <BForm titleBold="500" inputs={[volumeInputs]} />
                </View>
                <View>
                    <BForm titleBold="500" inputs={[pouringMethod]} />
                </View>

                <View style={styles.buttonWrapper}>
                    <BButtonPrimary
                        disable={
                            inputsValue.volume === "" ||
                            inputsValue.pouringMethods === ""
                        }
                        onPress={() => {
                            onChoose({
                                quantity: inputsValue.volume,
                                pouringMethod: inputsValue.pouringMethods
                            });
                            setInputsValue({ volume: "", pouringMethods: "" });
                        }}
                        title="Tambah Produk"
                    />
                </View>
            </View>
        </Modal>
    );
}

export default ProductDetailModal;
