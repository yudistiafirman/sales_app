import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fonts, layout } from '@/constants';
import { resScale } from '@/utils';
import formatCurrency from '@/utils/formatCurrency';
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
  hideTotal?: boolean;
  hidePricePerVolume?: boolean;
  withoutBorder?: boolean;
  unit?: string;
};

export default function BProductCard({
  name,
  volume,
  pricePerVol,
  totalPrice,
  unit,
  onPressDelete,
  onPressEdit,
  backgroundColor = 'default',
  hideVolume = false,
  hideTotal = false,
  hidePricePerVolume = false,
  withoutBorder = false,
}: BProductCardType) {
  const getUnit = () => {
    let formattedUnit = '';
    if (unit === 'M3') {
      formattedUnit = 'm³';
    } else {
      return 'm³';
    }
    return formattedUnit;
  };

  return (
    <View
      style={[
        backgroundColor === 'default' ? style.containerDefault : style.containerWhite,
        withoutBorder && style.noBorder,
      ]}>
      <View style={style.nameIcons}>
        <Text
          style={[
            style.productName,
            backgroundColor === 'default' && {
              fontFamily: fonts.family.montserrat[500],
            },
          ]}>
          {name}
        </Text>
        <View style={style.iconsContainer}>
          {onPressDelete && (
            <TouchableOpacity onPress={onPressDelete}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                color="#000000"
                size={resScale(20)}
              />
            </TouchableOpacity>
          )}

          <BSpacer size="extraSmall" />
          {onPressEdit && (
            <TouchableOpacity onPress={onPressEdit}>
              <MaterialCommunityIcons name="pencil" color="#000000" size={resScale(20)} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <BSpacer size="extraSmall" />
      <View style={style.detail}>
        {!hideVolume && (
          <Text style={style.detailText}>
            {volume && volume > 0 ? `${volume} ${getUnit()}` : '-'}
          </Text>
        )}
        {!hidePricePerVolume && (
          <Text style={style.detailText}>
            IDR {pricePerVol ? formatCurrency(pricePerVol) : '-'}/{getUnit()}
          </Text>
        )}
        {!hideTotal && (
          <Text style={style.detailText}>
            IDR
            {totalPrice ? formatCurrency(totalPrice) : '-'}
          </Text>
        )}
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
