import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { colors, fonts, layout } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { resScale } from '@/utils';
import BSpacer from '../atoms/BSpacer';

type BProductCardType = {
  name?: string;
  volume?: number;
  pricePerVol?: number;
  totalPrice?: number;
  onPressDelete?: () => void;
  onPressEdit?: () => void;
  backgroundColor?: 'white' | 'default';
  hideVolume?: boolean;
  withoutBorder?: boolean;
};

export default function BProductCard({
  name,
  volume,
  pricePerVol,
  totalPrice,
  onPressDelete,
  onPressEdit,
  backgroundColor = 'default',
  hideVolume = false,
  withoutBorder = false,
}: BProductCardType) {
  return (
    <View
      style={[
        backgroundColor === 'default'
          ? style.containerDefault
          : style.containerWhite,
        withoutBorder && style.noBorder,
      ]}
    >
      <View style={style.nameIcons}>
        <Text
          style={[
            style.productName,
            backgroundColor === 'default' && {
              fontFamily: fonts.family.montserrat[500],
            },
          ]}
        >
          {name}
        </Text>
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
        {!hideVolume && (
          <Text style={style.detailText}>
            {volume > 0 ? volume + ' m³' : '-'}
          </Text>
        )}
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
  noBorder: {
    borderWidth: 0,
  },
  containerDefault: {
    flex: 1,
    padding: layout.pad.md,
    borderRadius: layout.radius.md,
    backgroundColor: colors.tertiary,
    borderColor: colors.border.default,
    borderWidth: 1,
  },
  containerWhite: {
    width: '100%',
    padding: layout.pad.md,
    borderRadius: layout.radius.md,
    backgroundColor: colors.white,
  },
  productName: {
    fontFamily: fonts.family.montserrat[400],
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
