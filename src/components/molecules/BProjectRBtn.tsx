import React from "react";
import { StyleSheet, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import { resScale } from "@/utils";
import BText from "../atoms/BText";
import BSpacer from "../atoms/BSpacer";

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.offWhite,
        height: layout.pad.xl + layout.pad.sm,
        borderColor: colors.border.default,
        borderRadius: layout.radius.md,
        borderWidth: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: layout.pad.lg
    },
    radioTitle: {
        fontFamily: font.family.montserrat[500],
        fontSize: font.size.md
    }
});

interface IProps {
    isOption?: boolean;
    projectId?: string;
    onSelect?: (index: number) => void;
    idx?: number;
    isSelected?: boolean;
    projectName?: string;
}

function BProjectRBtn({
    isOption,
    projectId,
    isSelected,
    onSelect,
    idx,
    projectName
}: IProps) {
    const paddingLeft = isOption ? 0 : layout.pad.md + layout.pad.xs;
    const actionButton = onSelect || null;
    return (
        <View style={styles.container}>
            {isOption && (
                <RadioButton
                    uncheckedColor={colors.border.altGrey}
                    value={projectId!}
                    color={colors.primary}
                    status={isSelected ? "checked" : "unchecked"}
                    onPress={() => {
                        if (actionButton !== null) {
                            actionButton(idx!);
                        }
                    }}
                />
            )}
            <BText style={[styles.radioTitle, { paddingLeft }]}>
                {projectName}
            </BText>
        </View>
    );
}

export default BProjectRBtn;
