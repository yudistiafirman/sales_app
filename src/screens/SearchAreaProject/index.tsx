/* eslint-disable react/no-unstable-nested-components */
import BHeaderIcon from '@/components/atoms/BHeaderIcon';
import BsearchBar from '@/components/molecules/BsearchBar';
import scaleSize from '@/utils/scale';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import SearchAreaStyles from './styles';
import CurrentLocation from './element/SearchAreaCurrentLocation';
import LocationList from './element/LocationList';

const SearchAreaProject = () => {
  const navigation = useNavigation();
  const [locationData, setLocationData] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => (
        <BHeaderIcon size={scaleSize.moderateScale(23)} iconName="x" />
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={SearchAreaStyles.container}>
      <BsearchBar
        placeholder="Cari alamat Area Proyek"
        left={<TextInput.Icon icon="magnify" />}
        right={<TextInput.Icon icon="close" />}
      />
      <CurrentLocation onPress={() => navigation.navigate('Location')} />
      <LocationList locationData={locationData} />
    </SafeAreaView>
  );
};

export default SearchAreaProject;
