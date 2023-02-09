import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import LocationStyles from './styles';
import CoordinatesDetail from './elements/CoordinatesDetail';
import { BButtonPrimary, BLocation, BMarker, BSpacer } from '@/components';
import { useMachine } from '@xstate/react';
import { locationMachine } from '@/machine/locationMachine';
import { Region } from 'react-native-maps';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import {
  SEARCH_AREA,
  TAB_PRICE_LIST_TITLE,
  TAB_ROOT,
} from '@/navigation/ScreenNames';

const Location = () => {
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps>();
  const [state, send] = useMachine(locationMachine);

  React.useEffect(() => {
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
    navigation.navigate(TAB_ROOT, {
      screen: TAB_PRICE_LIST_TITLE,
      params: { coordinate: coordinate },
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
          onPress={() => navigation.navigate(SEARCH_AREA)}
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
