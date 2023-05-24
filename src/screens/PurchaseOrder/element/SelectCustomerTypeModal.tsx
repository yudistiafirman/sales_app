import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import AntDesign from "react-native-vector-icons/AntDesign";
import { BBackContinueBtn, BButtonPrimary, BForm, BText } from "@/components";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import { resScale } from "@/utils";

const company = require("@/assets/icon/Visitation/company.png");
const profile = require("@/assets/icon/Visitation/profile.png");

const styles = StyleSheet.create({
    modalStyle: {
        justifyContent: "center",
        alignItems: "center"
    },
    popUpHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: resScale(320),
        paddingBottom: layout.pad.lg
    },
    modalContent: {
        backgroundColor: colors.white,
        justifyContent: "space-around",
        alignItems: "center",
        padding: layout.pad.lg,
        borderRadius: layout.radius.md,
        minHeight: resScale(144),
        minWidth: resScale(327)
    },
    headerTitle: {
        fontFamily: font.family.montserrat[700],
        fontSize: font.size.lg,
        color: colors.text.darker
    },
    inputContainer: {
        width: resScale(320)
    }
});

interface IProps {
    isVisible: boolean;
    onClose: () => void;
    onSelect: (customerType: "COMPANY" | "INDIVIDU") => void;
}

function SelectCustomerTypeModal({ isVisible, onClose, onSelect }: IProps) {
    const [purchaseOrderCustomerType, setPurchaseOrderCompanytype] =
        React.useState<"COMPANY" | "INDIVIDU">("COMPANY");

    const input: Input[] = [
        {
            label: "Jenis Pelanggan",
            isRequire: true,
            isError: false,
            type: "cardOption",
            value: purchaseOrderCustomerType,
            options: [
                {
                    icon: company,
                    title: "Perusahaan",
                    value: "COMPANY",
                    onChange: () => {
                        setPurchaseOrderCompanytype("COMPANY");
                    }
                },
                {
                    icon: profile,
                    title: "Individu",
                    value: "INDIVIDU",
                    onChange: () => {
                        setPurchaseOrderCompanytype("INDIVIDU");
                    }
                }
            ]
        }
    ];

    return (
        <Modal
            style={styles.modalStyle}
            isVisible={isVisible}
            hideModalContentWhileAnimating={false}
            backdropOpacity={0.3}
        >
            <View style={styles.modalContent}>
                <View style={styles.popUpHeader}>
                    <BText style={styles.headerTitle}>Tipe Pelanggan</BText>
                    <TouchableOpacity onPress={onClose}>
                        <AntDesign
                            name="close"
                            size={layout.pad.lg + layout.pad.xs}
                            color={colors.text.darker}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <BForm titleBold="500" inputs={input} />
                </View>

                <BButtonPrimary
                    title="Pilih"
                    onPress={() => onSelect(purchaseOrderCustomerType)}
                    buttonStyle={{ width: resScale(320) }}
                />
            </View>
        </Modal>
    );
}

export default SelectCustomerTypeModal;
