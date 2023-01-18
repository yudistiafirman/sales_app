import resScale from '@/utils/resScale';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect } from 'react';
import { Dimensions, SafeAreaView, View } from 'react-native';
import LocationStyles from './styles';
import CoordinatesDetail from './elements/CoordinatesDetail';
import {
  BButtonPrimary,
  BHeaderIcon,
  BLocation,
  BMarker,
  BSpacer,
} from '@/components';

import { useMachine } from '@xstate/react';
import { locationMachine } from '@/machine/locationMachine';
import { LatLng, Region } from 'react-native-maps';
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

  const onRegionChangeComplete = (coordinate: Region) => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = coordinate;
    send('onChangeRegion', {
      value: { latitude, longitude, latitudeDelta, longitudeDelta },
    });
  };
  const onSaveLocation = () => {
    const { lon, lat } = locationDetail;
    const coordinate = {
      longitude: Number(lon),
      latitude: Number(lat),
    };
    navigation.navigate('Harga', {
      coordinate: coordinate,
    });
  };
  const { region, locationDetail, loadingLocation } = state.context;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BLocation
        onRegionChangeComplete={onRegionChangeComplete}
        region={region}
        CustomMarker={<BMarker />}
      />
      <View style={LocationStyles.bottomSheetContainer}>
        <CoordinatesDetail
          loadingLocation={loadingLocation}
          address={
            locationDetail?.formattedAddress?.length > 0
              ? locationDetail?.formattedAddress
              : ''
          }
          onPress={() => navigation.navigate('SearchArea')}
        />

        <BButtonPrimary
          buttonStyle={LocationStyles.buttonStyles}
          onPress={onSaveLocation}
          title="Simpan"
        />
        <BSpacer size="extraSmall" />
      </View>
    </SafeAreaView>
  );
};

export default Location;
