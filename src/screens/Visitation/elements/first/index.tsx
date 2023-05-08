import * as React from 'react';
import { DeviceEventEmitter, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';
import debounce from 'lodash.debounce';

import {
  BBottomSheet,
  BContainer,
  BForm,
  BLabel,
  BLocation,
  BLocationDetail,
  BMarker,
  BSpacer,
  BText,
} from '@/components';
import Icons from 'react-native-vector-icons/Feather';

import { resScale } from '@/utils';
import { Region, Input } from '@/interfaces';
import { updateRegion } from '@/redux/reducers/locationReducer';
import { layout } from '@/constants';
import { getLocationCoordinates } from '@/actions/CommonActions';
import { CREATE_VISITATION, SEARCH_AREA } from '@/navigation/ScreenNames';
// import crashlytics from '@react-native-firebase/crashlytics';
import {
  setSearchedAddress,
  setUseSearchedAddress,
  updateDataVisitation,
} from '@/redux/reducers/VisitationReducer';
import { openPopUp } from '@/redux/reducers/modalReducer';
import getUserCurrentLocationDetail from '@/utils/getUserCurrentLocationDetail';
import { hasLocationPermission } from '@/utils/permissions';

const FirstStep = () => {
  const { region } = useSelector((state: RootState) => state.location);
  const [isMapLoading, setIsMapLoading] = React.useState(false);
  const [grantedLocationPermission, setGrantedLocationPermission] =
    React.useState(false);
  const visitationData = useSelector((state: RootState) => state.visitation);
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const inputs: Input[] = [
    {
      label: 'Detail Alamat',
      type: 'area',
      isRequire: false,
      onChange: (e: string) => {
        const newLocation = { ...visitationData.locationAddress };
        newLocation.line2 = e;
        dispatch(
          updateDataVisitation({ type: 'locationAddress', value: newLocation })
        );
        dispatch(updateRegion({ ...region, line1: e }));
      },
      value: visitationData.locationAddress?.line2,
      placeholder: 'contoh: Jalan Kusumadinata no 5',
    },
  ];

  // map function
  const mapRef = React.useRef<MapView>(null);
  const onChangeRegion = async (coordinate: Region) => {
    try {
      setIsMapLoading(() => true);
      const { data } = await getLocationCoordinates(
        // '',
        coordinate.longitude as unknown as number,
        coordinate.latitude as unknown as number,
        ''
      );
      const { result } = data;
      if (!result) {
        throw data;
      }

      const _coordinate = {
        latitude: result?.lat,
        longitude: result?.lon,
        lat: 0,
        lon: 0,
        formattedAddress: result?.formattedAddress,
        PostalId: result?.PostalId,
      };

      if (typeof result?.lon === 'string') {
        _coordinate.longitude = Number(result.lon);
        _coordinate.lon = Number(result.lon);
      }

      if (typeof result?.lat === 'string') {
        _coordinate.latitude = Number(result.lat);
        _coordinate.lat = Number(result.lat);
      }
      dispatch(updateRegion(_coordinate));
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
  };

  const debounceResult = React.useMemo(() => debounce(onChangeRegion, 500), []);
  React.useEffect(() => {
    askingPermission();
    return () => {
      debounceResult.cancel();
    };
  }, []);

  React.useEffect(() => {
    // crashlytics().log(CREATE_VISITATION + '-Step1');

    const locationAddress = {
      ...visitationData.locationAddress,
      ...region,
    };

    if (visitationData.useSearchedAddress) {
      locationAddress.formattedAddress = visitationData.searchedAddress;
    }
    dispatch(
      updateDataVisitation({ type: 'locationAddress', value: locationAddress })
    );
  }, [
    region.formattedAddress,
    visitationData.createdLocation?.formattedAddress,
  ]);

  const askingPermission = async () => {
    const granted = await hasLocationPermission();
    if (granted) {
      setGrantedLocationPermission(granted);
    }
  };

  React.useEffect(() => {
    onMapReady();
  }, [region, grantedLocationPermission]);

  const onMapReady = async () => {
    try {
      if (grantedLocationPermission) {
        setIsMapLoading(() => true);
        const { result } = await getUserCurrentLocationDetail();
        const coordinate = {
          longitude: Number(result?.lon),
          latitude: Number(result?.lat),
          formattedAddress: result?.formattedAddress,
          PostalId: result?.PostalId,
        };
        dispatch(
          updateDataVisitation({ type: 'createdLocation', value: result })
        );
        if (region.latitude === 0) {
          dispatch(updateRegion(coordinate));
        }

        setIsMapLoading(() => false);
      } else {
        askingPermission();
      }
    } catch (error) {
      setIsMapLoading(() => false);
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText: error.message,
          outsideClickClosePopUp: true,
        })
      );
    }
  };

  React.useEffect(() => {
    DeviceEventEmitter.addListener('visitationSearchCoordinate', (data) => {
      dispatch(setUseSearchedAddress({ value: true }));
      dispatch(setSearchedAddress({ value: data.coordinate.formattedAddress }));
      onChangeRegion(data.coordinate);
    });
    return () => {
      DeviceEventEmitter.removeAllListeners('visitationSearchCoordinate');
    };
  }, [onChangeRegion]);

  const nameAddress = React.useMemo(() => {
    const address = visitationData.useSearchedAddress
      ? visitationData.searchedAddress
      : region.formattedAddress;
    const idx = address?.split(',');
    if (idx && idx?.length > 1) {
      return idx?.[0];
    }

    return 'Nama Alamat';
  }, [region.formattedAddress]);

  React.useEffect(() => {
    const isExist =
      !visitationData.createdLocation?.lat ||
      visitationData.createdLocation?.lon === 0;

    if (isExist) {
      onMapReady();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <BLocation
          ref={mapRef}
          region={region}
          onMapReady={onMapReady}
          onRegionChange={() =>
            dispatch(setUseSearchedAddress({ value: false }))
          }
          onRegionChangeComplete={debounceResult}
          CustomMarker={<BMarker />}
          mapStyle={styles.map}
        />
      </View>
      <View style={{ flex: 1 }}>
        <BBottomSheet
          handleIndicatorStyle={{ display: 'none' }}
          backgroundStyle={{
            borderTopEndRadius: layout.radius.lg,
            borderTopStartRadius: layout.radius.lg,
          }}
          percentSnapPoints={['100%']}
        >
          <ScrollView>
            <BContainer
              paddingHorizontal={layout.pad.lg}
              paddingVertical={layout.pad.zero}
            >
              <BLabel bold="500" label={'Alamat Proyek'} isRequired />
              <BSpacer size="verySmall" />
              <BLocationDetail
                nameAddress={nameAddress}
                isLoading={isMapLoading}
                formattedAddress={
                  visitationData.useSearchedAddress
                    ? visitationData.searchedAddress
                    : region.formattedAddress
                }
                onPress={() =>
                  navigation.navigate(SEARCH_AREA, {
                    from: CREATE_VISITATION,
                    eventKey: 'visitationSearchCoordinate',
                  })
                }
              />
              <BSpacer size="medium" />
              <BForm titleBold="500" inputs={inputs} />
            </BContainer>
          </ScrollView>
        </BBottomSheet>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: -(layout.pad.md + layout.pad.ml) },
  map: {
    flex: 1,
    width: '100%',
  },
  titleShimmer: {
    width: resScale(108),
    height: resScale(17),
    marginBottom: layout.pad.sm,
  },
  secondaryTextShimmer: { width: resScale(296), height: resScale(15) },
});

export default FirstStep;
