import { useNavigation } from "@react-navigation/native";
import moment, { locale } from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { getVisitationOrderByID } from "@/actions/OrderActions";
import { BChip, BSpacer, BText, BTouchableText } from "@/components";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import { TRANSACTION_DETAIL } from "@/navigation/ScreenNames";
import { openPopUp } from "@/redux/reducers/modalReducer";
import { AppDispatch } from "@/redux/store";

const styles = StyleSheet.create({
    container: {
        marginLeft: layout.pad.lg,
        marginRight: layout.pad.md
    },
    dateAndStatus: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    date: {
        fontFamily: font.family.montserrat[500],
        fontSize: font.size.md,
        color: colors.text.darker
    },
    status: {
        fontFamily: font.family.montserrat[500],
        fontSize: font.size.md
    },
    touchableText: {
        marginRight: layout.pad.md,
        fontFamily: font.family.montserrat[500],
        fontSize: font.size.md,
        color: colors.primary
    }
});

type Status = "VISIT" | "SPH" | "REJECTED" | "PO" | "SCHEDULING" | "DO";

interface IProps {
    bookingDate?: string;
    finishDate: string | null;
    status?: Status;
    rejectCategory: string | null;
    quatationId?: string | null;
    rejectNotes?: string;
}

function VisitationDatesAndStatus({
    bookingDate,
    finishDate,
    status,
    rejectCategory,
    quatationId,
    rejectNotes
}: IProps) {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const getBackgroundColor = () => {
        let color = "";
        if (status === "VISIT") {
            color = colors.textInput.inActive;
        } else if (status === "SPH") {
            color = colors.status.secondaryYellow;
        } else {
            color = colors.primary;
        }
        return color;
    };

    const getStatus = () => {
        if (status === "VISIT") {
            return "Kunjungan Lagi";
        }
        if (status === "REJECTED") {
            return "Closed Lost";
        }
        return "SPH";
    };

    const getLocalBookingDate = () => {
        let date = "-";
        let day = null;
        try {
            date = `${new Date(bookingDate).getDate()} ${new Date(
                bookingDate
            ).toLocaleString(locale(), {
                month: "short"
            })} ${new Date(bookingDate).getFullYear()}`;
            const newDate = new Date(bookingDate);
            day = newDate?.toLocaleDateString(locale(), { weekday: "long" });
        } catch (e) {
            console.log(e);
        }
        return `${day}, ${date}`;
    };

    const getLocalFinishDate = () => {
        let date = "-";
        date = `${new Date(finishDate).getDate()} ${new Date(
            finishDate
        ).toLocaleString(locale(), {
            month: "short"
        })} ${new Date(finishDate).getFullYear()}`;
        return date;
    };

    const getRejectedCategory = (reason: string) => {
        let rejectReason = "";
        if (reason === "MOU_COMPETITOR") {
            rejectReason = "Sudah MOU dengan Kompetitor";
        } else if (reason === "FINISHED") {
            rejectReason = "Proyek sudah selesai dibangun";
        }
        return rejectReason;
    };

    const getOneOrder = async () => {
        try {
            const { data } = await getVisitationOrderByID(quatationId);
            navigation.navigate(TRANSACTION_DETAIL, {
                title: data?.data ? data?.data?.number : "N/A",
                data: data?.data,
                type: "SPH"
            });
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText: error?.message,
                    highlightedText: "error",
                    outsideClickClosePopUp: true
                })
            );
        }
    };

    const renderCompBaseOnStatus = () => {
        if (status === "VISIT") {
            return (
                <BText style={[styles.date, { marginRight: layout.pad.md }]}>
                    {finishDate !== null
                        ? getLocalFinishDate()
                        : "Belum Selesai"}
                </BText>
            );
        }
        if (status === "SPH" && quatationId !== undefined) {
            return (
                <BTouchableText
                    onPress={getOneOrder}
                    textStyle={styles.touchableText}
                    title="Lihat SPH"
                />
            );
        }
        return (
            <BText style={[styles.date, { marginRight: layout.pad.md }]}>
                {rejectCategory !== null && getRejectedCategory(rejectCategory)}
            </BText>
        );
    };
    return (
        <View style={styles.container}>
            <View style={styles.dateAndStatus}>
                <BText style={styles.date}>{getLocalBookingDate()}</BText>
                <BChip backgroundColor={getBackgroundColor()}>
                    <BText
                        style={[
                            styles.status,
                            {
                                color:
                                    status === "REJECTED"
                                        ? colors.white
                                        : colors.text.darker
                            }
                        ]}
                    >
                        {getStatus()}
                    </BText>
                </BChip>
            </View>
            <BSpacer size="extraSmall" />
            <View style={styles.dateAndStatus}>
                <>
                    <BText style={[styles.date, { fontSize: font.size.sm }]}>
                        {moment(bookingDate).format("HH:mm")}
                    </BText>
                    {renderCompBaseOnStatus()}
                </>
            </View>
            {status === "REJECTED" && (
                <>
                    <BSpacer size="medium" />
                    <BText bold="600" sizeInNumber={font.size.md}>
                        Alasan
                    </BText>
                    <BText bold="400">{rejectNotes || "-"}</BText>
                </>
            )}
        </View>
    );
}

export default VisitationDatesAndStatus;
