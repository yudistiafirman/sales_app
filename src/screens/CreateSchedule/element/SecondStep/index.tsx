import moment from "moment";
import * as React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import {
    BDepositCard,
    BDivider,
    BForm,
    BProductCard,
    BSpacer,
    BText
} from "@/components";
import { colors, fonts, layout } from "@/constants";
import {
    METHOD_LIST,
    METHOD_LIST_DEPRECATED,
    PO_METHOD_LIST
} from "@/constants/dropdown";
import { CreateScheduleContext } from "@/context/CreateScheduleContext";
import { Input } from "@/interfaces";
import { SalesOrdersData } from "@/interfaces/SelectConfirmedPO";

const style = StyleSheet.create({
    flexFull: {
        flex: 1
    },
    formInput: {
        flex: 1,
        width: "100%",
        padding: layout.pad.md
    },
    volContent: {
        flexDirection: "row",
        alignItems: "center"
    },
    consecutiveCheck: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    technicalCheck: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    selectionProduct: {
        flex: 1,
        alignItems: "center",
        borderRadius: layout.radius.md,
        backgroundColor: colors.tertiary,
        borderColor: colors.border.default,
        borderWidth: 1
    },
    contentProduct: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        flex: 1,
        marginTop: layout.pad.md
    },
    summary: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.sm
    },
    summaryContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    partText: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[600],
        fontSize: fonts.size.md
    }
});

export default function SecondStep() {
    const { values, action } = React.useContext(CreateScheduleContext);
    const { stepOne: stateOne, stepTwo: stateTwo } = values;
    const { updateValueOnstep } = action;
    const [selectedIndex, setSelectedIndex] = React.useState("0");
    const [isVisibleCalendar, setVisibleCalendar] = React.useState(false);
    const [isVisibleTimePicker, setVisibleTimePicker] = React.useState(false);
    const [rawTime, setRawTime] = React.useState(undefined);

    const inputs: Input[] = [
        {
            isRequire: true,
            type: "calendar-time",
            calendarTime: {
                onDayPress: (value: any) => {
                    const date = moment(value.dateString).format("DD/MM/yyyy");
                    onChange("deliveryDate")(date);
                },
                isCalendarVisible: isVisibleCalendar,
                setCalendarVisible: (flag: boolean) => {
                    setVisibleCalendar(flag);
                },
                onTimeChange: (value: any) => {
                    const time = moment(value)
                        // .utcOffset(value.getTimezoneOffset() / 60)
                        .format("HH:mm");
                    setRawTime(value);
                    onChange("deliveryTime")(time);
                },
                isTimeVisible: isVisibleTimePicker,
                setTimeVisible: (flag: boolean) => {
                    setVisibleTimePicker(flag);
                },
                labelOne: "Tanggal Pengiriman",
                labelTwo: "Jam Pengiriman",
                placeholderOne: "Pilih tanggal",
                placeholderTwo: "Pilih jam",
                errMsgOne: "Tanggal harus dipilih",
                errMsgTwo: "Jam harus dipilih",
                valueOne: stateTwo?.deliveryDate,
                valueTwo: stateTwo?.deliveryTime,
                valueTwoMock: rawTime,
                isErrorOne: !stateTwo?.deliveryDate,
                isErrorTwo: !stateTwo?.deliveryTime
            }
        },
        {
            label: "Metode penuangan",
            isRequire: true,
            type: "dropdown",
            value: stateTwo?.method,
            isError: stateTwo?.method === undefined,
            customerErrorMsg: "Metode penuangan harus dipilih",
            dropdown: {
                items: METHOD_LIST_DEPRECATED,
                placeholder: "Pilih metode penuangan",
                onChange: (value: any) => {
                    onChange("method")(value);
                }
            }
        }
    ];

    const inputsSelection: Input[] = [
        {
            label: "Volume",
            isRequire: true,
            type: "quantity",
            value: stateTwo?.inputtedVolume?.toString(),
            onChange: (value: any) => {
                if (value && value !== "") {
                    onChange("inputtedVolume")(parseInt(value, 10));
                } else {
                    onChange("inputtedVolume")(0);
                }
            }
            // customerErrorMsg:
            //   'Volume tidak boleh lebih besar dari sisa yang belum dikirim',
            // isError: stateTwo?.inputtedVolume > stateTwo?.salesOrder?.usedQuantity,
        }
    ];

    const consecutiveInputs: Input[] = [
        {
            label: "Konsekutif?",
            type: "checkbox",
            isRequire: false,
            checkbox: {
                value: stateTwo?.isConsecutive,
                onValueChange: (value) => {
                    onChange("isConsecutive")(value);
                }
            }
        }
    ];

    const technicalInputs: Input[] = [
        {
            label: "Request Teknisi?",
            type: "checkbox",
            isRequire: false,
            checkbox: {
                value: stateTwo?.hasTechnicalRequest,
                onValueChange: (value) => {
                    onChange("hasTechnicalRequest")(value);
                }
            }
        }
    ];

    const onChange = (key: any) => (val: any) => {
        updateValueOnstep("stepTwo", key, val);
    };

    const getTotalProduct = (): number => {
        const total =
            stateTwo?.inputtedVolume *
            stateTwo?.salesOrder?.PoProduct?.RequestedProduct?.offeringPrice;
        return total;
    };

    const getDisplayName = (salesOrder: SalesOrdersData) =>
        // BE bugs -> response category.`parent` should be `Parent`
        `${salesOrder.PoProduct?.RequestedProduct?.Product?.category?.Parent?.name} ${salesOrder.PoProduct?.RequestedProduct?.displayName} ${salesOrder.PoProduct?.RequestedProduct?.Product?.category?.name}`;
    return (
        <View style={style.container}>
            <ScrollView style={style.flexFull}>
                <BForm titleBold="500" inputs={inputs} spacer="extraSmall" />
                <View
                    style={[
                        style.summaryContainer,
                        Platform.OS !== "android" && { zIndex: -1 }
                    ]}
                >
                    <View style={style.consecutiveCheck}>
                        <BForm
                            titleBold="500"
                            inputs={consecutiveInputs}
                            spacer="extraSmall"
                        />
                    </View>
                    <View style={style.technicalCheck}>
                        <BForm
                            titleBold="500"
                            inputs={technicalInputs}
                            spacer="extraSmall"
                        />
                    </View>
                </View>
                <BSpacer size="extraSmall" />
                {stateOne?.purchaseOrders[0]?.SaleOrders &&
                    stateOne?.purchaseOrders[0]?.SaleOrders.length > 0 && (
                        <>
                            <Text style={style.partText}>Produk</Text>
                            <BSpacer size="verySmall" />
                            <View style={style.flexFull}>
                                <BDivider />
                                <BSpacer size="extraSmall" />
                                {stateOne?.purchaseOrders[0]?.SaleOrders.map(
                                    (item, index) => (
                                        <View
                                            key={index.toString()}
                                            style={style.flexFull}
                                        >
                                            <View
                                                style={style.selectionProduct}
                                            >
                                                <View
                                                    style={style.contentProduct}
                                                >
                                                    <RadioButton
                                                        value={index.toString()}
                                                        status={
                                                            selectedIndex ===
                                                            index.toString()
                                                                ? "checked"
                                                                : "unchecked"
                                                        }
                                                        color={colors.primary}
                                                        uncheckedColor={
                                                            colors.border
                                                                .altGrey
                                                        }
                                                        onPress={() => {
                                                            if (
                                                                selectedIndex !==
                                                                index.toString()
                                                            ) {
                                                                updateValueOnstep(
                                                                    "stepTwo",
                                                                    "inputtedVolume",
                                                                    0
                                                                );
                                                                updateValueOnstep(
                                                                    "stepTwo",
                                                                    "salesOrder",
                                                                    item
                                                                );
                                                            }
                                                            setSelectedIndex(
                                                                index.toString()
                                                            );
                                                        }}
                                                    />
                                                    <BProductCard
                                                        name={getDisplayName(
                                                            item
                                                        )}
                                                        pricePerVol={
                                                            item?.PoProduct
                                                                ?.RequestedProduct
                                                                ?.offeringPrice
                                                        }
                                                        volume={parseInt(
                                                            item?.usedQuantity,
                                                            10
                                                        )}
                                                        totalPrice={
                                                            item?.PoProduct
                                                                ?.RequestedProduct
                                                                ?.offeringPrice *
                                                            (item?.usedQuantity
                                                                ? item?.usedQuantity
                                                                : 0)
                                                        }
                                                        hideVolume
                                                        withoutBorder
                                                    />
                                                </View>
                                                {selectedIndex ===
                                                    index.toString() && (
                                                    <View
                                                        style={style.formInput}
                                                    >
                                                        <BForm
                                                            titleBold="500"
                                                            inputs={
                                                                inputsSelection
                                                            }
                                                            spacer="extraSmall"
                                                        />
                                                        {/* <View style={style.volContent}>
                              <BText>Sisa vol. yang belum dikirim</BText>
                              <BText
                                style={{
                                  marginStart: layout.pad.sm,
                                  fontFamily: fonts.family.montserrat[500],
                                }}
                              >
                                {item.usedQuantity
                                  ? item.usedQuantity + ' m³'
                                  : 0 + ' m³'}
                              </BText>
                            </View> */}
                                                    </View>
                                                )}
                                            </View>
                                            {stateOne?.purchaseOrders[0]
                                                ?.SaleOrders.length -
                                                1 !==
                                                index && (
                                                <BDivider
                                                    marginVertical={
                                                        layout.pad.md
                                                    }
                                                    borderColor={colors.white}
                                                />
                                            )}
                                        </View>
                                    )
                                )}
                            </View>
                        </>
                    )}
            </ScrollView>

            <View>
                <BSpacer size="extraSmall" />
                <BDivider />
                <BSpacer size="verySmall" />
                <BDepositCard
                    style={{ marginBottom: layout.pad.xl }}
                    firstSectionText="Deposit"
                    firstSectionValue={
                        stateTwo?.availableDeposit
                            ? stateTwo?.availableDeposit
                            : 0
                    }
                    secondSectionText={
                        stateTwo?.salesOrder
                            ? getDisplayName(stateTwo?.salesOrder)
                            : "-"
                    }
                    secondSectionValue={getTotalProduct()}
                    thirdSectionText="Est. Sisa Deposit"
                    isError={
                        getTotalProduct() >
                        (stateTwo?.availableDeposit
                            ? stateTwo?.availableDeposit
                            : 0)
                    }
                    customErrorMsg="Silakan lakukan penambahan deposit"
                />
            </View>
        </View>
    );
}
