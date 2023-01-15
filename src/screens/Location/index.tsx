import resScale from '@/utils/resScale';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { SafeAreaView, View } from 'react-native';
import LocationStyles from './styles';
import CoordinatesDetail from './elements/CoordinatesDetail';
import { BButtonPrimary, BHeaderIcon, BLocation, BMarker } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateRegion } from '@/redux/locationReducer';
import { Region } from '@/interfaces';
import debounce from 'lodash.debounce';
const Location = () => {
  const navigation = useNavigation();
  const { region } = useSelector((state: RootState) => state.location);
  const dispatch = useDispatch();

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

  const onChangeRegion = (coordinate: Region) => {
    dispatch(updateRegion(coordinate));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BLocation
        region={region}
        onRegionChange={onChangeRegion}
        coordinate={region}
        CustomMarker={<BMarker />}
      />
      <View style={LocationStyles.bottomSheetContainer}>
        <CoordinatesDetail
          addressTitle={`latitude=${region.latitude}`}
          addressDetail={`longitude=${region.longitude}`}
          onPress={() => navigation.navigate('SearchArea')}
        />
        <BButtonPrimary
          onPress={() => navigation.navigate('Harga')}
          title="Simpan"
        />
      </View>
    </SafeAreaView>
  );
};

export default Location;
