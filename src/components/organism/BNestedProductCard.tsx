import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import * as React from 'react';
import { colors, fonts, layout } from '@/constants';
import formatCurrency from '@/utils/formatCurrency';
import BSpacer from '../atoms/BSpacer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BProductCard from '../molecules/BProductCard';
import BDivider from '../atoms/BDivider';
import font from '@/constants/fonts';
import { QuotationRequests, Products } from '@/interfaces/CreatePurchaseOrder';
import { RadioButton } from 'react-native-paper';
import {
  PoProductData,
  PurchaseOrdersData,
  SalesOrdersData,
} from '@/interfaces/SelectConfirmedPO';

type BNestedProductCardType = {
  withoutHeader?: boolean;
  withoutBottomSpace?: boolean;
  data?: QuotationRequests[] | PurchaseOrdersData[];
  selectedPO?: any[];
  onValueChange?: (product: any, value: boolean) => void;
  withoutSeparator?: boolean;
  isOption?: boolean;
  onSelect?: (index: number) => void;
  onExpand: (idx: number, data: any) => void;
  expandData: any[];
  isDeposit?: boolean;
  poNumber?: string;
};

function ListChildProduct(
  size: number,
  index: number,
  item: SalesOrdersData & Products & PoProductData
) {
  const getDataToDisplay = () => {
    let displayName;
    let offeringPrice;
    let totalPrice;
    let quantity;
    let unit;
    if (item?.Product) {
      displayName = `${
        item?.Product?.category?.Parent
          ? item?.Product?.category?.Parent?.name + ' '
          : ''
      }${item?.Product?.displayName} ${
        item?.Product?.category ? item?.Product?.category?.name : ''
      }`;
      offeringPrice = item?.offeringPrice;
      totalPrice = item?.quantity * item?.offeringPrice;
      quantity = item?.quantity;
      unit = item?.Product?.unit;
    } else if (item?.RequestedProduct) {
      displayName = `${
        item?.RequestedProduct?.Product?.category?.Parent
          ? item?.RequestedProduct?.Product?.category?.Parent?.name + ' '
          : ''
      }${item?.RequestedProduct?.displayName} ${
        item?.RequestedProduct?.Product?.category
          ? item?.RequestedProduct?.Product?.category?.name
          : ''
      }`;
      offeringPrice = item?.RequestedProduct?.offeringPrice;
      totalPrice =
        item?.requestedQuantity && item?.RequestedProduct?.offeringPrice
          ? item?.requestedQuantity * item?.RequestedProduct?.offeringPrice
          : 0;
      quantity = item?.requestedQuantity;
      unit = item?.RequestedProduct?.Product?.unit;
    } else {
      displayName = `${
        item?.PoProduct?.RequestedProduct?.Product?.category?.parent
          ? item?.PoProduct?.RequestedProduct?.Product?.category?.parent?.name +
            ' '
          : ''
      }${item?.PoProduct?.RequestedProduct?.Product?.displayName} ${
        item?.PoProduct?.RequestedProduct?.Product?.category
          ? item?.PoProduct?.RequestedProduct?.Product?.category?.name
          : ''
      }`;
      offeringPrice = item?.PoProduct?.RequestedProduct?.offeringPrice;
      totalPrice =
        item?.PoProduct?.requestedQuantity &&
        item?.PoProduct?.RequestedProduct?.offeringPrice
          ? item?.PoProduct?.requestedQuantity *
            item?.PoProduct?.RequestedProduct?.offeringPrice
          : 0;
      quantity = item?.PoProduct?.requestedQuantity;
      unit = item?.PoProduct?.RequestedProduct?.Product?.unit;
    }

    return { displayName, offeringPrice, totalPrice, quantity, unit };
  };

  const { displayName, offeringPrice, totalPrice, quantity, unit } =
    getDataToDisplay();

  return (
    <View key={index}>
      <BProductCard
        name={displayName}
        pricePerVol={offeringPrice}
        volume={quantity}
        totalPrice={totalPrice}
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
  withoutSeparator = false,
  isOption,
  onExpand,
  expandData,
  isDeposit,
  poNumber,
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
        const name = poNumber
          ? poNumber
          : item?.QuotationLetter?.number || item?.brikNumber;
        const totalPrice = item?.totalPrice
          ? item?.totalPrice
          : item?.products && item?.products.length > 0
          ? item?.products
              ?.map((it) => {
                return it.totalPrice;
              })
              ?.reduce((a, b) => a + b)
          : 0;
        const products = item?.products || item?.PoProducts || item?.SaleOrders;
        const deposit = item?.totalDeposit;
        const expandItems = item?.products
          ? expandData?.findIndex(
              (val) => val?.QuotationLetter?.id === item?.QuotationLetter?.id
            )
          : expandData?.findIndex((val) => val?.id === item?.id);
        const isExpand = expandItems === -1;
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
                  {isDeposit && (
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
                          IDR {formatCurrency(deposit ? deposit : 0)}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                <TouchableWithoutFeedback onPress={() => onExpand(index, item)}>
                  <Icon
                    name={isExpand ? 'chevron-up' : 'chevron-down'}
                    size={30}
                    color={colors.icon.darkGrey}
                  />
                </TouchableWithoutFeedback>
              </View>

              {isExpand && (
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
