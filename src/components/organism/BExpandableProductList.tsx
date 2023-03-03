import { colors, fonts, layout } from '@/constants';
import { Input } from '@/interfaces';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import BDivider from '../atoms/BDivider';
import BSpacer from '../atoms/BSpacer';
import BText from '../atoms/BText';
import BProductCard from '../molecules/BProductCard';
import BForm from './BForm';

interface BExpandableProductListProps {
  products: any[];
  selectedIndex: string;
  setSelectedIndex: (index: string) => void;
  inputsSelection: Input[];
}

const BExpandableProductList = ({
  products,
  selectedIndex,
  setSelectedIndex,
  inputsSelection,
}: BExpandableProductListProps) => {
  const getProductQuantity = (): number => {
    let quantity = 0;
    if (products && products.length > 0 && products[selectedIndex].quantity)
      quantity = products[selectedIndex].quantity;
    return (
      quantity -
      (products[selectedIndex].inputQuantity
        ? parseInt(products[selectedIndex].inputQuantity, 10)
        : 0)
    );
  };
  return (
    <>
      <Text style={style.partText}>Produk</Text>
      <BSpacer size={'verySmall'} />
      <View style={style.flexFull}>
        <BDivider />
        <BSpacer size={'extraSmall'} />
        {products.map((item, index) => {
          return (
            <View key={index.toString()} style={style.flexFull}>
              <View style={style.selectionProduct}>
                <View style={style.contentProduct}>
                  <RadioButton
                    value={index.toString()}
                    status={
                      selectedIndex === index.toString()
                        ? 'checked'
                        : 'unchecked'
                    }
                    uncheckedColor={colors.border.altGrey}
                    onPress={() => setSelectedIndex(index.toString())}
                  />
                  <BProductCard
                    name={item.display_name}
                    pricePerVol={item.offering_price}
                    volume={parseInt(item.quantity, 10)}
                    totalPrice={item.total_price}
                    hideVolume
                    withoutBorder
                  />
                </View>
                {selectedIndex === index.toString() && (
                  <View style={style.formInput}>
                    <BForm
                      titleBold="500"
                      inputs={inputsSelection}
                      spacer="extraSmall"
                    />
                    <View style={style.volContent}>
                      <BText>Sisa vol. yang belum dikirim</BText>
                      <BText
                        style={{
                          marginStart: layout.pad.sm,
                          fontFamily: fonts.family.montserrat[500],
                        }}
                      >
                        {getProductQuantity() + ' m³'}
                      </BText>
                    </View>
                  </View>
                )}
              </View>
              {products.length - 1 !== index && (
                <BDivider
                  marginVertical={layout.pad.md}
                  borderColor={colors.white}
                />
              )}
            </View>
          );
        })}
      </View>
    </>
  );
};

const style = StyleSheet.create({
  partText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.md,
  },
  flexFull: {
    flex: 1,
  },
  selectionProduct: {
    flex: 1,
    alignItems: 'center',
    borderRadius: layout.radius.md,
    backgroundColor: colors.tertiary,
    borderColor: colors.border.default,
    borderWidth: 1,
  },
  contentProduct: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formInput: {
    flex: 1,
    width: '100%',
    padding: layout.pad.md,
  },
  volContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default BExpandableProductList;
