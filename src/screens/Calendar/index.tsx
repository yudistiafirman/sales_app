import { View, Text, StyleSheet, DeviceEventEmitter } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DateData } from 'react-native-calendars';
import { colors, fonts, layout } from '@/constants';
import { BButtonPrimary, BCalendar, BSpacer, BText } from '@/components';
import ExpandableCustomerCard from './elements/ExpandableCustomerCard';
import moment, { locale } from 'moment';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getVisitationsList } from '@/redux/async-thunks/productivityFlowThunks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { customerDataInterface, visitationListResponse } from '@/interfaces';
import {
  setVisitationMapped,
  resetStates,
  setMarkedData,
} from '@/redux/reducers/productivityFlowReducer';
import { openPopUp } from '@/redux/reducers/modalReducer';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { CALENDAR } from '@/navigation/ScreenNames';
// // import crashlytics from '@react-native-firebase/crashlytics';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { FlashList } from '@shopify/flash-list';

export default function CalendarScreen() {
  const route = useRoute<RootStackScreenProps>();
  const navigation = useNavigation();
  const useTodayMinDate = route.params?.useTodayMinDate;
  const dispatch = useDispatch();
  const { visitationCalendarMapped, markedDate, isVisitationLoading } =
    useSelector((state: RootState) => state.productivity);

  const [customerDatas, setCustomerDatas] = useState<customerDataInterface[]>(
    []
  );
  useHeaderTitleChanged({ title: 'Pilih Tanggal' });
  useEffect(() => {
    // // crashlytics().log(CALENDAR);

    const today = moment();
    fetchVisitation({
      month: today.get('month') + 1,
      year: today.get('year'),
      fullDate: today.format('yyyy-MM-DD'),
    });
    return () => {
      dispatch(resetStates());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVisitation = useCallback(
    ({
      month,
      year,
      fullDate,
    }: {
      month: number;
      year: number;
      fullDate: string;
    }) => {
      dispatch(getVisitationsList({ month, year }))
        .unwrap()
        .then((data: visitationListResponse[]) => {
          const visitationData = data ? data : [];
          const visitMapped = visitationData.reduce(
            (
              acc: { [key: string]: customerDataInterface[] },
              obj: visitationListResponse
            ) => {
              const formatedDate = moment(obj.dateVisit).format('yyyy-MM-DD');

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
                location: obj.project?.LocationAddress?.line1,
              });
              return acc;
            },
            {}
          );
          dispatch(setVisitationMapped(visitMapped));
          const newMarkedDate = { ...markedDate };
          Object.keys(visitMapped).forEach((date) => {
            newMarkedDate[date] = {
              ...newMarkedDate[date],
              marked: true,
            };
          });

          newMarkedDate[fullDate] = {
            ...newMarkedDate[fullDate],
            selected: true,
          };

          const custData = visitMapped[fullDate] || [];
          setCustomerDatas(custData);
          dispatch(setMarkedData(newMarkedDate));
        })
        .catch((error: any) => {
          dispatch(
            openPopUp({
              popUpType: 'error',
              popUpText: 'Error fetching calendar data' + error,
              highlightedText: 'calendar data',
            })
          );
        });
    },
    [markedDate, dispatch]
  );

  const onDayPress = useCallback(
    (day: DateData) => {
      const custData = visitationCalendarMapped[day.dateString] || [];
      setCustomerDatas(custData);
      const newMarkedDate = { ...markedDate };
      for (const date of Object.keys(newMarkedDate)) {
        // if (newMarkedDate[date].selected && newMarkedDate[date].marked) {
        //   newMarkedDate[date].selected = false;
        // }

        if (newMarkedDate[date].selected) {
          newMarkedDate[date] = {
            ...newMarkedDate[date],
            selected: false,
          };
        }
      }
      newMarkedDate[day.dateString] = {
        ...newMarkedDate[day.dateString],
        selected: true,
      };
      dispatch(setMarkedData(newMarkedDate));
    },
    [markedDate, visitationCalendarMapped, dispatch]
  );

  const selectedData = useMemo(() => {
    let date = '-';
    let day = null;
    let selectedDate = null;
    Object.keys(markedDate).forEach((key) => {
      if (markedDate[key].selected) {
        try {
          date = `${new Date(key).getDate()} ${new Date(key).toLocaleString(
            locale(),
            { month: 'short' }
          )} ${new Date(key).getFullYear()}`;
          let newDate = new Date(key);
          day = newDate.toLocaleDateString(locale(), { weekday: 'long' });
        } catch (err) {
          date = `${new Date(key).getDate()} ${new Date(
            key
          ).toLocaleString()} ${new Date(key).getFullYear()}`;
          let newDate = new Date(key);
          day = newDate.toLocaleDateString();
        }

        selectedDate = {
          date: key,
          prettyDate: date,
          day,
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
      fullDate: dateData.dateString,
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <FlashList
          estimatedItemSize={10}
          data={customerDatas}
          ListHeaderComponent={
            <View>
              <BCalendar
                onDayPress={onDayPress}
                markedDates={markedDate}
                onMonthChange={onMonthPress}
                isLoading={isVisitationLoading}
                minDate={useTodayMinDate ? new Date().toString() : undefined}
              />
              <BSpacer size="small" />
              <BText bold="300" color="darker">
                {' Pelanggan yang Dikunjungi '}
              </BText>
              <BSpacer size="extraSmall" />
            </View>
          }
          contentContainerStyle={{ paddingBottom: layout.pad.md }}
          ItemSeparatorComponent={() => <BSpacer size={'extraSmall'} />}
          renderItem={({ item }) => <ExpandableCustomerCard item={item} />}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
      {selectedData ? (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.white,
            padding: layout.pad.lg,
            paddingTop: layout.pad.md,
          }}
        >
          <View>
            <Text style={styles.tanggalKunjunganText}>
              Tanggal Kunjungan Berikutnya
            </Text>
            <Text style={styles.dateText}>
              {selectedData[0] && `${selectedData[0]} ,`} {selectedData[1]}
            </Text>
          </View>
          <BSpacer size={'extraSmall'} />
          <BButtonPrimary
            title="Simpan"
            onPress={() => {
              DeviceEventEmitter.emit(
                'CalendarScreen.selectedDate',
                selectedData[2]
              );
              navigation.goBack();
            }}
            disable={!selectedData[0]}
          />
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: layout.pad.lg,
    justifyContent: 'space-between',
  },
  customerCard: {
    backgroundColor: colors.tertiary,
    padding: layout.pad.md,
    borderRadius: layout.radius.md,
  },
  tanggalKunjunganText: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
    color: colors.text.darker,
  },
  dateText: {
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.xl,
    color: colors.text.darker,
  },
});
