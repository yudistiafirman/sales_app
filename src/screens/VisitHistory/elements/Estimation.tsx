import moment, { locale } from 'moment';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BLabel, BSpacer, BText } from '@/components';
import { layout } from '@/constants';
import font from '@/constants/fonts';

interface Props {
  estimationWeek?: string;
  estimationMonth?: string;
}

function Estimation({ estimationWeek, estimationMonth }: Props) {
  const getMonthName = monthNumber => {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString(locale(), { month: 'long' });
  };
  return (
    <View style={styles.container}>
      <BLabel bold="600" sizeInNumber={font.size.md} label="Estimasi waktu dibutuhkannya barang" />
      <BSpacer size="extraSmall" />
      {estimationWeek && estimationMonth && (
        <BText style={styles.date}>
          {`Minggu ke ${estimationWeek}; ${getMonthName(estimationMonth)}`}
        </BText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: layout.pad.lg,
  },
  date: {
    fontFamily: font.family.montserrat[400],
    fontSize: font.size.md,
  },
});

export default Estimation;
