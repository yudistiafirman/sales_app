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
  LOCATION_TITLE,
  SEARCH_AREA,
  TAB_DISPATCH_TITLE,
  TAB_HOME_TITLE,
  TAB_OPERATION_TITLE,
  TAB_PRICE_LIST_TITLE,
  TAB_PROFILE_TITLE,
  TAB_ROOT,
  TAB_TRANSACTION_TITLE,
} from '@/navigation/ScreenNames';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { resScale } from '@/utils';

const Location = () => {
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps>();
  const [state, send] = useMachine(locationMachine);
  const isReadOnly = route?.params.isReadOnly;

  useHeaderTitleChanged({
    title: isReadOnly === true ? 'Lihat Area Proyek' : LOCATION_TITLE,
  });

  React.useEffect(() => {
    if (route?.params) {
      const { params } = route;
      const { latitude, longitude } = params.coordinate;
      send('sendingCoorParams', { value: { latitude, longitude } });
    }
  }, [route?.params]);

  const onRegionChangeComplete = (coordinate: Region) => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = coordinate;
    if (isReadOnly === false) {
      send('onChangeRegion', {
        value: { latitude, longitude, latitudeDelta, longitudeDelta },
      });
    }
  };
  const onSaveLocation = () => {
    const { lon, lat } = locationDetail;
    const from = route?.params?.from;
    const coordinate = {
      longitude: Number(lon),
      latitude: Number(lat),
    };
    if (
      from === TAB_PRICE_LIST_TITLE ||
      from === TAB_TRANSACTION_TITLE ||
      from === TAB_PROFILE_TITLE ||
      from === TAB_HOME_TITLE ||
      from === TAB_OPERATION_TITLE ||
      from === TAB_DISPATCH_TITLE
    ) {
      navigation.navigate(TAB_ROOT, {
        screen: from,
        params: { coordinate: coordinate },
      });
    } else {
      navigation?.setParams({
        coordinate: coordinate,
        isReadOnly: route?.params?.isReadOnly,
        from: from,
      });
      navigation.goBack();
    }
  };
  const { region, locationDetail, loadingLocation } = state.context;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BLocation
        onRegionChangeComplete={onRegionChangeComplete}
        region={region}
        scrollEnabled={isReadOnly === true ? false : true}
        CustomMarker={<BMarker />}
      />
      <View
        style={[
          LocationStyles.bottomSheetContainer,
          isReadOnly === true && { minHeight: resScale(80) },
        ]}
      >
        <CoordinatesDetail
          loadingLocation={loadingLocation}
          address={
            locationDetail?.formattedAddress?.length > 0
              ? locationDetail?.formattedAddress
              : ''
          }
          onPress={() =>
            navigation.navigate(SEARCH_AREA, { from: route?.params?.from })
          }
          disable={isReadOnly === true}
        />

        {isReadOnly === false && (
          <>
            <BButtonPrimary
              buttonStyle={LocationStyles.buttonStyles}
              onPress={onSaveLocation}
              title="Simpan"
            />
            <BSpacer size="extraSmall" />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Location;
