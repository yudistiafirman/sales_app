import {
  DeviceEventEmitter,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
} from '@/components';
import { colors, fonts, layout } from '@/constants';
import { resScale } from '@/utils';
import { billingAddressType, Input } from '@/interfaces';
import { SphContext } from '../context/SphContext';
import { useNavigation } from '@react-navigation/native';
import { getLocationCoordinates } from '@/actions/CommonActions';
import { SEARCH_AREA, SPH } from '@/navigation/ScreenNames';
import { useKeyboardActive } from '@/hooks';
import { TextInput } from 'react-native-paper';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  setSearchAddress,
  setSearchedBillingAddress,
  setStepperFocused,
  setUseBillingAddress,
  setUseSearchAddress,
  updateBillingAddressAutoComplete,
  updateBillingAddressOptions,
  updateDistanceFromLegok,
  updateIsBillingAddressSame,
  updateProjectAddress,
} from '@/redux/reducers/SphReducer';
import { openPopUp } from '@/redux/reducers/modalReducer';

function checkObj(
  billingAddress: billingAddressType,
  isBillingAddressSame: boolean,
  distanceFromLegok: number | null
) {
  const billingAddressFilled =
    Object.values(billingAddress).every((val) => val) &&
    Object.entries(billingAddress.addressAutoComplete).length > 1;

  const billingAddressSame = isBillingAddressSame;
  const distanceFilled = distanceFromLegok !== null;

  return (billingAddressFilled || billingAddressSame) && distanceFilled;
}

function LeftIcon() {
  return <Text style={style.leftIconStyle}>+62</Text>;
}
function SearchIcon() {
  return (
    <TextInput.Icon
      style={[
        Platform.OS === 'android'
          ? { marginTop: -layout.pad.ml, marginStart: -layout.pad.sm }
          : { marginTop: -layout.pad.sm, marginStart: -layout.pad.sm },
      ]}
      forceTextInputFocus={false}
      icon="magnify"
    />
  );
}

const eventKeyObj = {
  shipp: 'shippingAddress.event',
  billing: 'billingAddress.event',
};

export default function SecondStep() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { region } = useSelector((state: RootState) => state.location);
  const [sheetIndex] = useState(0); //setSheetIndex
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [sheetSnapPoints, setSheetSnapPoints] = useState(['60%', '90%']);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const { keyboardVisible } = useKeyboardActive();
  const {
    billingAddress,
    isBillingAddressSame,
    distanceFromLegok,
    projectAddress,
    selectedCompany,
    useSearchAddress,
    searchedAddress,
    searchedBillingAddress,
    useSearchedBillingAddress,
  } = useSelector((state: RootState) => state.sph);

  const [isMapLoading, setIsMapLoading] = useState(false);

  const [, stateUpdate, setCurrentPosition] = useContext(SphContext);
  const onChangeRegion = useCallback(
    async (
      coordinate: Region,
      { isBiilingAddress }: { isBiilingAddress?: boolean }
    ) => {
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
          dispatch(updateBillingAddressAutoComplete(_coordinate));
        } else {
          if (result.distance) {
            dispatch(updateDistanceFromLegok(result.distance.value));
          }
          dispatch(updateRegion(_coordinate));
        }
        setIsMapLoading(() => false);
      } catch (error) {
        setIsMapLoading(() => false);
        dispatch(
          openPopUp({
            popUpType: 'error',
            popUpText:
              error.message ||
              'Terjadi error pengambilan data saat perpindahan region',
            outsideClickClosePopUp: true,
          })
        );
      }
    },
    []
  );

  const inputsData: Input[] = useMemo(() => {
    const phoneNumberRegex = /^(?:0[0-9]{9,10}|[1-9][0-9]{7,11})$/;

    if (isBillingAddressSame) {
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
            dispatch(updateIsBillingAddressSame(val));
          },
          value: isBillingAddressSame,
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
          dispatch(updateIsBillingAddressSame(val));
        },
        value: isBillingAddressSame,
      },
      {
        label: 'Nama',
        isRequire: true,
        isError: !billingAddress?.name,
        type: 'textInput',
        onChange: (event: any) => {
          const text: string = event.nativeEvent.text;
          dispatch(updateBillingAddressOptions({ value: text, key: 'name' }));
        },
        value: billingAddress?.name,
        placeholder: 'Masukkan nama',
      },
      {
        label: 'No. Telepon',
        isRequire: true,
        isError: !phoneNumberRegex.test(`${billingAddress.phone}`),
        type: 'textInput',
        onChange: (event: any) => {
          const text: string = event.nativeEvent.text;
          dispatch(updateBillingAddressOptions({ value: text, key: 'phone' }));
        },
        value: billingAddress.phone,
        keyboardType: 'numeric',
        placeholder: 'Masukkan nomor telepon',
        customerErrorMsg: 'No. Telepon harus diisi sesuai format',
        LeftIcon: billingAddress.phone ? LeftIcon : undefined,
      },
      {
        label: 'Cari Alamat',
        isRequire: true,
        isError: billingAddress?.addressAutoComplete
          ? !billingAddress?.addressAutoComplete?.formattedAddress
          : true,
        type: 'area',
        value: useSearchedBillingAddress
          ? searchedBillingAddress
          : billingAddress?.addressAutoComplete
          ? billingAddress?.addressAutoComplete?.formattedAddress
          : '',
        placeholder: 'Cari Kelurahan, Kecamatan, Kota',
        textInputAsButton: true,
        textInputAsButtonOnPress: () => {
          navigation.navigate(SEARCH_AREA, {
            from: SPH,
            eventKey: eventKeyObj.billing,
          });
        },
        LeftIcon: SearchIcon,
      },
      {
        label: 'Alamat Lengkap',
        isRequire: true,
        isError: !billingAddress.fullAddress,
        type: 'area',
        onChange: (text: string) => {
          dispatch(
            updateBillingAddressOptions({ value: text, key: 'fullAddress' })
          );
        },
        value: billingAddress?.fullAddress,
        placeholder: 'Masukkan alamat lengkap',
      },
    ];
  }, [
    billingAddress,
    isBillingAddressSame,
    addressSuggestions,
    isSuggestionLoading,
  ]);

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
            dispatch(setStepperFocused(2));
            setCurrentPosition(2);
          }
        }}
        disableContinue={
          !checkObj(billingAddress, isBillingAddressSame, distanceFromLegok)
        }
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingAddress, isBillingAddressSame, distanceFromLegok]);

  useEffect(() => {
    crashlytics().log(SPH + '-Step2');

    DeviceEventEmitter.addListener(eventKeyObj.shipp, (data) => {
      dispatch(setUseSearchAddress({ value: true }));
      dispatch(setSearchAddress({ value: data.coordinate.formattedAddress }));
      onChangeRegion(data.coordinate, {});
    });
    DeviceEventEmitter.addListener(eventKeyObj.billing, (data) => {
      dispatch(setUseBillingAddress({ value: true }));
      dispatch(
        setSearchedBillingAddress({ value: data.coordinate.formattedAddress })
      );
      onChangeRegion(data.coordinate, { isBiilingAddress: true });
    });
    return () => {
      DeviceEventEmitter.removeAllListeners(eventKeyObj.shipp);
      DeviceEventEmitter.removeAllListeners(eventKeyObj.billing);
    };
  }, [onChangeRegion]);

  useEffect(() => {
    dispatch(updateProjectAddress(region));
  }, [region]);

  useEffect(() => {
    if (keyboardVisible) {
      bottomSheetRef.current?.expand();
    }
  }, [keyboardVisible]);

  useEffect(() => {
    if (projectAddress) {
      const latitude = +projectAddress.latitude;
      const longitude = +projectAddress.longitude;
      onChangeRegion({ latitude, longitude }, {});
    } else if (selectedCompany) {
      if (selectedCompany.LocationAddress) {
        const latitude = +selectedCompany.LocationAddress.lat;
        const longitude = +selectedCompany.LocationAddress.lon;
        onChangeRegion({ latitude, longitude }, {});
      }
    }
  }, []);

  const nameAddress = React.useMemo(() => {
    const address = useSearchAddress
      ? searchedAddress
      : region.formattedAddress;
    const idx = address?.split(',');
    if (idx?.length > 1) {
      return idx?.[0];
    }

    return 'Nama Alamat';
  }, [region.formattedAddress]);

  return (
    <View style={style.container}>
      <BLocation
        region={region}
        onRegionChange={() => {
          dispatch(setUseSearchAddress({ value: false }));
          dispatch(setUseBillingAddress({ value: false }));
        }}
        onRegionChangeComplete={onChangeRegion}
        CustomMarker={<BMarker />}
        mapStyle={style.map}
      />
      <View style={{ flex: 0.5 }} />
      <BBottomSheetForm
        enableClose={false}
        inputs={inputsData}
        buttonTitle={'Lanjut'}
        onAdd={() => {
          if (
            setCurrentPosition &&
            checkObj(billingAddress, isBillingAddressSame, distanceFromLegok)
          ) {
            setCurrentPosition(2);
          }
        }}
        isButtonDisable={
          !checkObj(billingAddress, isBillingAddressSame, distanceFromLegok)
        }
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
            formattedAddress={
              useSearchAddress ? searchedAddress : region.formattedAddress
            }
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
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
  customPadding: {
    padding: layout.pad.xs,
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
  },
  detailCoordContainer: {
    flex: 1,
    backgroundColor: colors.tertiary,
    borderRadius: layout.radius.md,
    flexDirection: 'row',
    padding: layout.pad.md,
  },
  detailContainer: {
    flex: 0.75,
    justifyContent: 'center',
  },
  leftIconStyle: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
    color: colors.textInput.input,
  },
  blocationcontainer: {
    flex: 0.5,
  },
});
