import BDivider from '@/components/atoms/BDivider';
import BLabel from '@/components/atoms/BLabel';
import BSpacer from '@/components/atoms/BSpacer';
import BExpandableProductCard from '@/components/molecules/BExpandableProductCard';
import { colors, fonts, layout } from '@/constants';
import font from '@/constants/fonts';
import { Products } from '@/interfaces/CreatePurchaseOrder';
import formatCurrency from '@/utils/formatCurrency';
import React, { useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ListRenderItem,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BForm from '../organism/BForm';
import { Input } from '@/interfaces';
import { resScale } from '@/utils';

const { width, height } = Dimensions.get('window');

type ChoosenProductListProps<ProductData> = {
  data?: ProductData[];
  onChecked?: (data: ProductData) => void;
  selectedProducts?: ProductData[];
  hasMultipleCheck?: boolean;
  onChangeQuantity: (index: number, value: string) => void;
  calculatedTotalPrice: number;
  comboRadioBtnInput?: Input[];
};

const ChoosenProductList = <ProductData extends Products>({
  data,
  onChecked,
  selectedProducts,
  hasMultipleCheck,
  onChangeQuantity,
  calculatedTotalPrice,
  comboRadioBtnInput,
}: ChoosenProductListProps<ProductData>) => {
  const renderItem = useCallback(
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
      const quantity =
        item?.quantity.toString()[0] === '0' ? 0 : item?.quantity;
      const totalPrice =
        item?.quantity && item?.offeringPrice ? offeringPrice * quantity : 0;
      return (
        <BExpandableProductCard
          key={index}
          productName={productName}
          checked={hasMultipleCheck && checked !== -1}
          pricePerVol={offeringPrice}
          volume={quantity}
          item={item}
          isOptions={data && data?.length > 1}
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
    <ScrollView style={{ flex: 1, marginBottom: resScale(56) }}>
      <View style={{ flex: 1 }}>
        <BLabel bold="600" sizeInNumber={font.size.md} label="Produk" />
        <BSpacer size="extraSmall" />
        <BDivider borderBottomWidth={1} flex={0} height={0.1} />
        <BSpacer size="extraSmall" />
        {data?.map((item: ProductData, index: number) =>
          renderItem({ item, index })
        )}
        <BSpacer size="extraSmall" />

        {comboRadioBtnInput && (
          <BForm titleBold="500" inputs={comboRadioBtnInput} />
        )}
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.productName}>Total</Text>
        <Text numberOfLines={1} style={styles.boldPrice}>
          IDR {formatCurrency(calculatedTotalPrice)}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
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
    width: width - 100,
    textAlign: 'right',
  },
});

export default ChoosenProductList;
