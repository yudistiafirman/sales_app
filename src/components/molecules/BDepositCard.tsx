import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, fonts, layout } from '@/constants';
import { BSpacer } from '@/components';
import formatCurrency from '@/utils/formatCurrency';

type BDepositCardType = {
  firstSectionValue: number;
  firstSectionText: string;
  secondSectionValue: number;
  secondSectionText: string;
  thirdSectionText: string;
};

export default function BDepositCard({
  firstSectionValue,
  firstSectionText,
  secondSectionValue,
  secondSectionText,
  thirdSectionText,
}: BDepositCardType) {
  return (
    <View>
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
          IDR{' '}
          {secondSectionValue < 0
            ? formatCurrency(secondSectionValue)
            : '+ ' + formatCurrency(secondSectionValue)}
        </Text>
      </View>
      <BSpacer size={'extraSmall'} />
      <View style={styles.summaryContainer}>
        <Text style={styles.summary}>{thirdSectionText}</Text>
        <Text style={[styles.summary, styles.fontw400]}>
          IDR {formatCurrency(firstSectionValue + secondSectionValue)}
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
