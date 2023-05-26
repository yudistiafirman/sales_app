import crashlytics from "@react-native-firebase/crashlytics";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { BBackContinueBtn, BForm, BHeaderIcon, BSpacer } from "@/components";
import { colors, layout } from "@/constants";
import { INVOICE_FILTER } from "@/navigation/ScreenNames";
import { resScale } from "@/utils";
import { Input } from "@/interfaces";
import useCustomHeaderLeft from "@/hooks/useCustomHeaderLeft";
import { useNavigation } from "@react-navigation/native";
import { MarkedDates } from "react-native-calendars/src/types";

const styles = StyleSheet.create({
    flexFull: {
        flex: 1
    },
    main: {
        flex: 1,
        paddingHorizontal: layout.pad.lg
    },
    touchable: {
        position: "absolute",
        width: "100%",
        borderRadius: layout.radius.sm,
        height: resScale(45),
        zIndex: 2
    },
    button: {
        paddingBottom: layout.pad.lg
    }
});

function InvoiceFilter() {
    const navigation = useNavigation();
    const [checked, setChecked] = React.useState<string>("");
    const [selectedPaymentDuration, setSelectedPaymentDuration] =
        React.useState<string | number>("");
    const [selectedPaymentCondition, setSelectedPaymentCondition] =
        React.useState<string | number>("");
    const [selectedDueDateDifference, setSelectedDueDateDifference] =
        React.useState<string | number>("");
    const [isVisibleCalendar, setVisibleCalendar] =
        React.useState<boolean>(false);
    const [selectedMarkedDates, setSelectedMarkedDates] = React.useState<
        MarkedDates | undefined
    >({});

    const inputs: Input[] = React.useMemo(() => {
        const baseInput: Input[] = [
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
                    secondStatus:
                        checked === "second" ? "checked" : "unchecked",
                    onSetComboRadioButtonValue: (value) => {
                        setChecked(value);
                    }
                }
            },
            {
                label: "Jatuh Tempo (Hari)",
                isRequire: false,
                isError: false,
                type: "durationButton",
                durationButton: {
                    data: [
                        { id: "1", name: "3 Hari", value: 3 },
                        { id: "2", name: "7 Hari", value: 7 },
                        { id: "3", name: "14 Hari", value: 14 },
                        { id: "4", name: "30 Hari", value: 30 },
                        { id: "5", name: "45 Hari", value: 45 },
                        { id: "6", name: "60 Hari", value: 60 },
                        { id: "7", name: "90 Hari", value: 90 }
                    ],
                    onClick: (value) => {
                        setSelectedPaymentDuration(value);
                    },
                    value: selectedPaymentDuration
                }
            },
            {
                label: "Status Pembayaran",
                isRequire: false,
                isError: false,
                type: "durationButton",
                durationButton: {
                    data: [
                        {
                            id: "1",
                            name: "Invoice Dibuat",
                            value: "SUBMITTED"
                        },
                        {
                            id: "2",
                            name: "Invoice Dikirim",
                            value: "DELIVERED"
                        },
                        {
                            id: "3",
                            name: "Dibayar Sebagian",
                            value: "PARTIALLY PAID"
                        },
                        { id: "4", name: "Lunas", value: "PAID" },
                        { id: "5", name: "Batal", value: "CANCELLED" }
                    ],
                    onClick: (value) => {
                        setSelectedPaymentCondition(value);
                    },
                    value: selectedPaymentCondition
                }
            },
            {
                label: "Tanggal Tagih",
                isRequire: false,
                isError: false,
                type: "calendar-range",
                placeholder: "Pilih tanggal",
                customerErrorMsg: "Tanggal Tagih harus diisi",
                calendar: {
                    markedDates: selectedMarkedDates,
                    onDayPress: (value: any) => {
                        setSelectedMarkedDates(value);
                    },
                    isCalendarVisible: isVisibleCalendar,
                    setCalendarVisible: (flag: boolean) => {
                        setVisibleCalendar(flag);
                    }
                }
            },
            {
                label: "Lewat Jatuh Tempo (Hari)",
                isRequire: false,
                isError: false,
                type: "durationButton",
                durationButton: {
                    data: [
                        { id: "1", name: "3 Hari", value: 3 },
                        { id: "2", name: "7 Hari", value: 7 },
                        { id: "3", name: "14 Hari", value: 14 },
                        { id: "4", name: "30 Hari", value: 30 },
                        { id: "5", name: "45 Hari", value: 45 },
                        { id: "6", name: "60 Hari", value: 60 },
                        { id: "7", name: "90 Hari", value: 90 }
                    ],
                    onClick: (value) => {
                        setSelectedDueDateDifference(value);
                    },
                    value: selectedDueDateDifference
                }
            }
        ];
        return baseInput;
    }, [
        setSelectedMarkedDates,
        selectedMarkedDates,
        setVisibleCalendar,
        isVisibleCalendar
    ]);

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
        <SafeAreaView style={styles.main}>
            <ScrollView style={styles.flexFull}>
                <View style={styles.flexFull}>
                    <BForm titleBold="500" inputs={inputs} />
                    <BSpacer size="medium" />
                </View>
            </ScrollView>
            <View style={styles.button}>
                <BBackContinueBtn
                    onPressContinue={() => navigation.goBack()}
                    onPressBack={() => setChecked("")}
                    continueText="Terapkan"
                    backText="Hapus"
                    isContinueIcon={false}
                    unrenderBack={checked === ""}
                />
            </View>
        </SafeAreaView>
    );
}

export default InvoiceFilter;
