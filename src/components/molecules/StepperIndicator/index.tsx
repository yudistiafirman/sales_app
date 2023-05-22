import { TouchableOpacity } from "@gorhom/bottom-sheet";
import React, { forwardRef, Ref, useMemo } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { resScale } from "@/utils";
import { fonts, colors, layout } from "@/constants";

const styles = StyleSheet.create({
    mainContainer: {
        height: resScale(25),
        paddingHorizontal: layout.pad.md,
        zIndex: 2,
        alignItems: "center",
        backgroundColor: "white"
    },
    scrollContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: layout.pad.md
    },
    dot: {
        width: resScale(16),
        height: resScale(16),
        borderRadius: layout.radius.lg,
        marginHorizontal: layout.pad.sm,
        justifyContent: "center",
        alignItems: "center"
    },
    dotNumber: {
        color: colors.white,
        fontFamily: fonts.family.montserrat[700],
        fontSize: fonts.size.xs
    },
    redDot: {
        backgroundColor: colors.primary
    },
    blackDot: {
        backgroundColor: "#C7C7C7"
    },
    greenDot: {
        backgroundColor: "green"
    },
    separatorLine: {
        width: resScale(12),
        height: resScale(2),
        marginHorizontal: layout.pad.sm
    },
    greenLine: {
        backgroundColor: "green"
    },
    grayLine: {
        backgroundColor: "gray"
    },
    dotContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    labelStyle: {
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.xs,
        color: colors.text.darker
    }
});

interface StepperIndicatorProps {
    currentStep: number;
    labels: string[];
    stepOnPress?: (pos: number) => void;
    stepsDone: number[]; // index of done steps
}

const StepperIndicator = forwardRef(
    (
        {
            currentStep,
            labels,
            stepOnPress = () => {},
            stepsDone
        }: StepperIndicatorProps,
        ref: Ref<ScrollView>
    ) => {
        const dots = useMemo(
            () =>
                labels.map((label, index) => {
                    const steps = labels.length;
                    const maxNumber = Math.max(...stepsDone);
                    const isStepDone = stepsDone.includes(index);
                    const isStepClickable =
                        index <= maxNumber || index === maxNumber + 1;
                    const dotStyle = [
                        styles.dot,
                        isStepDone ? styles.greenDot : styles.blackDot,
                        currentStep === index ? styles.redDot : null
                    ];
                    const lineStyle = [
                        styles.separatorLine,
                        isStepDone ? styles.greenLine : styles.grayLine
                    ];
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                if (isStepClickable) {
                                    stepOnPress(index);
                                }
                            }}
                            key={index.toString() + label}
                        >
                            <View style={styles.dotContainer}>
                                <View style={dotStyle}>
                                    {isStepDone && currentStep !== index ? (
                                        <Entypo
                                            size={13}
                                            name="check"
                                            color="#FFFFFF"
                                        />
                                    ) : (
                                        <Text style={styles.dotNumber}>
                                            {index + 1}
                                        </Text>
                                    )}
                                    {/* <Text style={styles.dotNumber}>{index + 1}</Text> */}
                                </View>
                                <Text style={styles.labelStyle}>{label}</Text>
                                {index !== steps - 1 && (
                                    <View style={lineStyle} />
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                }),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [stepsDone, labels, currentStep]
        );

        return (
            <View style={styles.mainContainer}>
                <ScrollView
                    ref={ref}
                    horizontal
                    contentContainerStyle={styles.scrollContainer}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.container}>{dots}</View>
                </ScrollView>
            </View>
        );
    }
);

export default StepperIndicator;
