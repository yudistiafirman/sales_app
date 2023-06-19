import crashlytics from "@react-native-firebase/crashlytics";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import moment, { locale } from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, DeviceEventEmitter } from "react-native";
import { DateData } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";
import { BButtonPrimary, BCalendar, BSpacer, BText } from "@/components";
import { colors, fonts, layout } from "@/constants";
import useHeaderTitleChanged from "@/hooks/useHeaderTitleChanged";
import { customerDataInterface, visitationListResponse } from "@/interfaces";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import { CALENDAR } from "@/navigation/ScreenNames";
import { openPopUp } from "@/redux/reducers/modalReducer";
import {
    setVisitationMapped,
    resetStates,
    setMarkedData
} from "@/redux/reducers/productivityFlowReducer";
import { RootState } from "@/redux/store";
import { DEFAULT_ESTIMATED_LIST_SIZE } from "@/constants/general";
import { getVisitations } from "@/actions/ProductivityActions";
import ExpandableCustomerCard from "./elements/ExpandableCustomerCard";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: layout.pad.lg,
        justifyContent: "space-between"
    },
    customerCard: {
        backgroundColor: colors.tertiary,
        padding: layout.pad.md,
        borderRadius: layout.radius.md
    },
    tanggalKunjunganText: {
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.md,
        color: colors.text.darker
    },
    dateText: {
        fontFamily: fonts.family.montserrat[600],
        fontSize: fonts.size.xl,
        color: colors.text.darker
    }
});

export default function CalendarScreen() {
    const route = useRoute<RootStackScreenProps>();
    const navigation = useNavigation();
    const useTodayMinDate = route.params?.useTodayMinDate;
    const dispatch = useDispatch();
    const { visitationCalendarMapped, markedDate, isVisitationLoading } =
        useSelector((state: RootState) => state.productivity);
    const { selectedBatchingPlant } = useSelector(
        (state: RootState) => state.auth
    );

    const [customerDatas, setCustomerDatas] = useState<customerDataInterface[]>(
        []
    );

    useHeaderTitleChanged({
        title: "Pilih Tanggal",
        selectedBP: selectedBatchingPlant,
        hideBPBadges: true
    });

    const fetchVisitation = useCallback(
        ({
            month,
            year,
            fullDate
        }: {
            month: number;
            year: number;
            fullDate: string;
        }) => {
            getVisitations({
                month,
                year,
                batchingPlantId: selectedBatchingPlant?.id
            })
                .then((response) => {
                    const visitationData = response?.data?.data || [];
                    const visitMapped = visitationData.reduce(
                        (
                            acc: { [key: string]: customerDataInterface[] },
                            obj: visitationListResponse
                        ) => {
                            const formatedDate = moment(obj.dateVisit).format(
                                "yyyy-MM-DD"
                            );

                            if (!acc[formatedDate]) {
                                acc[formatedDate] = [];
                            }
                            acc[formatedDate].push({
                                display_name: obj.project?.Company?.displayName,
                                name: obj.project?.name,
                                // location: obj.project.locationAddress.district,
                                email: obj.project?.Pic?.email,
                                phone: obj.project?.Pic?.phone,
                                position: obj.project?.Pic?.position,
                                type: obj.project?.Pic?.type,
                                picName: obj.project?.Pic?.name,
                                location: obj.project?.LocationAddress?.line1
                            });
                            return acc;
                        },
                        {}
                    );
                    dispatch(setVisitationMapped(visitMapped));
                    const newMarkedDate = { ...markedDate };
                    if (visitMapped)
                        Object.keys(visitMapped).forEach((date) => {
                            newMarkedDate[date] = {
                                ...newMarkedDate[date],
                                marked: true
                            };
                        });

                    newMarkedDate[fullDate] = {
                        ...newMarkedDate[fullDate],
                        selected: true
                    };

                    const custData = visitMapped[fullDate] || [];
                    setCustomerDatas(custData);
                    dispatch(setMarkedData(newMarkedDate));
                })
                .catch((error: any) => {
                    dispatch(
                        openPopUp({
                            popUpType: "error",
                            popUpText: `Error fetching calendar data${error}`,
                            highlightedText: "calendar data"
                        })
                    );
                });
        },
        [markedDate, dispatch]
    );

    useEffect(() => {
        crashlytics().log(CALENDAR);

        const today = moment();
        fetchVisitation({
            month: today.get("month") + 1,
            year: today.get("year"),
            fullDate: today.format("yyyy-MM-DD")
        });
        return () => {
            dispatch(resetStates());
        };
    }, []);

    const onDayPress = useCallback(
        (day: DateData) => {
            const custData = visitationCalendarMapped[day.dateString] || [];
            setCustomerDatas(custData);
            const newMarkedDate = { ...markedDate };
            if (newMarkedDate)
                Object.keys(newMarkedDate).forEach((date) => {
                    if (newMarkedDate[date].selected) {
                        newMarkedDate[date] = {
                            ...newMarkedDate[date],
                            selected: false
                        };
                    }
                });
            newMarkedDate[day.dateString] = {
                ...newMarkedDate[day.dateString],
                selected: true
            };
            dispatch(setMarkedData(newMarkedDate));
        },
        [markedDate, visitationCalendarMapped, dispatch]
    );

    const selectedData = useMemo(() => {
        let date = "-";
        let day = null;
        let selectedDate = null;
        if (markedDate)
            Object.keys(markedDate).forEach((key) => {
                if (markedDate[key].selected) {
                    try {
                        date = `${new Date(key).getDate()} ${new Date(
                            key
                        ).toLocaleString(locale(), {
                            month: "short"
                        })} ${new Date(key).getFullYear()}`;
                        const newDate = new Date(key);
                        day = newDate.toLocaleDateString(locale(), {
                            weekday: "long"
                        });
                    } catch (err) {
                        date = `${new Date(key).getDate()} ${new Date(
                            key
                        ).toLocaleString()} ${new Date(key).getFullYear()}`;
                        const newDate = new Date(key);
                        day = newDate.toLocaleDateString();
                    }

                    selectedDate = {
                        date: key,
                        prettyDate: date,
                        day
                    };
                }
            });

        return [day, date, selectedDate];
    }, [markedDate]);

    const onMonthPress = (dateData: DateData) => {
        setCustomerDatas([]);
        fetchVisitation({
            month: dateData.month,
            year: dateData.year,
            fullDate: dateData.dateString
        });
    };

    const separatorRender = () => <BSpacer size="extraSmall" />;

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, flexDirection: "row" }}>
                <FlashList
                    estimatedItemSize={DEFAULT_ESTIMATED_LIST_SIZE}
                    data={customerDatas}
                    ListHeaderComponent={
                        <View>
                            <BCalendar
                                onDayPress={onDayPress}
                                markedDates={markedDate}
                                onMonthChange={onMonthPress}
                                isLoading={isVisitationLoading}
                                minDate={
                                    useTodayMinDate
                                        ? new Date().toString()
                                        : undefined
                                }
                            />
                            <BSpacer size="small" />
                            <BText bold="300" color="darker">
                                {" Pelanggan yang Dikunjungi "}
                            </BText>
                            <BSpacer size="extraSmall" />
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: layout.pad.md }}
                    ItemSeparatorComponent={separatorRender}
                    renderItem={({ item }) => (
                        <ExpandableCustomerCard item={item} />
                    )}
                    keyExtractor={(_, index) => index.toString()}
                />
            </View>
            {selectedData ? (
                <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: colors.white,
                        padding: layout.pad.lg,
                        paddingTop: layout.pad.md
                    }}
                >
                    <View>
                        <Text style={styles.tanggalKunjunganText}>
                            Tanggal Kunjungan Berikutnya
                        </Text>
                        <Text style={styles.dateText}>
                            {selectedData[0] && `${selectedData[0]} ,`}{" "}
                            {selectedData[1]}
                        </Text>
                    </View>
                    <BSpacer size="extraSmall" />
                    <BButtonPrimary
                        title="Simpan"
                        onPress={() => {
                            DeviceEventEmitter.emit(
                                "CalendarScreen.selectedDate",
                                selectedData[2]
                            );
                            navigation.goBack();
                        }}
                        disable={!selectedData[0]}
                    />
                </View>
            ) : undefined}
        </View>
    );
}
