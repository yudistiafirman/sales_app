import * as React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import BSpacer from '../atoms/BSpacer';
import BText from '../atoms/BText';
import { colors, fonts, layout } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';

type BDepositCardType = {
  firstSectionValue: number;
  firstSectionText: string;
  secondSectionValue: number;
  secondSectionText: string;
  thirdSectionText: string;
  isError?: boolean;
  customErrorMsg?: string;
  style?: ViewStyle;
  isSum?: boolean;
};

export default function BDepositCard({
  firstSectionValue,
  firstSectionText,
  secondSectionValue,
  secondSectionText,
  thirdSectionText,
  isError,
  customErrorMsg,
  style,
  isSum = false,
}: BDepositCardType) {
  const getTotalDifference = () => {
    let result = 0;
    result = firstSectionValue - secondSectionValue;
    if (result < 0) result = -result;
    return result;
  };
  const getTotalSum = () => {
    let result = 0;
    result = firstSectionValue + secondSectionValue;
    return result;
  };

  return (
    <View style={style}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summary}>{firstSectionText}</Text>
        <Text style={[styles.summary, styles.fontw400]}>
          IDR {formatCurrency(firstSectionValue)}
        </Text>
      </View>
      <BSpacer size="extraSmall" />
      <View style={styles.summaryContainer}>
        <Text style={styles.summary}>{secondSectionText}</Text>
        <Text style={[styles.summary, styles.fontw400]}>
          {isSum ? '+' : '-'} IDR
          {formatCurrency(secondSectionValue)}
        </Text>
      </View>
      <BSpacer size="extraSmall" />
      <View style={styles.summaryContainer}>
        <Text style={styles.summary}>{thirdSectionText}</Text>
        <Text
          style={[
            styles.summary,
            {
              fontFamily: fonts.family.montserrat[600],
              fontSize: fonts.size.md,
            },
          ]}>
          {`IDR ${formatCurrency(isSum ? getTotalSum() : getTotalDifference())}`}
        </Text>
      </View>
      {isError && (
        <BText size="small" color="primary" bold="100">
          {customErrorMsg || `${firstSectionText} harus lebih besar dari ${secondSectionText}`}
        </BText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[300],
    fontSize: fonts.size.sm,
  },
  fontw400: {
    fontFamily: fonts.family.montserrat[400],
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chip: {
    paddingVertical: layout.pad.xs,
    paddingHorizontal: layout.pad.md,
    borderRadius: layout.radius.xl,
  },
});
