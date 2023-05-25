import React from "react";
import { StyleSheet, View } from "react-native";
import font from "@/constants/fonts";
import { colors, layout } from "@/constants";
import BButtonPrimary from "../atoms/BButtonPrimary";
import BSpacer from "../atoms/BSpacer";
import BSvg from "../atoms/BSvg";
import { SVGName } from "..";
import SvgNames from "../atoms/BSvg/svgName";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    },
    binTitle: {
        fontFamily: font.family.montserrat[500],
        fontSize: font.size.md,
        color: colors.text.shadowGray
    },
    btnStyle: {
        borderRadius: layout.radius.md,
        borderColor: colors.border.lightGrayishBlue
    }
});

type IBFilterSort = {
    onPressFilter: () => void;
    onPressSort: () => void;
};

function BFilterSort({ onPressFilter, onPressSort }: IBFilterSort) {
    const renderIcon = (type: "filter" | "sort") => (
        <BSvg
            svgName={type === "filter" ? SvgNames.IC_FILTER : SvgNames.IC_SORT}
            width={layout.pad.lg}
            height={layout.pad.lg}
            type="fill"
            color={colors.white}
        />
    );
    return (
        <View style={styles.container}>
            <BButtonPrimary
                onPress={onPressFilter}
                outlineBtnStyle={styles.btnStyle}
                outlineTitleStyle={styles.binTitle}
                isOutline
                leftIcon={() => renderIcon("filter")}
                title="Filter"
            />
            <BSpacer size="extraSmall" />
            <BButtonPrimary
                onPress={onPressSort}
                outlineBtnStyle={styles.btnStyle}
                outlineTitleStyle={styles.binTitle}
                isOutline
                rightIcon={() => renderIcon("sort")}
                title="Urutkan"
            />
        </View>
    );
}

export default BFilterSort;
