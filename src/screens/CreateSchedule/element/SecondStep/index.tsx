import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
} from '@/components';
import { Input } from '@/interfaces';
import { PO_METHOD_LIST } from '@/constants/dropdown';
import CheckBox from '@react-native-community/checkbox';
import { RadioButton } from 'react-native-paper';
import moment from 'moment';

export default function SecondStep() {
  const { values, action } = React.useContext(CreateScheduleContext);
  const { stepTwo: state } = values;
  const { updateValueOnstep } = action;
  const [selectedIndex, setSelectedIndex] = React.useState('0');
  const [isVisibleCalendar, setVisibleCalendar] = React.useState(false);
  const [isVisibleTimePicker, setVisibleTimePicker] = React.useState(false);
  const [rawTime, setRawTime] = React.useState(undefined);

  const inputs: Input[] = [
    {
      isRequire: true,
      type: 'calendar-time',
      calendarTime: {
        onDayPress: (value: any) => {
          const date = moment(value.dateString).format('DD/MM/yyyy');
          onChange('deliveryDate')(date);
        },
        isCalendarVisible: isVisibleCalendar,
        setCalendarVisible: (flag: boolean) => {
          setVisibleCalendar(flag);
        },
        onTimeChange: (value: any) => {
          const time = moment(value)
            .utcOffset(value.getTimezoneOffset() / 60)
            .format('HH:mm');
          setRawTime(value);
          onChange('deliveryTime')(time);
        },
        isTimeVisible: isVisibleTimePicker,
        setTimeVisible: (flag: boolean) => {
          setVisibleTimePicker(flag);
        },
        labelOne: 'Tanggal Pengiriman',
        labelTwo: 'Jam Pengiriman',
        placeholderOne: 'Pilih tanggal',
        placeholderTwo: 'Pilih jam',
        errMsgOne: 'Tanggal harus dipilih',
        errMsgTwo: 'Jam harus dipilih',
        valueOne: state.deliveryDate,
        valueTwo: state.deliveryTime,
        valueTwoMock: rawTime,
        isErrorOne: state.deliveryDate ? false : true,
        isErrorTwo: state.deliveryTime ? false : true,
      },
    },
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

  const { isConsecutive, hasTechnicalRequest, products, totalDeposit } = state;

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
  summary: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
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
