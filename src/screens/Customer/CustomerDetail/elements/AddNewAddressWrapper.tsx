import { colors, fonts, layout } from "@/constants";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Octicons from "react-native-vector-icons/Octicons";
const AddNewAddressWrapper = ({
    isBilling,
    onPress
}: {
    isBilling: boolean;
    onPress: () => void;
}) => {
    return (
        <TouchableOpacity style={styles.addBilling} onPress={onPress}>
            <Octicons
                name="plus"
                color={colors.primary}
                size={fonts.size.xs}
                style={styles.plusStyle}
            />
            <Text style={styles.seeAllText}>
                {isBilling ? "Tambah Alamat Penagihan" : "Tambah Alamat Proyek"}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    addBilling: {
        flexDirection: "row",
        alignItems: "center"
    },
    plusStyle: {
        marginRight: layout.pad.sm
    },
    seeAllText: {
        color: colors.primary,
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.sm
    }
});

export default AddNewAddressWrapper;
