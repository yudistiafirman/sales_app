import {
  View,
  Text,
  StyleSheet,
  FlatList,
  DeviceEventEmitter,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DateData } from 'react-native-calendars';
import { colors, fonts, layout } from '@/constants';
import { BButtonPrimary, BCalendar, BSpacer, BText } from '@/components';
import ExpandableCustomerCard from './elements/ExpandableCustomerCard';
import moment, { locale } from 'moment';
import { useNavigation } from '@react-navigation/native';
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

export default function CalendarScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const visitationCalendarMapped = useSelector(
    (state: RootState) => state.productivity.visitationCalendarMapped
  );
  const markedDate = useSelector(
    (state: RootState) => state.productivity.markedDate
  );
  const [customerDatas, setCustomerDatas] = useState<customerDataInterface[]>(
    []
  );
  // console.log(visitationCalendarMapped, 'visitationCalendarMapped');
  useHeaderTitleChanged({ title: 'Pilih Tanggal' });
  useEffect(() => {
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
          console.log(JSON.stringify(data), 'visitationListResponse69');
          const visitMapped = data.reduce(
            (
              acc: { [key: string]: customerDataInterface[] },
              obj: visitationListResponse
            ) => {
              const formatedDate = moment(obj.dateVisit).format('yyyy-MM-DD');
              console.log(formatedDate, obj.dateVisit, 'dateVisit77');

              if (!acc[formatedDate]) {
                acc[formatedDate] = [];
              }
              acc[formatedDate].push({
                display_name: obj.project?.company?.displayName,
                name: obj.project?.name,
                // location: obj.project.locationAddress.district,
                email: obj.project?.pic?.email,
                phone: obj.project?.pic?.phone,
                position: obj.project?.pic?.position,
                type: obj.project?.pic?.type,
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
          console.log(error, 'error106calendar');

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

  // const onDayPress = (day: DateData) => {
  //   const custData = visitationCalendarMapped[day.dateString] || [];
  //   console.log(day, 'pressed', markedDate);

  //   setCustomerDatas(custData);

  //   const newMarkedDate = { ...markedDate };

  //   for (const date of Object.keys(newMarkedDate)) {
  //     if (newMarkedDate[date].selected && newMarkedDate[date].marked) {
  //       newMarkedDate[date].selected = false;
  //     }

  //     if (newMarkedDate[date].selected) {
  //       delete newMarkedDate[date];
  //     }

  //     newMarkedDate[day.dateString] = {
  //       ...newMarkedDate[day.dateString],
  //       selected: true,
  //     };
  //   }

  //   setMarkedDate(newMarkedDate);
  // };

  const onDayPress = useCallback(
    (day: DateData) => {
      const custData = visitationCalendarMapped[day.dateString] || [];

      setCustomerDatas(custData);
      console.log('iniiiwkwkw 1, ', custData);

      const newMarkedDate = { ...markedDate };

      console.log('diaa 1', newMarkedDate);

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

      console.log('diaa 2', newMarkedDate);
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
        // date = key;
        date = `${new Date(key).getDate()} ${new Date(key).toLocaleString(
          'ID',
          { month: 'short' }
        )} ${new Date(key).getFullYear()}`;
        let newDate = new Date(key);
        try {
          day = newDate.toLocaleDateString(locale(), { weekday: 'long' });
        } catch (err1) {
          console.log(err1, 'error date parse');
          try {
            day = newDate.toLocaleDateString(locale(), { weekday: 'long' });
          } catch (err2) {
            day = newDate.toLocaleDateString();
            console.log(err2, 'still error date parse');
          }
        }

        selectedDate = {
          date: key,
          prettyDate: date,
          day,
        };
      }
    });

    // var date = new Date(dateStr);
    // return date.toLocaleDateString(locale, { weekday: 'long' });
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
      <View>
        <BCalendar
          onDayPress={onDayPress}
          markedDates={markedDate}
          onMonthChange={onMonthPress}
        />
        <BSpacer size="small" />
        <BText color="divider"> Pelanggan yang Dikunjungi </BText>
        <BSpacer size="extraSmall" />
      </View>
      <FlatList
        style={{ marginBottom: layout.pad.md }}
        data={customerDatas}
        ItemSeparatorComponent={() => <BSpacer size={'extraSmall'} />}
        renderItem={({ item }) => <ExpandableCustomerCard item={item} />}
        keyExtractor={(_, index) => index.toString()}
      />
      {selectedData && (
        <>
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
        </>
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
