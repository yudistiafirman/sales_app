import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import { IComboRadioBtn, Input, TitleBold } from "@/interfaces";
import { resScale } from "@/utils";
import BText from "../atoms/BText";
import BSpacer from "../atoms/BSpacer";
import BLabel from "../atoms/BLabel";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
        borderRadius: layout.radius.md,
        minHeight: resScale(93)
    },
    innerContainer: {
        paddingVertical: layout.pad.md + layout.pad.xs,
        paddingRight: layout.pad.md
    },
    radio: {
        flexDirection: "row",
        alignItems: "center"
    },
    radioValue: {
        fontFamily: font.family.montserrat[400],
        fontSize: font.size.sm,
        color: colors.text.darker
    }
});

function BComboRadioButton({
    isRequire,
    textSize,
    titleBold,
    label,
    firstValue,
    firstText,
    firstStatus,
    secondValue,
    secondText,
    secondStatus,
    firstChildren,
    secondChildren,
    isHorizontal = false,
    onSetComboRadioButtonValue
}: Partial<Input> & IComboRadioBtn & TitleBold) {
    const checkbuttonAction = onSetComboRadioButtonValue || null;
    return (
        <View
            style={[
                styles.container,
                isHorizontal && {
                    minHeight: resScale(63),
                    backgroundColor: colors.white,
                    borderRadius: undefined
                }
            ]}
        >
            <View style={styles.innerContainer}>
                <View
                    style={[
                        { paddingStart: layout.pad.md },
                        isHorizontal && { paddingStart: 0 }
                    ]}
                >
                    <BLabel
                        sizeInNumber={textSize}
                        bold={titleBold}
                        label={label}
                        isRequired={isRequire}
                    />
                </View>

                <BSpacer size="extraLarge" />

                <View
                    style={[
                        isHorizontal && {
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingEnd: layout.pad.md
                        }
                    ]}
                >
                    <View style={styles.radio}>
                        <RadioButton
                            value={firstValue}
                            status={firstStatus}
                            color={colors.primary}
                            uncheckedColor={colors.border.altGrey}
                            onPress={() =>
                                checkbuttonAction !== null &&
                                checkbuttonAction(firstValue!)
                            }
                        />
                        <BText style={styles.radioValue}>{firstText}</BText>
                    </View>
                    {firstChildren}
                    <View style={styles.radio}>
                        <RadioButton
                            value={secondValue}
                            status={secondStatus}
                            color={colors.primary}
                            uncheckedColor={colors.border.altGrey}
                            onPress={() =>
                                checkbuttonAction !== null &&
                                checkbuttonAction(secondValue!)
                            }
                        />
                        <BText style={styles.radioValue}>{secondText}</BText>
                    </View>
                    {secondChildren}
                </View>
            </View>
        </View>
    );
}

export default BComboRadioButton;
