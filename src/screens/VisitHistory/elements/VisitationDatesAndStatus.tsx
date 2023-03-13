import { getVisitationOrderByID } from '@/actions/OrderActions';
import { BChip, BSpacer, BText, BTouchableText } from '@/components';
import { colors, layout } from '@/constants';
import font from '@/constants/fonts';
import { TRANSACTION_DETAIL } from '@/navigation/ScreenNames';
import { openPopUp } from '@/redux/reducers/modalReducer';
import { AppDispatch } from '@/redux/store';
import { useNavigation } from '@react-navigation/native';
import moment, { locale } from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

type status = 'VISIT' | 'SPH' | 'REJECTED' | 'PO' | 'SCHEDULING' | 'DO';

interface IProps {
  bookingDate?: string;
  finishDate: string | null;
  status?: status;
  rejectCategory: string | null;
  quatationId?: string | null;
}

const VisitationDatesAndStatus = ({
  bookingDate,
  finishDate,
  status,
  rejectCategory,
  quatationId,
}: IProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const getBackgroundColor = () => {
    let color = '';
    if (status === 'VISIT') {
      color = colors.textInput.inActive;
    } else if (status === 'SPH') {
      color = colors.status.secondaryYellow;
    } else {
      color = colors.primary;
    }
    return color;
  };

  const getStatus = () => {
    if (status === 'VISIT') {
      return 'Kunjungan Lagi';
    } else if (status === 'REJECTED') {
      return 'Closed Lost';
    } else {
      return 'SPH';
    }
  };

  const getLocalBookingDate = () => {
    let date = '-';
    let day = null;
    date = `${new Date(bookingDate).getDate()} ${new Date(
      bookingDate
    ).toLocaleString(locale(), { month: 'short' })} ${new Date(
      bookingDate
    ).getFullYear()}`;
    let newDate = new Date(bookingDate);
    day = newDate.toLocaleDateString(locale(), { weekday: 'long' });
    return day + ', ' + date;
  };

  const getLocalFinishDate = () => {
    let date = '-';
    date = `${new Date(finishDate).getDate()} ${new Date(
      finishDate
    ).toLocaleString(locale(), { month: 'short' })} ${new Date(
      finishDate
    ).getFullYear()}`;
    return date;
  };

  const getRejectedCategory = (reason: string) => {
    let rejectReason = '';
    if (reason === 'MOU_COMPETITOR') {
      rejectReason = 'Sudah MOU dengan Kompetitor';
    } else if (reason === 'FINISHED') {
      rejectReason = 'Proyek sudah selesai dibangun';
    }
    return rejectReason;
  };

  const getOneOrder = async () => {
    try {
      const { data } = await getVisitationOrderByID(quatationId);
      navigation.navigate(TRANSACTION_DETAIL, {
        title: data.data ? data.data.number : 'N/A',
        data: data.data,
      });
    } catch (error) {
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText: error.message,
          highlightedText: 'error',
          outsideClickClosePopUp: true,
        })
      );
    }
  };

  const renderCompBaseOnStatus = () => {
    if (status === 'VISIT') {
      return (
        <BText style={[styles.date, { marginRight: layout.pad.md }]}>
          {finishDate !== null ? getLocalFinishDate() : 'Belum Selesai'}
        </BText>
      );
    } else if (status === 'SPH') {
      return (
        <BTouchableText
          onPress={getOneOrder}
          textStyle={styles.touchableText}
          title="Lihat SPH"
        />
      );
    } else {
      return (
        <BText style={[styles.date, { marginRight: layout.pad.md }]}>
          {rejectCategory !== null && getRejectedCategory(rejectCategory)}
        </BText>
      );
    }
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
                  status === 'REJECTED' ? colors.white : colors.text.darker,
              },
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
            {moment(bookingDate).format('hh:mm A')}
          </BText>
          {renderCompBaseOnStatus()}
        </>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: layout.pad.lg,
    marginRight: layout.pad.md,
  },
  dateAndStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontFamily: font.family.montserrat[500],
    fontSize: font.size.md,
    color: colors.text.darker,
  },
  status: {
    fontFamily: font.family.montserrat[500],
    fontSize: font.size.md,
  },
  touchableText: {
    marginRight: layout.pad.md,
    fontFamily: font.family.montserrat[500],
    fontSize: font.size.md,
    color: colors.primary,
  },
});

export default VisitationDatesAndStatus;
