import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors, fonts, layout } from '@/constants';
import { BSpacer } from '@/components';
import formatCurrency from '@/utils/formatCurrency';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { resScale } from '@/utils';

type ProductCardType = {
  name?: string;
  volume?: number;
  pricePerVol?: number;
  totalPrice?: number;
  onPressDelete?: () => void;
  onPressEdit?: () => void;
};

export default function ProductCard({
  name,
  volume,
  pricePerVol,
  totalPrice,
  onPressDelete,
  onPressEdit,
}: ProductCardType) {
  return (
    <View style={style.container}>
      <View style={style.nameIcons}>
        <Text style={style.productName}>{name}</Text>
        <View style={style.iconsContainer}>
          {onPressDelete && (
            <TouchableOpacity onPress={onPressDelete}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                color={'#000000'}
                size={resScale(20)}
              />
            </TouchableOpacity>
          )}

          <BSpacer size={'extraSmall'} />
          {onPressEdit && (
            <TouchableOpacity onPress={onPressEdit}>
              <MaterialCommunityIcons
                name="pencil"
                color={'#000000'}
                size={resScale(20)}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <BSpacer size={'extraSmall'} />
      <View style={style.detail}>
        <Text style={style.detailText}>{volume}m³</Text>
        <Text style={style.detailText}>
          IDR {pricePerVol ? formatCurrency(pricePerVol) : '-'}/m³
        </Text>
        <Text style={style.detailText}>
          IDR {totalPrice ? formatCurrency(totalPrice) : '-'}
        </Text>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.tertiary,
    padding: layout.pad.md,
    borderRadius: layout.radius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  productName: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
    color: colors.text.darker,
  },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
  nameIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
});
