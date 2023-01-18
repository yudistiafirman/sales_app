import resScale from '@/utils/resScale';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Dimensions, SafeAreaView, View } from 'react-native';
import LocationStyles from './styles';
import CoordinatesDetail from './elements/CoordinatesDetail';
import { BButtonPrimary, BHeaderIcon, BLocation, BMarker } from '@/components';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
import debounce from 'lodash.debounce';
import { useMachine } from '@xstate/react';
import { locationMachine } from '@/machine/locationMachine';
import LocationListShimmer from '../SearchAreaProject/element/LocationListShimmer';
import { LatLng } from 'react-native-maps';
const Location = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [state, send] = useMachine(locationMachine);

  const renderHeaderLeft = () => (
    <BHeaderIcon
      iconName="chevron-left"
      size={resScale(30)}
      onBack={() => navigation.goBack()}
    />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => renderHeaderLeft(),
      headerBackVisible: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (route?.params) {
      const { params } = route;
      const { latitude, longitude } = params.coordinate;
      send('sendingCoorParams', { value: { latitude, longitude } });
    }
  }, [route?.params]);

  const onChangeRegion = (coordinate: LatLng) => {
    const { latitude, longitude } = coordinate;
    send('onChangeRegion', { value: { latitude, longitude } });
  };
  const onSaveLocation = () => {
    const { lon, lat } = locationDetail;
    const coordinate = {
      longitude: lon,
      latitude: lat,
    };
    navigation.navigate('Harga', {
      coordinate: coordinate,
    });
  };
  const { region, locationDetail, loadingLocation } = state.context;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BLocation
        onRegionChange={onChangeRegion}
        region={{
          ...region,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        CustomMarker={<BMarker />}
        coordinate={region}
      />
      <View style={LocationStyles.bottomSheetContainer}>
        {loadingLocation ? (
          <View style={{ marginTop: resScale(16), marginBottom: resScale(20) }}>
            <LocationListShimmer />
          </View>
        ) : (
          <CoordinatesDetail
            address={
              locationDetail?.formattedAddress?.length > 0 ? locationDetail?.formattedAddress : ''
            }
            onPress={() => navigation.navigate('SearchArea')}
          />
        )}

        <BButtonPrimary onPress={onSaveLocation} title="Simpan" />
      </View>
    </SafeAreaView>
  );
};

export default Location;
