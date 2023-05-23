import React from "react";
import { View, Image, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import BButtonPrimary from "@/components/atoms/BButtonPrimary";
import BSpacer from "@/components/atoms/BSpacer";
import BText from "@/components/atoms/BText";
import { layout } from "@/constants";
import colors from "@/constants/colors";
import font from "@/constants/fonts";
import resScale from "@/utils/resScale";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    emptyimage: {
        width: resScale(88),
        height: resScale(88),
        marginBottom: layout.pad.md
    },
    emptyText: {
        fontFamily: font.family.montserrat[600],
        fontSize: font.size.md,
        textAlign: "center",
        color: colors.text.darker
    },
    btnWrapper: {
        alignItems: "center"
    }
});

type EmptyStateProps = {
    emptyProductName?: string;
    emptyText?: string;
    isError?: boolean;
    errorMessage?: string | unknown;
    actionBtnTitle?: string;
    onAction?: () => void;
};

const IconNotFound = require("@/assets/icon/ic_not_found.png");

function EmptyState({
    emptyText,
    isError,
    errorMessage,
    actionBtnTitle = "Retry",
    onAction
}: EmptyStateProps) {
    const renderIcon = () => {
        if (isError) {
            return (
                <AntDesign size={resScale(48)} name="closecircle" color="red" />
            );
        }
        return <Image style={styles.emptyimage} source={IconNotFound} />;
    };

    const renderContent = () => {
        if (isError) {
            return <BText style={styles.emptyText}>{errorMessage}</BText>;
        }
        return <BText style={styles.emptyText}>{emptyText}</BText>;
    };

    return (
        <View style={styles.container}>
            <BSpacer size="small" />
            {renderIcon()}
            <BSpacer size="small" />
            <View style={{ flex: 1 }}>
                <>{renderContent()}</>
                <BSpacer size="small" />
                {isError && (
                    <View style={styles.btnWrapper}>
                        <BButtonPrimary
                            isOutline
                            title={actionBtnTitle}
                            onPress={onAction}
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

export default EmptyState;
