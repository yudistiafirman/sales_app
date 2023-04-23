import React, { useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter,
  Platform,
} from 'react-native';
import {
  BDivider,
  BForm,
  BLabel,
  BSpacer,
  BText,
  BTextInput,
} from '@/components';
import { Competitor, Input } from '@/interfaces';
import {
  MONTH_LIST,
  STAGE_PROJECT,
  TYPE_PROJECT,
  WEEK_LIST,
} from '@/constants/dropdown';
import ProductChip from './ProductChip';
import { RadioButton, TextInput } from 'react-native-paper';
import { resScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import {
  ALL_PRODUCT,
  CREATE_VISITATION,
  SEARCH_PRODUCT,
} from '@/navigation/ScreenNames';
import { colors, fonts, layout } from '@/constants';
import crashlytics from '@react-native-firebase/crashlytics';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateDataVisitation } from '@/redux/reducers/VisitationReducer';

const cbd = require('@/assets/icon/Visitation/cbd.png');
const credit = require('@/assets/icon/Visitation/credit.png');

const ThirdStep = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const visitationData = useSelector((state: RootState) => state.visitation);

  const onChange = (key: any) => (e: any) => {
    dispatch(
      updateDataVisitation({
        type: key,
        value: e,
      })
    );
  };

  const onChangeCompetitor = (key: keyof Competitor) => (text: string) => {
    let current: Competitor = { ...visitationData.currentCompetitor };
    current = {
      ...current,
      [key]: text,
    };
    dispatch(
      updateDataVisitation({
        type: 'currentCompetitor',
        value: current,
      })
    );
  };

  const inputs: Input[] = [
    {
      label: 'Fase Proyek',
      isRequire: true,
      isError: false,
      onChange: onChange('stageProject'),
      type: 'dropdown',
      dropdown: {
        items: STAGE_PROJECT,
        placeholder: visitationData.stageProject
          ? STAGE_PROJECT.find((it) => {
              return it.value === visitationData.stageProject;
            })?.label ?? ''
          : 'Fase Proyek',
        onChange: (value: any) => {
          onChange('stageProject')(value);
        },
      },
    },
    {
      label: 'Tipe Proyek',
      isRequire: false,
      isError: false,
      onChange: onChange('typeProject'),
      type: 'dropdown',
      dropdown: {
        items: TYPE_PROJECT,
        placeholder: visitationData.typeProject
          ? TYPE_PROJECT.find((it) => {
              return it.value === visitationData.typeProject;
            })?.label ?? ''
          : 'Tipe Proyek',
        onChange: (value: any) => {
          onChange('typeProject')(value);
        },
      },
    },
  ];

  const inputsTwo: Input[] = [
    {
      label: 'Estimasi Waktu Dibutuhkannya Barang',
      isRequire: true,
      type: 'comboDropdown',
      // onChange: onChange('estimationDate'),
      value: visitationData.estimationDate,
      comboDropdown: {
        itemsOne: WEEK_LIST,
        itemsTwo: MONTH_LIST,
        valueOne: visitationData.estimationDate?.estimationWeek,
        valueTwo: visitationData.estimationDate?.estimationMonth,
        onChangeOne: (value: any) => {
          const estimateionDate = {
            ...visitationData.estimationDate,
          };
          estimateionDate.estimationWeek = value;
          dispatch(
            updateDataVisitation({
              type: 'estimationDate',
              value: estimateionDate,
            })
          );
        },
        onChangeTwo: (value: any) => {
          const estimateionDate = {
            ...visitationData.estimationDate,
          };
          estimateionDate.estimationMonth = value;
          dispatch(
            updateDataVisitation({
              type: 'estimationDate',
              value: estimateionDate,
            })
          );
        },
        placeholderOne: 'Pilih Minggu',
        placeholderTwo: 'Pilih Bulan',
        errorMessageOne: 'Pilih minggu',
        errorMessageTwo: 'Pilih bulan',
        isErrorOne: false,
        isErrorTwo: false,
      },
    },
    {
      label: 'Tipe Pembayaran',
      isRequire: true,
      isError: false,
      type: 'cardOption',
      onChange: onChange('paymentType'),
      value: visitationData.paymentType,
      options: [
        {
          title: 'Cash Before Delivery',
          icon: cbd,
          value: 'CBD',
          onChange: () => {
            onChange('paymentType')('CBD');
          },
        },
        {
          title: 'Credit',
          icon: credit,
          value: 'CREDIT',
          onChange: () => {
            onChange('paymentType')('CREDIT');
          },
        },
      ],
    },
    {
      label: 'Catatan Sales',
      isRequire: false,
      isError: false,
      type: 'area',
      placeholder: 'Tulis catatan di sini',
      onChange: onChange('notes'),
      value: visitationData.notes,
    },
  ];

  const inputsThree: Input[] = [
    {
      label: 'Nama Pesaing / Kompetisi',
      isRequire: true,
      isError: false,
      type: 'textInput',
      placeholder: 'Nama pesaing',
      onChange: (event) => {
        onChangeCompetitor('name')(event.nativeEvent.text);
      },
      value: visitationData.currentCompetitor.name,
    },
  ];

  const inputsFour: Input[] = [
    {
      label: 'Apakah ada masalah yang ditemukan dari supplier beton sekarang?',
      isRequire: false,
      isError: false,
      type: 'area',
      placeholder: 'Tulis masalah yang Anda temui',
      onChange: (event) => {
        onChangeCompetitor('problem')(event.nativeEvent.text);
      },
      value: visitationData.currentCompetitor.problem,
    },
    {
      label: 'Apakah ada masalah yang ditemukan dari supplier beton sekarang?',
      isRequire: false,
      isError: false,
      type: 'area',
      placeholder: 'Tulis harapan Anda',
      onChange: (event) => {
        onChangeCompetitor('hope')(event.nativeEvent.text);
      },
      value: visitationData.currentCompetitor.hope,
    },
  ];

  const listenerCallback = useCallback(
    ({ data }: { data: any }) => {
      const newArray = [...visitationData.products, data];
      const uniqueArray = newArray.reduce((acc, obj) => {
        if (!acc[obj.id]) {
          acc[obj.id] = obj;
        }
        return acc;
      }, {} as { [id: number]: any });
      dispatch(
        updateDataVisitation({
          type: 'products',
          value: Object.values(uniqueArray),
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visitationData.products]
  );

  const deleteProduct = (index: number) => {
    const products = visitationData.products;
    const restProducts = products.filter((o, i) => index !== i);
    dispatch(
      updateDataVisitation({
        type: 'products',
        value: restProducts,
      })
    );
  };

  useEffect(() => {
    crashlytics().log(CREATE_VISITATION + '-Step3');
    DeviceEventEmitter.addListener('event.testEvent', listenerCallback);
    return () => {
      DeviceEventEmitter.removeAllListeners('event.testEvent');
    };
  }, [
    listenerCallback,
    visitationData.stageProject,
    visitationData.typeProject,
    visitationData.currentCompetitor,
  ]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* <BText>step 3</BText> */}
      <BForm titleBold="500" inputs={inputs} />
      <TouchableOpacity
        onPress={() => {
          const coordinate = {
            longitude:
              visitationData.locationAddress.lon !== 0
                ? Number(visitationData.locationAddress?.lon)
                : Number(visitationData.createdLocation?.lon),
            latitude:
              visitationData.locationAddress.lat !== 0
                ? Number(visitationData.locationAddress?.lat)
                : Number(visitationData.createdLocation?.lat),
          };
          navigation.navigate(ALL_PRODUCT, {
            coordinate: coordinate,
            from: CREATE_VISITATION,
          });
        }}
        style={[
          styles.labelContainer,
          Platform.OS !== 'android' && { zIndex: -1 },
        ]}
      >
        <BLabel bold="500" label="Produk" isRequired />
        <BText bold="500" color="primary">
          Lihat Semua
        </BText>
      </TouchableOpacity>
      <View
        style={[
          styles.posRelative,
          Platform.OS !== 'android' && { zIndex: -1 },
        ]}
      >
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => {
            const distance = visitationData.locationAddress?.distance?.value
              ? visitationData.locationAddress?.distance?.value
              : visitationData.createdLocation?.distance?.value;
            navigation.navigate(SEARCH_PRODUCT, {
              isGobackAfterPress: true,
              distance: distance,
            });
          }}
        />
        <BTextInput
          placeholder="Cari Produk"
          left={<TextInput.Icon forceTextInputFocus={false} icon={'magnify'} />}
        />
      </View>
      <BSpacer size={'extraSmall'} />
      {visitationData.products?.length ? (
        <>
          <ScrollView
            horizontal={true}
            style={Platform.OS !== 'android' && { zIndex: -1 }}
          >
            {visitationData.products?.map((val, index) => (
              <React.Fragment key={index}>
                <ProductChip
                  name={val.display_name}
                  category={val.Category}
                  onDelete={() => deleteProduct(index)}
                />
                <BSpacer size="extraSmall" />
              </React.Fragment>
            ))}
          </ScrollView>
          <BSpacer size="medium" />
        </>
      ) : (
        <BSpacer size="extraSmall" />
      )}
      <BForm titleBold="500" inputs={inputsTwo} />
      <BSpacer size={'verySmall'} />
      <BDivider />
      <BSpacer size={'small'} />
      <BForm titleBold="500" inputs={inputsThree} />
      <BLabel
        isRequired
        bold={'500'}
        label={'Apakah sudah memiliki PKS / MOU?'}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RadioButton
            value={'Iya'}
            status={
              visitationData.currentCompetitor &&
              visitationData.currentCompetitor.mou?.toLowerCase() === 'iya'
                ? 'checked'
                : 'unchecked'
            }
            color={colors.primary}
            uncheckedColor={colors.border.altGrey}
            onPress={() => onChangeCompetitor('mou')('Iya')}
          />
          <BText>{'Iya'}</BText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginStart: layout.pad.xxl,
          }}
        >
          <RadioButton
            value={'Tidak'}
            status={
              visitationData.currentCompetitor &&
              visitationData.currentCompetitor.mou?.toLowerCase() === 'tidak'
                ? 'checked'
                : 'unchecked'
            }
            color={colors.primary}
            uncheckedColor={colors.border.altGrey}
            onPress={() => onChangeCompetitor('mou')('Tidak')}
          />
          <BText>{'Tidak'}</BText>
        </View>
      </View>
      <BSpacer size={'extraSmall'} />
      <BLabel isRequired bold={'500'} label={'Apakah PKS nya ekslusif?'} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RadioButton
            value={'Iya'}
            status={
              visitationData.currentCompetitor &&
              visitationData.currentCompetitor.exclusive?.toLowerCase() ===
                'iya'
                ? 'checked'
                : 'unchecked'
            }
            color={colors.primary}
            uncheckedColor={colors.border.altGrey}
            onPress={() => onChangeCompetitor('exclusive')('Iya')}
          />
          <BText>{'Iya'}</BText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginStart: layout.pad.xxl,
          }}
        >
          <RadioButton
            value={'Tidak'}
            status={
              visitationData.currentCompetitor &&
              visitationData.currentCompetitor.exclusive?.toLowerCase() ===
                'tidak'
                ? 'checked'
                : 'unchecked'
            }
            color={colors.primary}
            uncheckedColor={colors.border.altGrey}
            onPress={() => onChangeCompetitor('exclusive')('Tidak')}
          />
          <BText>{'Tidak'}</BText>
        </View>
      </View>
      <BSpacer size={'extraSmall'} />
      <BForm titleBold="500" inputs={inputsFour} />
    </ScrollView>
  );
};

export default ThirdStep;

const styles = StyleSheet.create({
  posRelative: {
    position: 'relative',
    // backgroundColor: 'blue',
  },
  touchable: {
    position: 'absolute',
    width: '100%',
    borderRadius: resScale(4),
    height: resScale(45),
    zIndex: 2,
    // backgroundColor: 'red',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
