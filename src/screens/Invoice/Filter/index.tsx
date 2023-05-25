import crashlytics from "@react-native-firebase/crashlytics";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { BForm, BHeaderIcon } from "@/components";
import { layout } from "@/constants";
import { INVOICE_FILTER } from "@/navigation/ScreenNames";
import { resScale } from "@/utils";
import { Input } from "@/interfaces";
import useCustomHeaderLeft from "@/hooks/useCustomHeaderLeft";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
    flexFull: {
        flex: 1,
        paddingHorizontal: layout.pad.lg
    },
    touchable: {
        position: "absolute",
        width: "100%",
        borderRadius: layout.radius.sm,
        height: resScale(45),
        zIndex: 2
    }
});

function InvoiceFilter() {
    const navigation = useNavigation();
    const [checked, setChecked] = React.useState<string>("");

    const inputs: Input[] = [
        {
            label: "Metode Pembayaran",
            isRequire: false,
            type: "comboRadioButton",
            comboRadioBtn: {
                firstText: "Pembayaran Credit",
                secondText: "Pembayaran Cash",
                firstValue: "first",
                secondValue: "second",
                isHorizontal: true,
                firstStatus: checked === "first" ? "checked" : "unchecked",
                secondStatus: checked === "second" ? "checked" : "unchecked",
                onSetComboRadioButtonValue: (value) => {
                    setChecked(value);
                }
            }
        },
        {
            label: "Jatuh Tempo (Hari)",
            isRequire: false,
            isError: false,
            type: "textInput",
            onChange: (val) => {}
        },
        {
            label: "Syarat Pembayaran",
            isRequire: false,
            isError: false,
            type: "textInput",
            onChange: (val) => {}
        },
        {
            label: "Tanggal Tagih",
            isRequire: false,
            isError: false,
            type: "textInput",
            onChange: (val) => {}
        },
        {
            label: "Lewat Jatuh Tempo (Hari)",
            isRequire: false,
            isError: false,
            type: "textInput",
            onChange: (val) => {}
        }
    ];

    useCustomHeaderLeft({
        customHeaderLeft: (
            <BHeaderIcon
                size={resScale(23)}
                onBack={() => navigation.goBack()}
                iconName="x"
            />
        )
    });

    React.useEffect(() => {
        crashlytics().log(INVOICE_FILTER);
    }, []);

    return (
        <SafeAreaView style={styles.flexFull}>
            <BForm titleBold="500" inputs={inputs} />
        </SafeAreaView>
    );
}

export default InvoiceFilter;
