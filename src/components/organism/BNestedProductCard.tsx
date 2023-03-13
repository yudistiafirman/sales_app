import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import * as React from 'react';
import { colors, fonts, layout } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';
import BSpacer from '../atoms/BSpacer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BProductCard from '../molecules/BProductCard';
import BDivider from '../atoms/BDivider';
import font from '@/constants/fonts';
import { QuotationRequests } from '@/interfaces/CreatePurchaseOrder';
import { RadioButton } from 'react-native-paper';

type DepositData = {
  name: string;
  products: any[];
};

type BNestedProductCardData = QuotationRequests & DepositData;

type BNestedProductCardType = {
  withoutHeader?: boolean;
  withoutBottomSpace?: boolean;
  data?: BNestedProductCardData[];
  selectedPO?: any[];
  onValueChange?: (product: any, value: boolean) => void;
  deposit?: number;
  withoutSeparator?: boolean;
  isOption?: boolean;
  onSelect?: (index: number) => void;
  onExpand:(idx:number,data:any)=> void
  expandData:any[]
};

function ListChildProduct(size: number, index: number, item: any) {
  const displayName =
    item?.display_name ||
    `${item?.Product.category?.Parent?.name} ${item?.Product?.displayName} ${item?.Product?.category?.name}`;
  const offeringPrice = +item?.offering_price || item?.offeringPrice;
  const totalPrice = item?.total_price || item?.quantity * offeringPrice;
  const quantity = item?.quantity ? item?.quantity : 0;
  const unit = item?.Product?.unit;
  return (
    <View key={index}>
      <BProductCard
        name={displayName}
        pricePerVol={offeringPrice}
        volume={quantity}
        totalPrice={+totalPrice}
        unit={unit}
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
  withoutBottomSpace = false,
  onSelect,
  deposit,
  withoutSeparator = false,
  isOption,
  onExpand,
  expandData
}: BNestedProductCardType) {
  return (
    <>
      {withoutHeader && (
        <>
          <Text style={styles.partText}>Produk</Text>
          <BSpacer size={'extraSmall'} />
        </>
      )}
      {data?.map((item, index) => {
        const name = item.name || item.QuotationLetter.number;
        const totalPrice =
          item?.products
            ?.map((it: any) => it.total_price)
            .reduce((prev: any, next: any) => prev + next, 0) ||
          item.totalPrice;
        const products = item?.products;
        const expandItems = expandData?.findIndex((val) => val?.QuotationLetter?.id === item?.QuotationLetter?.id);
        const isExpand = expandItems === -1
        return (
          <View key={index}>
            <View style={styles.containerLastOrder}>
              <View style={styles.flexRow}>
                {isOption && (
                  <RadioButton
                    uncheckedColor={colors.border.altGrey}
                    value={item.id}
                    status={item.isSelected ? 'checked' : 'unchecked'}
                    onPress={() => {
                      if (onSelect) {
                        onSelect(index);
                      }
                    }}
                  />
                )}
                <View style={styles.leftSide}>
                  <Text style={styles.partText}>{name}</Text>
                  <BSpacer size={'verySmall'} />
                  <View style={styles.flexRow}>
                    <Text style={styles.titleLastOrder}>Harga</Text>
                    <View style={styles.valueView}>
                      <Text style={styles.valueLastOrder}>
                        IDR {formatCurrency(totalPrice)}
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
                <TouchableWithoutFeedback onPress={() => onExpand(index,item)}>
                  <Icon
                    name={isExpand ? 'chevron-up' : 'chevron-down'}
                    size={30}
                    color={colors.icon.darkGrey}
                  />
                </TouchableWithoutFeedback>
              </View>

              {isExpand&& (
                <>
                  <BSpacer size={'small'} />
                  {products &&
                    products?.map((it: any, ind: number) => {
                      const length =
                        it?.products?.length || it?.Product?.length;
                      return ListChildProduct(length, ind, it);
                    })}
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
