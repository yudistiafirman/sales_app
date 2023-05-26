import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { resScale } from "@/utils";
import { colors } from "@/constants";

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

interface BCalendarRangeProps {
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

function BCalendarRange({
    onDayPress,
    markedDates,
    onMonthChange,
    isLoading,
    minDate
}: BCalendarRangeProps) {
    const [selectedMarkedDates, setSelectedMarkedDates] = React.useState<
        MarkedDates | undefined
    >({});
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
                dotColor: colors.white,
                dayTextColor: colors.text.darker,
                textDayFontFamily: "Montserrat-Regular",
                textMonthFontFamily: "Montserrat-SemiBold",
                textDayHeaderFontFamily: "Montserrat-Medium"
            }}
            onDayPress={(value) => {
                if (
                    selectedMarkedDates &&
                    Object.keys(selectedMarkedDates).length > 0
                ) {
                    selectedMarkedDates[value.dateString] = {
                        selected: true,
                        endingDay: true,
                        color: colors.primary,
                        selectedColor: colors.primary
                    };
                } else {
                    selectedMarkedDates[value.dateString] = {
                        selected: true,
                        startingDay: true,
                        color: colors.primary,
                        selectedColor: colors.primary
                    };
                }
                onDayPress(selectedMarkedDates);
            }}
            markedDates={markedDates || selectedMarkedDates}
            renderArrow={(direction) => <RenderArrow direction={direction} />}
            onMonthChange={onMonthChange}
            displayLoadingIndicator={isLoading}
            minDate={minDate}
            markingType="period"
        />
    );
}

export default BCalendarRange;
