import BButtonPrimary from '@/components/atoms/BButtonPrimary';
import BLocation from '@/components/molecules/BLocation';
import scaleSize from '@/utils/scale';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { SafeAreaView, View } from 'react-native';
import BHeaderIcon from '../../components/atoms/BHeaderIcon';
import BMarkers from '../../components/atoms/BMarkers';
import LocationStyles from './styles';
import CoordinatesDetail from './elements/CoordinatesDetail';

const Location = () => {
  const navigation = useNavigation();

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BLocation CustomMarker={<BMarkers />} />
      <View style={LocationStyles.bottomSheetContainer}>
        <CoordinatesDetail
          addressTitle="Gandaria City"
          addressDetail="Jalan Jakarta Selatan, Kebayoran Lama, South Jakarta"
          onPress={() => navigation.navigate('SearchArea')}
        />
        <BButtonPrimary onPress={() => navigation.goBack()} title="Simpan" />
      </View>
    </SafeAreaView>
  );
};

export default Location;
