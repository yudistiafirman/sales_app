import React from "react";
import { StyleSheet, View } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { resScale } from "@/utils";
import { colors } from "@/constants";
import moment from "moment";
import { daysInMonth } from "@/utils/generalFunc";

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

interface ICalendarRangeProps {
    day: number;
    month: number;
    year: number;
}

interface BCalendarRangeProps {
    onDayPress?: ((date: MarkedDates) => void) | undefined;
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
    const [selectedMarkedDates, setSelectedMarkedDates] =
        React.useState<MarkedDates>({});
    const [selectedCalendarRangeProps, setSelectedCalendarRangeProps] =
        React.useState<ICalendarRangeProps>({ day: 0, month: 0, year: 0 });
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

    const onDayPressCheck = onDayPress || null;
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
                let newMap: MarkedDates = {};
                newMap = { ...selectedMarkedDates };
                if (Object.keys(selectedMarkedDates).length === 0) {
                    newMap[value.dateString] = {
                        selected: true,
                        startingDay: true,
                        color: colors.primary,
                        selectedColor: colors.primary
                    };
                    setSelectedCalendarRangeProps({
                        day: value.day,
                        month: value.month,
                        year: value.year
                    });
                } else {
                    Object.keys(selectedMarkedDates).forEach((it) => {
                        if (selectedMarkedDates[it].startingDay === true) {
                            newMap[it] = {
                                ...selectedMarkedDates[it],
                                selected: true,
                                startingDay: true,
                                color: colors.primary,
                                selectedColor: colors.primary
                            };
                        } else {
                            newMap[value.dateString] = {
                                ...selectedMarkedDates[value.dateString],
                                selected: true,
                                startingDay: true,
                                color: colors.primary,
                                selectedColor: colors.primary
                            };
                        }

                        const diffMonths =
                            value.month - selectedCalendarRangeProps.month;
                        let diffDays = 0;
                        if (value.month > selectedCalendarRangeProps.month) {
                            let restDay = daysInMonth(
                                selectedCalendarRangeProps.month,
                                selectedCalendarRangeProps.year
                            );
                            restDay *= diffMonths;
                            const restDayInMonth =
                                restDay - selectedCalendarRangeProps.day;
                            diffDays = value.day + restDayInMonth;
                        } else {
                            diffDays =
                                value.day - selectedCalendarRangeProps.day;
                        }

                        for (let i = 1; i < diffDays; i += 1) {
                            const nextDay = moment(it)
                                .add(i, "days")
                                .format("YYYY-MM-DD");
                            newMap[nextDay] = {
                                ...selectedMarkedDates[nextDay],
                                selected: true,
                                color: colors.primary,
                                selectedColor: colors.primary
                            };
                        }

                        if (selectedMarkedDates[it].endingDay === true) {
                            newMap[it] = {
                                ...selectedMarkedDates[it],
                                selected: true,
                                endingDay: true,
                                color: colors.primary,
                                selectedColor: colors.primary
                            };
                        } else {
                            newMap[value.dateString] = {
                                ...selectedMarkedDates[value.dateString],
                                selected: true,
                                endingDay: true,
                                color: colors.primary,
                                selectedColor: colors.primary
                            };
                        }
                    });
                }
                setSelectedMarkedDates(newMap);
                return onDayPressCheck !== null && onDayPressCheck(newMap);
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
