import {
  BDivider,
  BExpandableProductCard,
  BLabel,
  BSpacer,
} from '@/components';
import { ProductsData } from '@/components/organism/BCommonCompanyList';
import { colors, fonts } from '@/constants';
import font from '@/constants/fonts';
import { PurchaseOrderContext } from '@/context/PoContext';
import { resScale } from '@/utils';
import { useActor } from '@xstate/react';
import React, { useCallback, useContext } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';

const ProductDetail = () => {
  const { purchaseOrderService } = useContext(PurchaseOrderContext);
  const [state] = useActor(purchaseOrderService);
  const { send } = purchaseOrderService;

  const { choosenSphDataFromModal } = state.context;

  const renderItemChoosenSphProducts: ListRenderItem<ProductsData> =
    useCallback(
      ({ item, index }) => {
        return (
          <BExpandableProductCard
            productName={item.name}
            checked={item.isSelected}
            pricePerVol={item.pricePerVol}
            volume={item.volume}
            index={index}
            totalPrice={item.totalPrice}
            onChecked={(idx) => send('selectProduct', { value: idx })}
          />
        );
      },
      [send]
    );

  const renderItemSeparator = () => {
    return <BSpacer size="extraSmall" />;
  };

  return (
    <View style={styles.container}>
      <BLabel bold="600" sizeInNumber={font.size.md} label="Produk" />
      <BSpacer size="extraSmall" />
      <BDivider borderBottomWidth={1} flex={0} height={0.1} />
      <BSpacer size="extraSmall" />
      <FlatList
        data={choosenSphDataFromModal?.sph[0].productsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItemChoosenSphProducts}
        ItemSeparatorComponent={renderItemSeparator}
      />
      <View style={styles.priceContainer}>
        <Text style={styles.productName}>Total</Text>
        <Text style={styles.boldPrice}>IDR 58.000.000</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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

export default ProductDetail;
