import React from "react";

import { Competitor, Input } from "@/interfaces";
import Modal from "react-native-modal";
import { Dimensions, StyleSheet, View } from "react-native";
import { colors, fonts, layout } from "@/constants";
import font from "@/constants/fonts";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { resScale } from "@/utils";
import { RadioButton } from "react-native-paper";
import BText from "../atoms/BText";
import BHeaderIcon from "../atoms/BHeaderIcon";
import BForm from "../organism/BForm";
import BButtonPrimary from "../atoms/BButtonPrimary";
import BSpacer from "../atoms/BSpacer";
import BDivider from "../atoms/BDivider";
import BLabel from "../atoms/BLabel";

const { height, width } = Dimensions.get("window");
interface IProps {
    addCompetitor: any;
    onClose: () => void;
    isVisible: boolean;
}

const initialState = {
    name: "",
    mou: "",
    exclusive: "",
    problem: "",
    hope: ""
};

function BSheetAddCompetitor({ addCompetitor, isVisible, onClose }: IProps) {
    const [state, setState] = React.useState<Competitor>(initialState);

    const onChange = (key: keyof Competitor) => (text: string) => {
        setState({
            ...state,
            [key]: text
        });
    };

    const inputs: Input[] = [
        {
            label: "Nama Pesaing / Kompetisi",
            isRequire: true,
            isError: false,
            type: "textInput",
            placeholder: "Nama pesaing",
            onChange: (event) => {
                onChange("name")(event.nativeEvent.text);
            },
            value: state.name
        }
    ];

    const inputsTwo: Input[] = [
        {
            label: "Apakah ada masalah yang ditemukan dari supplier beton sekarang?",
            isRequire: false,
            isError: false,
            type: "area",
            placeholder: "Tulis masalah yang Anda temui",
            onChange: (val) => {
                onChange("problem")(val);
            },
            value: state.problem
        },
        {
            label: "Harapan apa yang diinginkan dari BRIK?",
            isRequire: false,
            isError: false,
            type: "area",
            placeholder: "Tulis harapan Anda",
            onChange: (val) => {
                onChange("hope")(val);
            },
            value: state.hope
        }
    ];

    const onAdd = () => {
        onClose();
        addCompetitor(state);
        setState(initialState);
    };

    const buttonStateDisabled = (): boolean => {
        if (state.name !== "" && state.mou !== "" && state.exclusive !== "") {
            return false;
        }
        return true;
    };

    const onCloseModal = () => {
        setState(initialState);
        onClose();
    };

    return (
        <Modal
            deviceHeight={height}
            isVisible={isVisible}
            style={styles.modalContainer}
        >
            <View style={styles.contentWrapper}>
                <KeyboardAwareScrollView>
                    <View
                        style={[
                            styles.contentOuterContainer,
                            { height: width + resScale(220) }
                        ]}
                    >
                        <View style={styles.contentInnerContainer}>
                            <View style={styles.headerContainer}>
                                <BText style={styles.headerTitle}>
                                    Tambah Kompetitor Baru
                                </BText>
                                <BHeaderIcon
                                    onBack={onCloseModal}
                                    size={layout.pad.lg}
                                    marginRight={0}
                                    iconName="x"
                                />
                            </View>
                            <View>
                                <BSpacer size="verySmall" />
                                <BDivider />
                                <BSpacer size="small" />
                                <BForm titleBold="500" inputs={inputs} />
                                <BLabel
                                    isRequired
                                    bold="500"
                                    label="Apakah sudah memiliki PKS / MOU?"
                                />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <RadioButton
                                            value="Iya"
                                            status={
                                                state.mou?.toLowerCase() ===
                                                "iya"
                                                    ? "checked"
                                                    : "unchecked"
                                            }
                                            color={colors.primary}
                                            uncheckedColor={
                                                colors.border.altGrey
                                            }
                                            onPress={() =>
                                                onChange("mou")("Iya")
                                            }
                                        />
                                        <BText>Iya</BText>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginStart: layout.pad.xxl
                                        }}
                                    >
                                        <RadioButton
                                            value="Tidak"
                                            status={
                                                state.mou?.toLowerCase() ===
                                                "tidak"
                                                    ? "checked"
                                                    : "unchecked"
                                            }
                                            color={colors.primary}
                                            uncheckedColor={
                                                colors.border.altGrey
                                            }
                                            onPress={() =>
                                                onChange("mou")("Tidak")
                                            }
                                        />
                                        <BText>Tidak</BText>
                                    </View>
                                </View>
                                <BSpacer size="extraSmall" />
                                <BLabel
                                    isRequired
                                    bold="500"
                                    label="Apakah PKS-nya Ekslusif?"
                                />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <RadioButton
                                            value="Iya"
                                            status={
                                                state.exclusive?.toLowerCase() ===
                                                "iya"
                                                    ? "checked"
                                                    : "unchecked"
                                            }
                                            color={colors.primary}
                                            uncheckedColor={
                                                colors.border.altGrey
                                            }
                                            onPress={() =>
                                                onChange("exclusive")("Iya")
                                            }
                                        />
                                        <BText>Iya</BText>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginStart: layout.pad.xxl
                                        }}
                                    >
                                        <RadioButton
                                            value="Tidak"
                                            status={
                                                state.exclusive?.toLowerCase() ===
                                                "tidak"
                                                    ? "checked"
                                                    : "unchecked"
                                            }
                                            color={colors.primary}
                                            uncheckedColor={
                                                colors.border.altGrey
                                            }
                                            onPress={() =>
                                                onChange("exclusive")("Tidak")
                                            }
                                        />
                                        <BText>Tidak</BText>
                                    </View>
                                </View>
                                <BSpacer size="extraSmall" />
                                <BForm titleBold="500" inputs={inputsTwo} />
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <View style={styles.buttonWrapper}>
                    <BButtonPrimary
                        disable={buttonStateDisabled()}
                        onPress={onAdd}
                        title="Tambah Kompetitor"
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: { margin: 0, justifyContent: "flex-end" },
    contentWrapper: { justifyContent: "flex-end" },
    contentOuterContainer: {
        backgroundColor: colors.white,
        borderTopStartRadius: layout.radius.lg,
        borderTopEndRadius: layout.radius.lg
    },
    contentInnerContainer: { flex: 1, marginHorizontal: layout.pad.lg },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: layout.pad.xl + layout.pad.lg
    },
    headerTitle: {
        fontFamily: font.family.montserrat[700],
        fontSize: font.size.lg
    },
    buttonWrapper: {
        width: "100%",
        position: "absolute",
        bottom: 10,
        paddingHorizontal: layout.pad.lg
    },
    leftIconStyle: {
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.md,
        color: colors.textInput.input
    }
});

export default BSheetAddCompetitor;
