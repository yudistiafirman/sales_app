import BDivider from '@/components/atoms/BDivider';
import BLabel from '@/components/atoms/BLabel';
import BSpacer from '@/components/atoms/BSpacer';
import BExpandableProductCard from '@/components/molecules/BExpandableProductCard';
import { colors, fonts } from '@/constants';
import font from '@/constants/fonts';
import { RequestedProducts } from '@/interfaces/CreatePurchaseOrder';
import { resScale } from '@/utils';
import React, { useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, ListRenderItem } from 'react-native';

type ChoosenProductListProps<ProductData> = {
  data?: ProductData[];
  onChecked?: (data: ProductData) => void;
  selectedProducts?: ProductData[];
  hasMultipleCheck?: boolean;
  onChangeQuantity: (index: number, value: string) => void;
};

const ChoosenProductList = <ProductData extends RequestedProducts>({
  data,
  onChecked,
  selectedProducts,
  hasMultipleCheck,
  onChangeQuantity,
}: ChoosenProductListProps<ProductData>) => {
  const renderItem: ListRenderItem<ProductData> = useCallback(
    ({ item, index }) => {
      const checked = selectedProducts?.findIndex((val) => val.id === item.id);
      const inputsSelection: Input[] = [
        {
          label: 'Volume',
          isRequire: true,
          type: 'quantity',
          value: item?.quantity.toString(),
          onChange: (value: string) => onChangeQuantity(index, value),
        },
      ];

      const productName = `${item?.Product?.category?.Parent?.name} ${item?.Product?.displayName} ${item?.Product?.category?.name}`;
      const offeringPrice = item?.offeringPrice;
      const quantity = item?.quantity;
      const totalPrice =
        item?.quantity && item?.offeringPrice ? offeringPrice * quantity : 0;
      return (
        <BExpandableProductCard
          productName={productName}
          checked={(hasMultipleCheck && checked !== -1) || data?.length === 1}
          pricePerVol={offeringPrice}
          volume={quantity}
          item={item}
          totalPrice={totalPrice}
          onChecked={() => hasMultipleCheck && onChecked && onChecked(item)}
          inputsSelection={inputsSelection}
          hasMultipleCheck={hasMultipleCheck}
        />
      );
    },
    [
      data?.length,
      hasMultipleCheck,
      onChangeQuantity,
      onChecked,
      selectedProducts,
    ]
  );

  const renderItemSeparator = () => {
    return <BSpacer size="extraSmall" />;
  };
  return (
    <>
      <BLabel bold="600" sizeInNumber={font.size.md} label="Produk" />
      <BSpacer size="extraSmall" />
      <BDivider borderBottomWidth={1} flex={0} height={0.1} />
      <BSpacer size="extraSmall" />

      <FlatList
        data={data}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={renderItemSeparator}
      />
      <View style={styles.priceContainer}>
        <Text style={styles.productName}>Total</Text>
        <Text style={styles.boldPrice}>IDR 58.000.000</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: resScale(70),
  },
  productName: {
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.lg,
    color: colors.text.darker,
  },
  boldPrice: {
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.lg,
    color: colors.text.darker,
  },
});

export default ChoosenProductList;
