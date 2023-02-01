import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { Region } from 'react-native-maps';
import Feather from 'react-native-vector-icons/Feather';

import { updateRegion } from '@/redux/locationReducer';
import { RootState } from '@/redux/store';
import {
  BBackContinueBtn,
  BBottomSheetForm,
  BLocation,
  BMarker,
} from '@/components';
import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import { Input } from '@/interfaces';
import { SphContext } from '../context/SphContext';

function checkObj(obj?: { [key: string]: any }) {
  if (obj) {
    return (
      (Object.values(obj.billingAddress).every((val) => val) &&
        Object.entries(obj.billingAddress.addressAutoComplete).length > 1) ||
      obj.isBillingAddressSame
    );
  }
}

export default function SecondStep() {
  const { region } = useSelector((state: RootState) => state.location);
  const [sheetIndex] = useState(0); //setSheetIndex
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [sheetSnapPoints, setSheetSnapPoints] = useState(['35%', '75%']);
  const dispatch = useDispatch();

  const [sphState, stateUpdate, setCurrentPosition] = useContext(SphContext);

  const onChangeRegion = (coordinate: Region) => {
    dispatch(updateRegion(coordinate));
  };
  const inputsData: Input[] = useMemo(() => {
    console.log(
      'useMemo',
      'inputsData',
      'sphState?.isBillingAddressSame',
      sphState?.isBillingAddressSame
    );

    if (sphState?.isBillingAddressSame) {
      setSheetSnapPoints(['35%']);
      setTimeout(() => {
        bottomSheetRef.current?.collapse();
      }, 50);
      return [
        {
          label: 'Alamat penagihan sama dengan pengiriman',
          isRequire: false,
          type: 'switch',
          onChange: (val: boolean) => {
            if (stateUpdate) {
              stateUpdate('isBillingAddressSame')(val);
            }
          },
          value: sphState?.isBillingAddressSame,
        },
      ];
    }
    setSheetSnapPoints(['35%', '75%']);
    setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 50);
    return [
      {
        label: 'Alamat penagihan sama dengan pengiriman',
        isRequire: false,
        type: 'switch',
        onChange: (val: boolean) => {
          if (stateUpdate) {
            stateUpdate('isBillingAddressSame')(val);
          }
        },
        value: sphState?.isBillingAddressSame,
      },
      {
        label: 'Nama',
        isRequire: true,
        isError: true,
        type: 'textInput',
        onChange: (text: string) => {
          if (stateUpdate && sphState) {
            stateUpdate('billingAddress')({
              ...sphState?.billingAddress,
              name: text,
            });
          }
        },
        value: sphState?.billingAddress?.name,
      },
      {
        label: 'No. Telepon',
        isRequire: true,
        isError: true,
        type: 'textInput',
        onChange: (phone: string) => {
          if (stateUpdate && sphState) {
            stateUpdate('billingAddress')({
              ...sphState?.billingAddress,
              phone: phone,
            });
          }
        },
        value: sphState?.billingAddress?.phone,
      },
      {
        label: 'Cari Alamat',
        isRequire: true,
        isError: true,
        type: 'autocomplete',
        items: [
          {
            id: '1',
            title: 'PT Satu',
          },
          {
            id: '2',
            title: 'PT Dua',
          },
          {
            id: '3',
            title: 'PT Tiga',
          },
          {
            id: '4',
            title: 'PT Empat',
          },
        ],
        value: sphState?.billingAddress?.addressAutoComplete
          ? sphState?.billingAddress?.addressAutoComplete
          : {},
        loading: false,
        onSelect: (item: any) => {
          if (stateUpdate && sphState) {
            stateUpdate('billingAddress')({
              ...sphState?.billingAddress,
              addressAutoComplete: item ? item : {},
            });
          }
        },
      },
      {
        label: 'Alamat Lengkap',
        isRequire: true,
        isError: false,
        type: 'area',
        onChange: (text: string) => {
          if (stateUpdate && sphState) {
            stateUpdate('billingAddress')({
              ...sphState?.billingAddress,
              fullAddress: text,
            });
          }
        },
        value: sphState?.billingAddress?.fullAddress,
      },
    ];
  }, [sphState, stateUpdate]);

  const customFooterButton = useCallback(() => {
    return (
      <BBackContinueBtn
        onPressBack={() => {
          if (setCurrentPosition) {
            setCurrentPosition(0);
          }
        }}
        onPressContinue={() => {
          if (setCurrentPosition) {
            setCurrentPosition(2);
          }
        }}
        disableContinue={!checkObj(sphState)}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sphState]);

  return (
    <View style={style.container}>
      <BLocation
        region={region}
        onRegionChange={onChangeRegion}
        coordinate={region}
        CustomMarker={<BMarker />}
        isUninteractable={false}
      />
      <BBottomSheetForm
        enableClose={false}
        inputs={inputsData}
        buttonTitle={'Lanjut'}
        onAdd={() => {
          console.log('lanjut di pencet', checkObj(sphState));
          if (setCurrentPosition && checkObj(sphState)) {
            setCurrentPosition(2);
          }
        }}
        isButtonDisable={!checkObj(sphState)}
        snapPoint={sheetSnapPoints}
        ref={bottomSheetRef}
        initialIndex={sheetIndex}
        CustomFooterButton={customFooterButton}
      >
        <View
          style={{
            height: resScale(100),
          }}
        >
          <View style={style.detailCoordContainer}>
            <View style={style.mapIconContainer}>
              <Feather
                name="map-pin"
                size={resScale(20)}
                color={colors.primary}
              />
            </View>
            <View style={style.detailContainer}>
              <Text>{`latitude=${region.latitude}`}</Text>
              <Text>{`longitude=${region.longitude}`}</Text>
            </View>
          </View>
          {/* <CoordinatesDetail
            addressTitle={`latitude=${region.latitude}`}
            addressDetail={`longitude=${region.longitude}`}
            onPress={() => {
              console.log('di pencet');
            }}
          /> */}
        </View>
      </BBottomSheetForm>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: layout.pad.md,
    // marginBottom: 200,
  },
  mapIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flex: 0.1,
    // backgroundColor: 'red',
  },
  detailCoordContainer: {
    flex: 1,
    backgroundColor: colors.tertiary,
    borderRadius: 8,
    flexDirection: 'row',
    padding: layout.pad.md,
  },
  detailContainer: {
    flex: 0.75,
    justifyContent: 'center',
    // backgroundColor: 'blue',
  },
});
