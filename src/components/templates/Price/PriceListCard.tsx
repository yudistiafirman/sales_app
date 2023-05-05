/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import { StyleSheet, Text, View } from 'react-native';
import BChip from '../../atoms/BChip';
import BText from '../../atoms/BText';
import resScale from '@/utils/resScale';
import { layout } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface PriceListCardProps {
  productName?: string;
  productPrice: number;
  categories?: string;
  slump?: number;
}

const PriceListCard = ({
  productName,
  productPrice,
  categories,
  slump,
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
        {slump && (
          <BChip type="default" backgroundColor={colors.chip.disabled}>
            {`slump ${slump}`}
            <Icon
              color={colors.text.darker}
              size={font.size.xs}
              name="plus-minus"
            />
            {'2cm'}
          </BChip>
        )}
      </View>
    </View>
  );
};

export const PriceListCardStyles = StyleSheet.create({
  container: {
    height: resScale(56),
    // borderBottomWidth: 1,
    // borderColor: colors.border.disabled,
    marginTop: layout.pad.xs + layout.pad.sm,
  },
  nameAndPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.pad.md,
    marginTop: layout.pad.xs + layout.pad.sm,
  },
  productName: {
    fontFamily: font.family.montserrat[500],
    color: colors.text.darker,
    fontSize: font.size.md,
  },
  productPrice: {
    fontFamily: font.family.montserrat[400],
    color: colors.text.darker,
    fontSize: font.size.md,
  },
});

export default PriceListCard;
