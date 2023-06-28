import React from "react";
import { KeyboardTypeOptions, StyleSheet, Text, View } from "react-native";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import {
    ITableInput,
    ITableInputItem,
    ITableInputListItem,
    TitleBold
} from "@/interfaces";
import { resScale } from "@/utils";
import BTextInput from "../atoms/BTextInput";
import BSpacer from "../atoms/BSpacer";
import BLabel from "../atoms/BLabel";

const styles = StyleSheet.create({
    labelContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: layout.pad.md
    },
    priceLabelContainer: {
        flex: 0.6,
        paddingLeft: layout.pad.lg + layout.pad.md
    },
    outerCell: {
        borderRadius: layout.radius.sm,
        flex: 0.5,
        backgroundColor: colors.lightRed,
        height: resScale(40)
    },
    innerCell: {
        padding: layout.pad.md + layout.pad.xs,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    cellText: {
        fontFamily: font.family.montserrat[400],
        fontSize: font.size.md,
        color: colors.text.darker
    },
    outerCellSpecialPriceContainer: {
        flex: 0.5,
        justifyContent: "space-evenly",
        flexDirection: "row",
        alignItems: "center",
        bottom: layout.pad.sm
    },
    inputPrice: {
        flex: 1,
        paddingHorizontal: layout.pad.lg + layout.pad.ml,

        bottom: layout.pad.xs
    },
    inputLabel: {
        position: "absolute",
        zIndex: 1,
        bottom: layout.pad.ml
    },
    cellContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: layout.pad.md
    }
});

function BTableInput({
    titleBold,
    textSize,
    firstColumnLabel,
    secondColumnLabel,
    tableInputListItem,
    onChangeValue
}: ITableInput & TitleBold) {
    const renderTableItems = ({ item, index }: ITableInputItem) => {
        const renderFirstColumnCell = () => (
            <View style={styles.outerCell}>
                <View style={styles.innerCell}>
                    <Text style={styles.cellText}>
                        {item?.firstColumnRangeTitle
                            ? item?.firstColumnRangeTitle
                            : "0"}
                    </Text>
                    <Text style={styles.cellText}>
                        {item?.firstColumnUnit ? item?.firstColumnUnit : "m³"}
                    </Text>
                </View>
            </View>
        );

        const renderInputColumnCell = () => (
            <View style={styles.outerCellSpecialPriceContainer}>
                <View style={[styles.inputLabel, { left: layout.pad.ml }]}>
                    <Text style={[styles.cellText]}>
                        {item?.secondColumnNominalInput
                            ? item?.secondColumnNominalInput
                            : "Rp"}
                    </Text>
                </View>

                <View style={{ flex: 1 }}>
                    <BTextInput
                        contentStyle={styles.cellText}
                        placeholder={
                            item?.tableInputPlaceholder
                                ? item?.tableInputPlaceholder
                                : ""
                        }
                        onChangeText={(val) =>
                            onChangeValue && onChangeValue(val, index!)
                        }
                        value={item?.tableInputValue ?? item?.tableInputValue}
                        keyboardType={
                            item?.tableInputKeyboardType
                                ? item?.tableInputKeyboardType
                                : "numeric"
                        }
                        style={styles.inputPrice}
                    />
                </View>
                <View style={[styles.inputLabel, { right: layout.pad.ml }]}>
                    <Text style={styles.cellText}>
                        {item?.secondColumnUnitInput
                            ? item?.secondColumnUnitInput
                            : "/m³"}
                    </Text>
                </View>
            </View>
        );
        return (
            <View key={index} style={styles.cellContainer}>
                {renderFirstColumnCell()}
                <BSpacer size="extraSmall" />
                {renderInputColumnCell()}
            </View>
        );
    };

    const renderFirstColumnLabel = () => (
        <View>
            <BLabel
                label={firstColumnLabel || ""}
                bold={titleBold}
                sizeInNumber={textSize}
            />
        </View>
    );

    const renderSecondColumnLabel = () => (
        <View style={styles.priceLabelContainer}>
            <BLabel
                label={secondColumnLabel || ""}
                sizeInNumber={textSize}
                bold={titleBold}
            />
        </View>
    );

    return (
        <>
            <View style={styles.labelContainer}>
                {renderFirstColumnLabel()}
                {renderSecondColumnLabel()}
            </View>
            <BSpacer size="verySmall" />
            {tableInputListItem &&
                tableInputListItem?.length > 0 &&
                tableInputListItem?.map(
                    (item: ITableInputListItem, index: number) =>
                        renderTableItems({ item, index })
                )}
        </>
    );
}

export default BTableInput;
