import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputChangeEventData,
  View,
} from 'react-native';
import * as React from 'react';

import { colors, fonts, layout } from '@/constants';
import { useNavigation } from '@react-navigation/native';
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

function ListProduct(size: number, index: number, item: any) {
  return (
    <View key={item.product_id}>
      <BProductCard
        name={item.display_name}
        pricePerVol={item.offering_price}
        volume={item.quantity}
        totalPrice={item.total_price}
      />
      {size - 1 !== index && (
        <BDivider marginVertical={layout.pad.md} borderColor={colors.white} />
      )}
    </View>
  );
}

export default function SecondStep() {
  const navigation = useNavigation();
  const { values, action } = React.useContext(CreateScheduleContext);
  const { stepTwo: state } = values;
  const { updateValueOnstep } = action;

  const inputs: Input[] = [
    {
      label: 'Pilih metode penuangan',
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

  return (
    <View style={style.container}>
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
      <BForm titleBold="500" inputs={inputs} />
      <View style={style.summaryContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginEnd: layout.pad.md,
          }}
        >
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
      {products && products.length > 0 && (
        <>
          <BSpacer size={'extraSmall'} />
          <Text style={style.partText}>Produk</Text>
          <BSpacer size={'verySmall'} />
          <View>
            <BDivider />
            <BSpacer size={'small'} />
            {products.map((item, index) =>
              ListProduct(products.length, index, item)
            )}
          </View>
        </>
      )}

      <BDivider />
      <BSpacer size={'verySmall'} />
      <BDepositCard
        style={{ marginBottom: layout.pad.xl }}
        firstSectionText={'Deposit'}
        firstSectionValue={totalDeposit}
        secondSectionText={
          products && products.length > 0 ? products[0].display_name : '-'
        }
        secondSectionValue={
          totalDeposit -
          products
            .map((item) => item.total_price)
            .reduce((prev, next) => prev + next)
        }
        thirdSectionText={'Est. Sisa Deposit'}
      />
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: layout.pad.md,
  },
  hargaText: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
    color: colors.text.darker,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
  },
  textIcon: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
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
