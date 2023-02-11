import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { useDispatch, useSelector } from 'react-redux';
import { Region } from 'react-native-maps';

import { updateRegion } from '@/redux/reducers/locationReducer';
import { RootState } from '@/redux/store';
import {
  BBackContinueBtn,
  BBottomSheetForm,
  BLocation,
  BLocationDetail,
  BMarker,
  BText,
} from '@/components';
import { colors, fonts, layout } from '@/constants';
import { resScale } from '@/utils';
import { Input, SphStateInterface } from '@/interfaces';
import { SphContext } from '../context/SphContext';
import { useNavigation } from '@react-navigation/native';
import { getLocationCoordinates } from '@/actions/CommonActions';
import { useMachine } from '@xstate/react';
import { deviceLocationMachine } from '@/machine/modules';
import { SEARCH_AREA, SPH } from '@/navigation/ScreenNames';
import { fetchAddressSuggestion } from '@/redux/async-thunks/commonThunks';
import { useKeyboardActive } from '@/hooks';

function checkObj(obj: SphStateInterface) {
  const billingAddressFilled =
    Object.values(obj.billingAddress).every((val) => val) &&
    Object.entries(obj.billingAddress.addressAutoComplete).length > 1;

  const billingAddressSame = obj.isBillingAddressSame;
  const distanceFilled = obj.distanceFromLegok !== null;

  return (billingAddressFilled || billingAddressSame) && distanceFilled;
}

function LeftIcon() {
  return <Text style={style.leftIconStyle}>+62</Text>;
}
//'shippingAddress.event'
// 'billingAddress.event'
const eventKeyObj = {
  shipp: 'shippingAddress.event',
  billing: 'billingAddress.event',
};

export default function SecondStep() {
  const navigation = useNavigation();
  const { region } = useSelector((state: RootState) => state.location);
  const [sheetIndex] = useState(0); //setSheetIndex
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [sheetSnapPoints, setSheetSnapPoints] = useState(['60%', '90%']);
  const dispatch = useDispatch();
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const { keyboardVisible } = useKeyboardActive();

  // async function getSuggestion(search: string) {
  //   try {
  //     const response = await dispatch(
  //       fetchAddressSuggestion({ search, page: 1 })
  //     ).unwrap();
  //     setAddressSuggestions(response.data);
  //   } catch (error) {
  //     console.log(error, 'errorfetchAddressSuggestion');
  //   }
  // }

  const getSuggestion = useCallback(async (search: string) => {
    try {
      setIsSuggestionLoading(true);
      const response = await dispatch(
        fetchAddressSuggestion({ search, page: 1 })
      ).unwrap();
      const nameToTile = response.data.map((data) => {
        return {
          id: data.id,
          title: data.name,
        };
      });
      setAddressSuggestions(nameToTile);
      setIsSuggestionLoading(false);
    } catch (error) {
      setIsSuggestionLoading(false);
      setAddressSuggestions([]);
      console.log(error, 'errorfetchAddressSuggestion');
    }
  }, []);

  const [isMapLoading, setIsMapLoading] = useState(false);

  const [sphState, stateUpdate, setCurrentPosition] = useContext(SphContext);
  const onChangeRegion = useCallback(
    async (coordinate: Region, isBiilingAddress?: boolean) => {
      try {
        setIsMapLoading(() => true);
        const { data } = await getLocationCoordinates(
          // '',
          coordinate.longitude as unknown as number,
          coordinate.latitude as unknown as number,
          'BP-LEGOK'
        );
        const { result } = data;
        if (!result) {
          throw data;
        }
        console.log(result, 'resultOnChange71secondstep');

        const _coordinate = {
          latitude: result?.lat,
          longitude: result?.lon,
          formattedAddress: result?.formattedAddress,
          postalId: result?.PostalId,
        };

        if (typeof result?.lon === 'string') {
          _coordinate.longitude = Number(result.lon);
          _coordinate.lon = Number(result.lon);
        }

        if (typeof result?.lat === 'string') {
          _coordinate.latitude = Number(result.lat);
          _coordinate.lat = Number(result.lat);
        }
        if (isBiilingAddress) {
          stateUpdate('billingAddress')({
            ...sphState?.billingAddress,
            addressAutoComplete: _coordinate,
          });
        } else {
          stateUpdate('distanceFromLegok')(result.distance.value);
          dispatch(updateRegion(_coordinate));
        }
        setIsMapLoading(() => false);
      } catch (error) {
        setIsMapLoading(() => false);
        console.log(JSON.stringify(error), 'onChangeRegionerror');
      }
    },
    [sphState?.billingAddress]
  );

  const [, send] = useMachine(deviceLocationMachine, {
    actions: {
      dispatchState: (context, _event, _meta) => {
        const coordinate = {
          longitude: context?.lon,
          latitude: context?.lat,
          formattedAddress: context?.formattedAddress,
          postalId: context?.PostalId,
        };
        console.log(context, 'contextmachince');
        stateUpdate('distanceFromLegok')(context?.distance?.value);
        // updateValueOnstep('stepOne', 'createdLocation', context);
        if (region.latitude === 0) {
          dispatch(updateRegion(coordinate));
        }
      },
    },
  });
  const inputsData: Input[] = useMemo(() => {
    const phoneNumberRegex = /^(?:0[0-9]{9,10}|[1-9][0-9]{7,11})$/;

    if (sphState?.isBillingAddressSame) {
      setSheetSnapPoints(['40%']);
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
    setSheetSnapPoints(['60%', '90%']);

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
        isError: !sphState?.billingAddress?.name,
        type: 'textInput',
        onChange: (event: any) => {
          if (stateUpdate && sphState) {
            stateUpdate('billingAddress')({
              ...sphState?.billingAddress,
              name: event.nativeEvent.text,
            });
          }
        },
        value: sphState?.billingAddress?.name,
      },
      {
        label: 'No. Telepon',
        isRequire: true,
        isError: !phoneNumberRegex.test(`${sphState.billingAddress.phone}`),
        type: 'textInput',
        onChange: (event: any) => {
          if (stateUpdate && sphState) {
            stateUpdate('billingAddress')({
              ...sphState?.billingAddress,
              phone: event.nativeEvent.text,
            });
          }
        },
        value: sphState.billingAddress.phone,
        keyboardType: 'numeric',
        customerErrorMsg: 'No. Telepon Harus diisi sesuai format',
        LeftIcon: LeftIcon,
      },
      {
        label: 'Cari Alamat',
        isRequire: true,
        isError: true,
        type: 'textInput',
        onChange: (text: string) => {
          getSuggestion(text);
        },
        items: sphState?.billingAddress?.addressAutoComplete
          ? [
              ...addressSuggestions,
              sphState?.billingAddress?.addressAutoComplete,
            ]
          : addressSuggestions,
        value: sphState?.billingAddress?.addressAutoComplete
          ? sphState?.billingAddress?.addressAutoComplete?.formattedAddress
          : '',
        // loading: isSuggestionLoading,
        placeholder: 'Cari Kelurahan, Kecamatan, Kota',
        textInputAsButton: true,
        textInputAsButtonOnPress: () => {
          navigation.navigate(SEARCH_AREA, {
            from: SPH,
            eventKey: eventKeyObj.billing,
          });
        },
      },
      {
        label: 'Alamat Lengkap',
        isRequire: true,
        isError: !sphState.billingAddress.fullAddress,
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
  }, [sphState, stateUpdate, addressSuggestions, isSuggestionLoading]);

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

  useEffect(() => {
    send('askingPermission');
    DeviceEventEmitter.addListener(eventKeyObj.shipp, (data) => {
      onChangeRegion(data.coordinate);
    });
    DeviceEventEmitter.addListener(eventKeyObj.billing, (data) => {
      console.log(data, 'listener billing');
      onChangeRegion(data.coordinate, true);
    });
    return () => {
      DeviceEventEmitter.removeAllListeners(eventKeyObj.shipp);
      DeviceEventEmitter.removeAllListeners(eventKeyObj.billing);
    };
  }, [onChangeRegion]);

  useEffect(() => {
    stateUpdate('projectAddress')(region);
  }, [region]);

  useEffect(() => {
    if (keyboardVisible) {
      bottomSheetRef.current?.expand();
    }
  }, [keyboardVisible]);

  const nameAddress = React.useMemo(() => {
    const idx = region.formattedAddress?.split(',');
    if (idx?.length > 1) {
      return idx?.[0];
    }

    return 'Nama Alamat';
  }, [region.formattedAddress]);

  return (
    <View style={style.container}>
      <View style={style.blocationcontainer}>
        <BLocation
          region={region}
          onRegionChangeComplete={onChangeRegion}
          CustomMarker={<BMarker />}
          mapStyle={style.map}
        />
      </View>
      <View style={{ flex: 0.5 }} />
      <BBottomSheetForm
        enableClose={false}
        inputs={inputsData}
        buttonTitle={'Lanjut'}
        onAdd={() => {
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
        <>
          <Text style={style.titleText}>Alamat pengiriman</Text>
          <View style={style.customPadding} />
          <BLocationDetail
            onPress={() => {
              navigation.navigate(SEARCH_AREA, {
                from: SPH,
                eventKey: eventKeyObj.shipp,
              });
            }}
            nameAddress={nameAddress}
            formattedAddress={region.formattedAddress}
            isLoading={isMapLoading}
          />
        </>
      </BBottomSheetForm>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: layout.pad.md,
  },
  titleText: {
    fontFamily: fonts.family.montserrat['500'],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
  customPadding: {
    padding: resScale(2),
  },
  map: {
    height: resScale(450),
    width: '100%',
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
  leftIconStyle: {
    fontFamily: fonts.family.montserrat['400'],
    fontSize: fonts.size.md,
    color: colors.textInput.input,
  },
  blocationcontainer: {
    flex: 1,
  },
});
