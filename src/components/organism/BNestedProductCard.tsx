import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import * as React from 'react';
import { colors, fonts, layout } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';
import BSpacer from '../atoms/BSpacer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BProductCard from '../molecules/BProductCard';
import BDivider from '../atoms/BDivider';
import CheckBox from '@react-native-community/checkbox';
import font from '@/constants/fonts';

type BNestedProductCardType = {
  withoutHeader?: boolean;
  withoutBottomSpace?: boolean;
  data?: any[];
  selectedPO?: any[];
  onValueChange?: (product: any, value: boolean) => void;
  deposit?: number;
  withoutSeparator?: boolean;
};

function ListChildProduct(size: number, index: number, item: any) {
  return (
    <View key={item.product_id}>
      <BProductCard
        name={item.display_name}
        pricePerVol={+item.offering_price}
        volume={item.quantity ? item.quantity : 0}
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
}

export default function BNestedProductCard({
  withoutHeader = false,
  data,
  onValueChange,
  withoutBottomSpace = false,
  selectedPO,
  deposit,
  withoutSeparator = false,
}: BNestedProductCardType) {
  const [isExpand, setExpand] = React.useState<number[]>([]);

  const setExpandContent = (index: number) => {
    let listExpand: number[] = [];
    if (isExpand !== undefined) listExpand.push(...isExpand);
    if (listExpand.find((it) => it === index) !== undefined) {
      listExpand = listExpand.filter((it) => {
        return it !== index;
      });
    } else {
      listExpand.push(index);
    }
    setExpand(listExpand);
  };

  return (
    <>
      {withoutHeader && (
        <>
          <Text style={styles.partText}>Produk</Text>
          <BSpacer size={'extraSmall'} />
        </>
      )}
      {data?.map((item, index) => {
        return (
          <View key={index}>
            <View style={styles.containerLastOrder}>
              <View style={styles.flexRow}>
                {onValueChange && (
                  <CheckBox
                    value={selectedPO?.find((it) => it === item) ? true : false}
                    onFillColor={colors.primary}
                    onTintColor={colors.offCheckbox}
                    onCheckColor={colors.primary}
                    tintColors={{
                      true: colors.primary,
                      false: colors.offCheckbox,
                    }}
                    onValueChange={(value) => {
                      onValueChange(item, value);
                    }}
                  />
                )}
                <View style={styles.leftSide}>
                  <Text style={styles.partText}>{item.name}</Text>
                  <BSpacer size={'verySmall'} />
                  <View style={styles.flexRow}>
                    <Text style={styles.titleLastOrder}>Harga</Text>
                    <View style={styles.valueView}>
                      <Text style={styles.valueLastOrder}>
                        IDR{' '}
                        {formatCurrency(
                          item.products
                            ?.map((it: any) => it.total_price)
                            .reduce((prev: any, next: any) => prev + next)
                        )}
                      </Text>
                    </View>
                  </View>
                  {deposit && (
                    <View style={styles.flexRow}>
                      <Text style={styles.titleLastOrder}>Deposit</Text>
                      <View style={styles.valueView}>
                        <Text
                          style={[
                            styles.valueLastOrder,
                            {
                              fontFamily: fonts.family.montserrat[300],
                              fontSize: font.size.xs,
                            },
                          ]}
                        >
                          IDR {formatCurrency(deposit)}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                <TouchableWithoutFeedback
                  onPress={() => setExpandContent(index)}
                >
                  <Icon
                    name={
                      isExpand &&
                      isExpand.find((it) => it === index) !== undefined
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={30}
                    color={colors.icon.darkGrey}
                  />
                </TouchableWithoutFeedback>
              </View>
              {isExpand &&
                isExpand?.find((it) => it === index) !== undefined && (
                  <>
                    <BSpacer size={'small'} />
                    {item?.products &&
                      item?.products?.map((it: any, ind: number) =>
                        ListChildProduct(it?.products?.length, ind, it)
                      )}
                  </>
                )}
            </View>
            {!withoutSeparator && <BSpacer size={'extraSmall'} />}
          </View>
        );
      })}
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
    marginStart: layout.pad.md,
  },
  valueLastOrder: {
    flex: 1,
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
  },
  valueView: { flex: 1, alignItems: 'flex-end', marginEnd: layout.pad.xxl },
  partText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
    marginStart: layout.pad.md,
  },
});
