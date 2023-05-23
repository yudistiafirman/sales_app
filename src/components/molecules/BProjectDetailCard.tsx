import { View, Text, StyleSheet } from "react-native";
import * as React from "react";
import { colors, fonts, layout } from "@/constants";
import { getColorStatusTrx, getStatusTrx } from "@/utils/generalFunc";
import BSpacer from "../atoms/BSpacer";
import BTouchableText from "../atoms/BTouchableText";
import formatCurrency from "@/utils/formatCurrency";
import { Input } from "@/interfaces";
import BForm from "../organism/BForm";

type BProjectDetailCardType = {
    status?: string;
    paymentMethod?: string;
    expiredDate?: string;
    projectName?: string;
    productionTime?: string;
    quotation?: any;
    nominal?: number;
    paymentDate?: string;
    deliveryDate?: string;
    deliveryTime?: string;
    scheduleMethod?: string;
    useBEStatus?: boolean;
    tmNumber?: string;
    driverName?: string;
    deliveredQty?: string;
    consecutive?: boolean;
    technical?: boolean;
    gotoSPHPage?: () => void;
};

export default function BProjectDetailCard({
    status,
    paymentMethod,
    expiredDate,
    projectName,
    productionTime,
    quotation,
    nominal,
    paymentDate,
    deliveryDate,
    deliveryTime,
    scheduleMethod,
    tmNumber,
    driverName,
    deliveredQty,
    consecutive,
    technical,
    useBEStatus = false,
    gotoSPHPage
}: BProjectDetailCardType) {
    const statusFinal = useBEStatus ? status : getStatusTrx(status);
    const { color, textColor } = getColorStatusTrx(statusFinal);

    const consecutiveInputs: Input[] = [
        {
            label: "",
            type: "checkbox",
            isRequire: false,
            checkbox: {
                value: consecutive,
                onValueChange: () => {},
                disabled: true
            }
        }
    ];

    const technicalInputs: Input[] = [
        {
            label: "",
            type: "checkbox",
            isRequire: false,
            checkbox: {
                value: technical,
                onValueChange: () => {},
                disabled: true
            }
        }
    ];

    return (
        <View>
            <View style={styles.summaryContainer}>
                <Text style={styles.summary}>Status</Text>
                <View style={[styles.chip, { backgroundColor: color }]}>
                    <Text
                        style={[
                            styles.summary,
                            styles.fontw400,
                            { color: textColor }
                        ]}
                    >
                        {statusFinal}
                    </Text>
                </View>
            </View>
            {quotation && (
                <>
                    <BSpacer size={"extraSmall"} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>SPH</Text>
                        <BTouchableText
                            textStyle={[styles.summaryBtn, styles.fontw400]}
                            onPress={gotoSPHPage}
                            title="Lihat SPH"
                        />
                    </View>
                </>
            )}
            {paymentMethod && (
                <>
                    <BSpacer size={"extraSmall"} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>Metode Pembayaran</Text>
                        <Text style={[styles.summary, styles.fontw400]}>
                            {paymentMethod}
                        </Text>
                    </View>
                </>
            )}
            {expiredDate !== "-" && (
                <>
                    <BSpacer size={"extraSmall"} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>Expired</Text>
                        <Text style={[styles.summary, styles.fontw400]}>
                            {expiredDate}
                        </Text>
                    </View>
                </>
            )}
            {projectName && (
                <>
                    <BSpacer size={"extraSmall"} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>Nama Proyek</Text>
                        <Text style={[styles.summary, styles.fontw400]}>
                            {projectName}
                        </Text>
                    </View>
                </>
            )}
            {paymentDate && (
                <>
                    <BSpacer size={"extraSmall"} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>Tanggal Bayar</Text>
                        <Text style={[styles.summary, styles.fontw400]}>
                            {paymentDate}
                        </Text>
                    </View>
                </>
            )}
            {nominal && (
                <>
                    <BSpacer size={"extraSmall"} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>Nominal</Text>
                        <Text style={[styles.summary, styles.fontw400]}>
                            {"IDR " + formatCurrency(nominal)}
                        </Text>
                    </View>
                </>
            )}
            {deliveryDate && (
                <>
                    <BSpacer size={"extraSmall"} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>Tanggal Pengiriman</Text>
                        <Text style={[styles.summary, styles.fontw400]}>
                            {deliveryDate}
                        </Text>
                    </View>
                </>
            )}
            {deliveredQty !== undefined && (
                <>
                    <BSpacer size={"extraSmall"} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>Quantity Terkirim</Text>
                        <Text style={[styles.summary, styles.fontw400]}>
                            {deliveredQty + " m³"}
                        </Text>
                    </View>
                </>
            )}
            {deliveryTime && (
                <>
                    <BSpacer size={"extraSmall"} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>Jam Pengiriman</Text>
                        <Text style={[styles.summary, styles.fontw400]}>
                            {deliveryTime}
                        </Text>
                    </View>
                </>
            )}
            {scheduleMethod && (
                <>
                    <BSpacer size={"extraSmall"} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>Metode Penuangan</Text>
                        <Text style={[styles.summary, styles.fontw400]}>
                            {scheduleMethod}
                        </Text>
                    </View>
                </>
            )}
            {tmNumber && (
                <>
                    <BSpacer size={"extraSmall"} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>Nomor TM</Text>
                        <Text style={[styles.summary, styles.fontw400]}>
                            {tmNumber}
                        </Text>
                    </View>
                </>
            )}
            {driverName && (
                <>
                    <BSpacer size={"extraSmall"} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>Nama Sopir</Text>
                        <Text style={[styles.summary, styles.fontw400]}>
                            {driverName}
                        </Text>
                    </View>
                </>
            )}
            {consecutive !== undefined && (
                <>
                    <BSpacer size={"verySmall"} />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>Konsekutif</Text>
                        <BForm
                            titleBold="500"
                            inputs={consecutiveInputs}
                            spacer="none"
                        />
                    </View>
                </>
            )}
            {technical !== undefined && (
                <>
                    {/* <BSpacer size={'extraSmall'} /> */}
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summary}>Request Teknisi</Text>
                        <BForm
                            titleBold="500"
                            inputs={technicalInputs}
                            spacer="none"
                        />
                    </View>
                </>
            )}
            <BSpacer size={"extraSmall"} />
            <View style={styles.summaryContainer}>
                <Text style={styles.summary}>Waktu Pembuatan</Text>
                <Text style={[styles.summary, styles.fontw400]}>
                    {productionTime}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    summary: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[300],
        fontSize: fonts.size.sm
    },
    summaryBtn: {
        color: colors.primary,
        fontFamily: fonts.family.montserrat[300],
        fontSize: fonts.size.sm
    },
    fontw400: {
        fontFamily: fonts.family.montserrat[400]
    },
    summaryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    chip: {
        paddingVertical: layout.pad.xs,
        paddingHorizontal: layout.pad.md,
        borderRadius: layout.radius.xl
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
    }
});
