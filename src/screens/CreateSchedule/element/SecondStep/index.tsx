import {
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInputChangeEventData,
  View,
} from 'react-native';
import * as React from 'react';

import { colors, fonts, layout } from '@/constants';
import { CreateScheduleContext } from '@/context/CreateScheduleContext';
import {
  BDepositCard,
  BDivider,
  BForm,
  BProductCard,
  BSpacer,
  BText,
  BTextInput,
} from '@/components';
import { Input } from '@/interfaces';
import { PO_METHOD_LIST } from '@/constants/dropdown';
import CheckBox from '@react-native-community/checkbox';
import { RadioButton } from 'react-native-paper';

export default function SecondStep() {
  const { values, action } = React.useContext(CreateScheduleContext);
  const { stepTwo: state } = values;
  const { updateValueOnstep } = action;
  const [selectedIndex, setSelectedIndex] = React.useState('0');

  const inputs: Input[] = [
    {
      label: 'Metode penuangan',
      isRequire: true,
      type: 'dropdown',
      value: state.method,
      isError: state.method ? false : true,
      customerErrorMsg: 'Metode penuangan harus dipilih',
      dropdown: {
        items: PO_METHOD_LIST,
        placeholder: 'Pilih metode penuangan',
        onChange: (value: any) => {
          onChange('method')(value);
        },
      },
    },
  ];

  const inputsSelection: Input[] = [
    {
      label: 'Volume',
      isRequire: true,
      type: 'quantity',
      value: state.products[selectedIndex].inputQuantity,
      onChange: (value: any) => {
        let allProducts = [];
        if (state.products && state.products.length > 0) {
          allProducts = state.products;
        }

        if (parseInt(value, 10) < allProducts[selectedIndex].quantity) {
          allProducts[selectedIndex].inputQuantity = value;
        } else if (value === '') {
          allProducts[selectedIndex].inputQuantity = 0;
        } else {
          allProducts[selectedIndex].inputQuantity =
            allProducts[selectedIndex].quantity.toString();
        }
        onChange('products')(allProducts);
      },
    },
  ];

  const {
    deliveryDate,
    deliveryTime,
    isConsecutive,
    hasTechnicalRequest,
    products,
    totalDeposit,
  } = state;

  const onChange = (key: string) => (val: any) => {
    updateValueOnstep('stepTwo', key, val);
  };

  const getTotalProduct = (): number => {
    let total = 0;
    if (products[selectedIndex] && products[selectedIndex].inputQuantity)
      total =
        parseInt(products[selectedIndex].inputQuantity, 10) *
        products[selectedIndex].offering_price;
    return total;
  };

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
    <View style={style.container}>
      <ScrollView style={style.flexFull}>
        <View style={style.inputContainer}>
          <View style={style.volumeContainer}>
            <Text style={style.inputLabel}>Tanggal Pengiriman</Text>
            <BTextInput
              onChange={(
                event: NativeSyntheticEvent<TextInputChangeEventData>
              ) => {
                onChange('deliveryDate')(event.nativeEvent.text);
              }}
              value={deliveryDate}
              returnKeyType="next"
              placeholder="Pilih tanggal"
              placeholderTextColor={colors.textInput.placeHolder}
            />
            {!deliveryDate && (
              <BText size="small" color="primary" bold="100">
                Tanggal harus dipilih
              </BText>
            )}
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={style.sellPriceContainer}>
            <Text style={style.inputLabel}>Jam Pengiriman</Text>
            <BTextInput
              onChange={(
                event: NativeSyntheticEvent<TextInputChangeEventData>
              ) => {
                onChange('deliveryTime')(event.nativeEvent.text);
              }}
              value={deliveryTime}
              placeholder="Pilih jam"
              placeholderTextColor={colors.textInput.placeHolder}
            />
            {!deliveryTime && (
              <BText size="small" color="primary" bold="100">
                Jam harus dipilih
              </BText>
            )}
          </View>
        </View>
        <BSpacer size={'extraSmall'} />
        <BForm titleBold="500" inputs={inputs} spacer="extraSmall" />
        <View style={style.summaryContainer}>
          <View style={style.consecutiveCheck}>
            <CheckBox
              value={isConsecutive}
              onFillColor={colors.primary}
              onTintColor={colors.offCheckbox}
              onCheckColor={colors.primary}
              tintColors={{ true: colors.primary, false: colors.offCheckbox }}
              onValueChange={(value) => {
                onChange('isConsecutive')(value);
              }}
            />
            <Text style={style.summary}>Konsekutif?</Text>
          </View>
          <View style={style.technicalCheck}>
            <CheckBox
              value={hasTechnicalRequest}
              onFillColor={colors.primary}
              onTintColor={colors.offCheckbox}
              onCheckColor={colors.primary}
              tintColors={{ true: colors.primary, false: colors.offCheckbox }}
              onValueChange={(value) => {
                onChange('hasTechnicalRequest')(value);
              }}
            />
            <Text style={style.summary}>Request Teknisi?</Text>
          </View>
        </View>
        <BSpacer size={'extraSmall'} />
        {products && products.length > 0 && (
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
        )}
      </ScrollView>

      <View>
        <BSpacer size={'extraSmall'} />
        <BDivider />
        <BSpacer size={'verySmall'} />
        <BDepositCard
          style={{ marginBottom: layout.pad.xl }}
          firstSectionText={'Deposit'}
          firstSectionValue={totalDeposit}
          secondSectionText={
            products && products.length > 0
              ? products[selectedIndex].display_name
              : '-'
          }
          secondSectionValue={getTotalProduct()}
          thirdSectionText={'Est. Sisa Deposit'}
        />
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  flexFull: {
    flex: 1,
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
  consecutiveCheck: { flexDirection: 'row', alignItems: 'center' },
  technicalCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: layout.pad.md,
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
  container: {
    flex: 1,
    marginTop: layout.pad.md,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
  volumeContainer: {
    width: '45%',
  },
  sellPriceContainer: {
    width: '50%',
  },
  summary: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
  },
  fontw400: {
    fontFamily: fonts.family.montserrat[400],
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.md,
  },
});
