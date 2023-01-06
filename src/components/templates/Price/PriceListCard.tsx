/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import { StyleSheet, View } from 'react-native';
import BChip from '../../atoms/BChip';
import BText from '../../atoms/BText';
import resScale from '@/utils/resScale';

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
        <BText style={PriceListCardStyles.productPrice}>{productPrice}</BText>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <BChip type="default" backgroundColor={colors.chip.green}>
          {categories}
        </BChip>
      </View>
    </View>
  );
};

const PriceListCardStyles = StyleSheet.create({
  container: {
    height: resScale(56),
    borderBottomWidth: 1,
    borderColor: colors.border.disabled,
    marginTop: resScale(6),
  },
  nameAndPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: resScale(8),
    marginTop: resScale(6),
  },
  productName: {
    fontFamily: font.family.montserrat['500'],
    color: colors.text.darker,
    fontSize: font.size.md,
  },
  productPrice: {
    fontFamily: font.family.montserrat['400'],
    color: '#202020',
    fontSize: font.size.md,
  },
});

export default PriceListCard;
