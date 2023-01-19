/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import { Platform, StyleSheet, View } from 'react-native';
import BChip from '../../atoms/BChip';
import BText from '../../atoms/BText';
import resScale from '@/utils/resScale';
import { layout } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';


interface PriceListCardProps {
  productName?: string;
  productPrice?: number;
  categories?: string;
}

const PriceListCard = ({
  productName,
  productPrice,
  categories,
}: PriceListCardProps) => {

  return (
    <View style={PriceListCardStyles.container}>
      <View style={PriceListCardStyles.nameAndPriceContainer}>
        <BText style={PriceListCardStyles.productName}>{productName}</BText>
        <BText style={PriceListCardStyles.productPrice}>
          {`IDR ${formatCurrency(productPrice)}`}
        </BText>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <BChip type="default" backgroundColor={colors.chip.green}>
          {categories}
        </BChip>
      </View>
    </View>
  );
};

export const PriceListCardStyles = StyleSheet.create({
  container: {
    height: resScale(56),
    borderBottomWidth: 1,
    borderColor: colors.border.disabled,
    marginTop: resScale(6),
  },
  nameAndPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.pad.md,
    marginTop: resScale(6),
  },
  productName: {
    fontFamily: font.family.montserrat['500'],
    color: colors.text.darker,
    fontSize: font.size.md,
  },
  productPrice: {
    fontFamily: font.family.montserrat['400'],
    color: colors.text.darker,
    fontSize: font.size.md,
  },
});

export default PriceListCard;
