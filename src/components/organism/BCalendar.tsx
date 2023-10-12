import React from "react";
import { StyleSheet, View } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { resScale } from "@/utils";
import { colors, fonts } from "@/constants";

const styles = StyleSheet.create({
    arrowStyleRight: {
        position: "relative",
        right: resScale(-20)
    },
    arrowStyleLeft: {
        position: "relative",
        left: resScale(-20)
    }
});

interface BCalendarProps {
    onDayPress?: ((date: DateData) => void) | undefined;
    markedDates?: MarkedDates | undefined;
    onMonthChange?: ((date: DateData) => void) | undefined;
    isLoading?: boolean;
    minDate?: string;
}

function RenderArrow({ direction }: { direction: "left" | "right" }) {
    if (direction === "right") {
        return (
            <View style={styles.arrowStyleRight}>
                <Icon name="chevron-right" size={25} color={colors.black} />
            </View>
        );
    }

    return (
        <View style={styles.arrowStyleLeft}>
            <Icon name="chevron-left" size={25} color={colors.black} />
        </View>
    );
}

function BCalendar({
    onDayPress,
    markedDates,
    onMonthChange,
    isLoading,
    minDate
}: BCalendarProps) {
    LocaleConfig.locales.id = {
        monthNames: [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember"
        ],
        monthNamesShort: [
            "Jan",
            "Feb",
            "Mar",
            "April",
            "Mei",
            "Jun",
            "Jul",
            "Agus",
            "Sept",
            "Okt.",
            "Nov.",
            "Des."
        ],
        dayNames: [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu"
        ],
        dayNamesShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
        today: "Hari ini"
    };

    LocaleConfig.defaultLocale = "id";

    return (
        <Calendar
            theme={{
                arrowColor: colors.black,
                todayTextColor: colors.primary,
                selectedDayTextColor: colors.white,
                selectedDayBackgroundColor: colors.primary,
                dotColor: colors.primary,
                dayTextColor: colors.text.darker,
                textDayFontFamily: fonts.family.montserrat[400],
                textMonthFontFamily: fonts.family.montserrat[600],
                textDayHeaderFontFamily: fonts.family.montserrat[500]
            }}
            onDayPress={onDayPress}
            markedDates={markedDates}
            renderArrow={(direction) => <RenderArrow direction={direction} />}
            onMonthChange={onMonthChange}
            displayLoadingIndicator={isLoading}
            minDate={minDate}
        />
    );
}

export default BCalendar;
