import BButtonPrimary from '@/components/atoms/BButtonPrimary';
import BLocation from '@/components/molecules/BLocation';
import scaleSize from '@/utils/scale';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Dimensions, SafeAreaView, View } from 'react-native';
import BHeaderIcon from '../../components/atoms/BHeaderIcon';
import BMarkers from '../../components/atoms/BMarkers';
import LocationStyles from './styles';
import CoordinatesDetail from './elements/CoordinatesDetail';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const Location = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { longitude, latitude } = route.params;
  const [region, setRegion] = useState({
    longitude: longitude,
    latitude: latitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerLeft: () => (
        <BHeaderIcon
          iconName="chevron-left"
          size={scaleSize.moderateScale(30)}
          onBack={() => navigation.goBack()}
        />
      ),
      headerBackVisible: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (route.params) {
      setRegion({
        longitude,
        latitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  }, [route.params]);

  const onRegionChange = (region) => {
    setRegion(region);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BLocation
        region={region}
        onRegionChange={setRegion}
        coordinate={{ latitude: region.latitude, longitude: region.longitude }}
        CustomMarker={<BMarkers />}
      />
      <View style={LocationStyles.bottomSheetContainer}>
        <CoordinatesDetail
          addressTitle={`latitude=${region.latitude}`}
          addressDetail={`longitude=${region.longitude}`}
          onPress={() => navigation.navigate('SearchArea')}
        />
        <BButtonPrimary
          onPress={() =>
            navigation.navigate('Harga', {
              updatedParams: {
                latitude: region.latitude,
                longitude: region.longitude,
              },
            })
          }
          title="Simpan"
        />
      </View>
    </SafeAreaView>
  );
};

export default Location;
