import React from "react";
import { StyleSheet, View } from "react-native";
import font from "@/constants/fonts";
import { colors, layout } from "@/constants";
import BButtonPrimary from "../atoms/BButtonPrimary";
import BSpacer from "../atoms/BSpacer";
import BSvg from "../atoms/BSvg";
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
        borderColor: colors.border.default
    }
});

type IBFilterSort = {
    onPressFilter: () => void;
    onPressSort: () => void;
    isSelectedFilter?: boolean;
    isSelectedSort?: boolean;
    isFilterHidden?: boolean;
    isSortHidden?: boolean;
};

function BFilterSort({
    onPressFilter,
    onPressSort,
    isSelectedFilter = false,
    isSelectedSort = false,
    isFilterHidden = false,
    isSortHidden = false
}: IBFilterSort) {
    const getIconColor = (type: string): string => {
        if (type === "filter" && isSelectedFilter) {
            return colors.primary;
        }
        if (type === "sort" && isSelectedSort) {
            return colors.primary;
        }
        return colors.white;
    };

    const renderIcon = (type: "filter" | "sort") => (
        <BSvg
            svgName={type === "filter" ? SvgNames.IC_FILTER : SvgNames.IC_SORT}
            width={layout.pad.lg}
            height={layout.pad.lg}
            type="fill"
            color={getIconColor(type)}
        />
    );

    return (
        <View style={styles.container}>
            {!isFilterHidden && (
                <>
                    <BButtonPrimary
                        onPress={onPressFilter}
                        outlineBtnStyle={[
                            styles.btnStyle,
                            isSelectedFilter === true
                                ? { borderColor: colors.primary }
                                : { borderColor: colors.border.default }
                        ]}
                        outlineTitleStyle={[
                            styles.binTitle,
                            isSelectedFilter === true
                                ? { color: colors.primary }
                                : { color: colors.text.shadowGray }
                        ]}
                        isOutline
                        leftIcon={() => renderIcon("filter")}
                        title="Filter"
                    />
                    <BSpacer size="extraSmall" />
                </>
            )}
            {!isSortHidden && (
                <BButtonPrimary
                    onPress={onPressSort}
                    outlineBtnStyle={[
                        styles.btnStyle,
                        isSelectedSort === true
                            ? { borderColor: colors.primary }
                            : { borderColor: colors.border.default }
                    ]}
                    outlineTitleStyle={[
                        styles.binTitle,
                        isSelectedSort === true
                            ? { color: colors.primary }
                            : { color: colors.text.shadowGray }
                    ]}
                    isOutline
                    rightIcon={() => renderIcon("sort")}
                    title="Urutkan"
                />
            )}
        </View>
    );
}

export default BFilterSort;
