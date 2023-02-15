import { View, Text, StyleSheet } from 'react-native';
import * as React from 'react';
import { colors, fonts, layout } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';
import BSpacer from '../atoms/BSpacer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BProductCard from '../molecules/BProductCard';
import BDivider from '../atoms/BDivider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';

type BNestedProductCardType = {
  withoutHeader?: boolean;
  withoutBottomSpace?: boolean;
  data?: any[];
  onValueChange?: (product: any, value: boolean) => void;
};

const ListProduct = (
  index: number,
  parentItem: any,
  onValueChange?: (product: any, value: boolean) => void
) => {
  const [isExpand, setExpand] = React.useState(true);
  const [isChecked, setChecked] = React.useState(new Map());

  return (
    <View key={index}>
      <View style={styles.containerLastOrder}>
        <View style={styles.flexRow}>
          {onValueChange && (
            <CheckBox
              value={
                isChecked.get(parentItem.name) &&
                isChecked.get(parentItem.name).checked
              }
              onFillColor={colors.primary}
              onTintColor={colors.offCheckbox}
              onCheckColor={colors.primary}
              tintColors={{ true: colors.primary, false: colors.offCheckbox }}
              onValueChange={(value) => {
                setChecked(new Map().set(parentItem.name, value));
                onValueChange(parentItem, value);
              }}
            />
          )}
          <View style={styles.leftSide}>
            <Text style={styles.partText}>{parentItem.name}</Text>
            <BSpacer size={'extraSmall'} />
            <View style={styles.flexRow}>
              <Text style={styles.titleLastOrder}>Harga</Text>
              <Text style={styles.valueLastOrder}>
                IDR{' '}
                {formatCurrency(
                  parentItem.products
                    .map((item) => item.total_price)
                    .reduce((prev, next) => prev + next)
                )}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setExpand(isExpand ? false : true)}>
            <Icon
              name={isExpand ? 'chevron-up' : 'chevron-down'}
              size={30}
              color={colors.icon.darkGrey}
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

export default function BNestedProductCard({
  withoutHeader = false,
  data,
  onValueChange,
  withoutBottomSpace = false,
}: BNestedProductCardType) {
  return (
    <>
      {withoutHeader && (
        <>
          <Text style={styles.partText}>Produk</Text>
          <BSpacer size={'extraSmall'} />
        </>
      )}
      {data?.map((item, index) => ListProduct(index, item, onValueChange))}
      {!withoutBottomSpace && <BSpacer size={'extraSmall'} />}
    </>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
    marginLeft: layout.pad.xl,
  },
  contentDetail: {
    padding: layout.mainPad,
    flex: 1,
  },
  partText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
  },
});
