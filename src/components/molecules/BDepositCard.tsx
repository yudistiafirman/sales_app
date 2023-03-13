import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import * as React from 'react';
import { colors, fonts, layout } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';
import BSpacer from '../atoms/BSpacer';

type BDepositCardType = {
  firstSectionValue: number;
  firstSectionText: string;
  secondSectionValue: number;
  secondSectionText: string;
  thirdSectionText: string;
  style?: ViewStyle;
};

export default function BDepositCard({
  firstSectionValue,
  firstSectionText,
  secondSectionValue,
  secondSectionText,
  thirdSectionText,
  style,
}: BDepositCardType) {
  return (
    <View style={style}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summary}>{firstSectionText}</Text>
        <Text style={[styles.summary, styles.fontw400]}>
          IDR {formatCurrency(firstSectionValue)}
        </Text>
      </View>
      <BSpacer size={'extraSmall'} />
      <View style={styles.summaryContainer}>
        <Text style={styles.summary}>{secondSectionText}</Text>
        <Text style={[styles.summary, styles.fontw400]}>
          IDR {formatCurrency(secondSectionValue)}
        </Text>
      </View>
      <BSpacer size={'extraSmall'} />
      <View style={styles.summaryContainer}>
        <Text style={styles.summary}>{thirdSectionText}</Text>
        <Text
          style={[
            styles.summary,
            {
              fontFamily: fonts.family.montserrat[600],
              fontSize: fonts.size.md,
            },
          ]}
        >
          IDR {formatCurrency(firstSectionValue - secondSectionValue)}
        </Text>
      </View>
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
