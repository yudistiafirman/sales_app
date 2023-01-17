/* eslint-disable react/no-unstable-nested-components */
import BHeaderIcon from '@/components/atoms/BHeaderIcon';
import BSearchBar from '@/components/molecules/BSearchBar';
import resScale from '@/utils/resScale';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import SearchAreaStyles from './styles';
import CurrentLocation from './element/SearchAreaCurrentLocation';
import LocationList from './element/LocationList';
import Geolocation from 'react-native-geolocation-service';
import { hasLocationPermission } from '@/utils/permissions';
import { useDispatch } from 'react-redux';
import { updateRegion } from '@/redux/locationReducer';

const SearchAreaProject = ({ route }: { route: any }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [locationData, setLocationData] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => (
        <BHeaderIcon
          size={resScale(23)}
          onBack={() => navigation.goBack()}
          iconName="x"
        />
      ),
    });
  }, [navigation]);

  const getCurrentLocation = async () => {
    const hasPermission = await hasLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            const { latitude, longitude } = position.coords;
            const coordinatePayload = {
              latitude,
              longitude,
            };
            dispatch(updateRegion(coordinatePayload));

            if (route?.params?.from) {
              navigation.goBack(null, { shouldUpdate: true });
              return;
            }
            navigation.push('Location');
          }
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  return (
    <SafeAreaView style={SearchAreaStyles.container}>
      <BSearchBar
        placeholder="Cari alamat Area Proyek"
        left={<TextInput.Icon icon="magnify" />}
        right={<TextInput.Icon icon="close" />}
      />
      <CurrentLocation onPress={getCurrentLocation} />
      <LocationList locationData={locationData} />
    </SafeAreaView>
  );
};

export default SearchAreaProject;
