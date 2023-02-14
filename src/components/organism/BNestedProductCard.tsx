import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { colors, fonts, layout } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';
import BSpacer from '../atoms/BSpacer';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BProductCard from '../molecules/BProductCard';
import BDivider from '../atoms/BDivider';
import { TouchableOpacity } from 'react-native-gesture-handler';

type BNestedProductCardType = {
  data?: any[];
};

const ListProduct = (index: number, parentItem: any) => {
  const [isExpand, setExpand] = useState(true);

  return (
    <View key={index}>
      <View style={styles.containerLastOrder}>
        <View style={styles.flexRow}>
          <View style={styles.leftSide}>
            <Text style={styles.partText}>{parentItem.title}</Text>
            <BSpacer size={'extraSmall'} />
            <View style={styles.flexRow}>
              <Text style={styles.titleLastOrder}>Harga</Text>
              <Text style={styles.valueLastOrder}>
                IDR {formatCurrency(parentItem.price)}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setExpand(isExpand ? false : true)}>
            <MaterialIcon
              style={styles.icon}
              size={40}
              name={isExpand ? 'chevron-up' : 'chevron-down'}
            />
          </TouchableOpacity>
        </View>
        {isExpand && (
          <>
            <BSpacer size={'small'} />
            {parentItem?.products &&
              parentItem?.products.map((item, index) =>
                ListChildProduct(parentItem?.products.length, index, item)
              )}
          </>
        )}
      </View>
      <BSpacer size={'small'} />
    </View>
  );
};

const ListChildProduct = (size: number, index: number, item: any) => {
  return (
    <View key={item.product_id}>
      <BProductCard
        name={item.display_name}
        pricePerVol={+item.offering_price}
        volume={item.unit ? item.unit : 0}
        totalPrice={+item.total_price}
        backgroundColor={'white'}
      />
      {size - 1 !== index && (
        <BDivider
          marginHorizontal={layout.pad.lg}
          borderColor={colors.tertiary}
        />
      )}
    </View>
  );
};

export default function BNestedProductCard({ data }: BNestedProductCardType) {
  return (
    <>
      <Text style={styles.partText}>Produk</Text>
      <BSpacer size={'extraSmall'} />
      {data?.map((item, index) => ListProduct(index, item))}
      <BSpacer size={'extraSmall'} />
    </>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  leftSide: {
    flex: 1,
  },
  icon: {
    alignSelf: 'center',
  },
  containerLastOrder: {
    padding: layout.pad.lg,
    borderRadius: layout.radius.md,
    backgroundColor: colors.tertiary,
    borderColor: colors.border.default,
    borderWidth: 1,
  },
  titleLastOrder: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
  valueLastOrder: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.sm,
    marginLeft: layout.pad.xl,
  },
  contentDetail: {
    padding: layout.mainPad,
    flex: 1,
  },
  partText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.md,
  },
});
