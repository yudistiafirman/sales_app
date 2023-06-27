import crashlytics from "@react-native-firebase/crashlytics";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { BBackContinueBtn, BForm, BHeaderIcon, BSpacer } from "@/components";
import { layout } from "@/constants";
import { INVOICE_FILTER } from "@/navigation/ScreenNames";
import { resScale } from "@/utils";
import { Input } from "@/interfaces";
import useCustomHeaderLeft from "@/hooks/useCustomHeaderLeft";
import { useNavigation } from "@react-navigation/native";
import { MarkedDates } from "react-native-calendars/src/types";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
    setDueDateDifference,
    setInvoceData,
    setInvoiceSearchQuery,
    setIssueDate,
    setLoading,
    setMarkedDates,
    setPage,
    setPaymentDuration,
    setPaymentMethod,
    setPaymentStatus
} from "@/redux/reducers/invoiceReducer";

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
    const invoiceData = useSelector((state: RootState) => state.invoice);
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const [isVisibleCalendar, setVisibleCalendar] =
        React.useState<boolean>(false);

    const inputs: Input[] = [
        {
            label: "Metode Pembayaran",
            isRequire: false,
            type: "comboRadioButton",
            comboRadioBtn: {
                firstText: "Pembayaran Kredit",
                secondText: "Pembayaran Cash",
                firstValue: "CREDIT",
                secondValue: "CBD",
                isHorizontal: true,
                firstStatus:
                    invoiceData?.filter?.paymentMethod === "CREDIT"
                        ? "checked"
                        : "unchecked",
                secondStatus:
                    invoiceData?.filter?.paymentMethod === "CBD"
                        ? "checked"
                        : "unchecked",
                onSetComboRadioButtonValue: (value) => {
                    dispatch(setPaymentMethod(value));
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
                    dispatch(setPaymentDuration(value));
                },
                value: invoiceData?.filter?.paymentDuration
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
                    dispatch(setPaymentStatus(value));
                },
                value: invoiceData?.filter?.paymentStatus
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
                markedDates: invoiceData?.filter?.markedDates,
                onDayPress: (value: MarkedDates) => {
                    dispatch(setMarkedDates(value));
                    let startingDay;
                    let endingDay;
                    Object?.keys(value)?.forEach((it) => {
                        if (value[it]?.startingDay === true) {
                            startingDay = moment(it)?.valueOf()?.toString();
                        }
                        if (value[it]?.endingDay === true) {
                            endingDay = moment(it)?.valueOf()?.toString();
                        }
                    });
                    if (startingDay && endingDay)
                        dispatch(
                            setIssueDate({
                                startDateIssued: startingDay,
                                endDateIssued: endingDay
                            })
                        );
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
                    dispatch(setDueDateDifference(value));
                },
                value: invoiceData?.filter?.dueDateDifference
            }
        }
    ];

    const onClear = () => {
        dispatch(setPaymentMethod(""));
        dispatch(setPaymentDuration(0));
        dispatch(setPaymentStatus(""));
        dispatch(
            setIssueDate({
                startDateIssued: "",
                endDateIssued: ""
            })
        );
        dispatch(setDueDateDifference(""));
        dispatch(setMarkedDates({}));
    };

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

    const getButtonState = () => {
        let hide = true;
        if (invoiceData?.filter?.paymentMethod !== "") hide = false;
        if (
            invoiceData?.filter?.paymentDuration &&
            parseInt(invoiceData?.filter?.paymentDuration?.toString(), 10) > 0
        )
            hide = false;
        if (invoiceData?.filter?.paymentStatus !== "") hide = false;
        if (
            invoiceData?.filter?.startDateIssued !== "" &&
            invoiceData?.filter?.endDateIssued !== ""
        )
            hide = false;
        if (
            invoiceData?.filter?.dueDateDifference &&
            parseInt(invoiceData?.filter?.dueDateDifference?.toString(), 10) > 0
        )
            hide = false;

        return hide;
    };

    const onSubmit = () => {
        dispatch(setLoading({ isLoading: true }));
        dispatch(setInvoceData({ data: [] }));
        dispatch(setPage({ page: 1 }));
        dispatch(setInvoiceSearchQuery({ queryValue: "" }));
        navigation.goBack();
    };

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
                    onPressContinue={() => onSubmit()}
                    onPressBack={() => onClear()}
                    continueText="Terapkan"
                    backText="Hapus"
                    isContinueIcon={false}
                    unrenderBack={getButtonState()}
                />
            </View>
        </SafeAreaView>
    );
}

export default InvoiceFilter;
