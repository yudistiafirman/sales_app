import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import * as React from 'react';
import { DeviceEventEmitter, SafeAreaView, View } from 'react-native';
import LocationStyles from './styles';
import CoordinatesDetail from './elements/CoordinatesDetail';
import { BButtonPrimary, BLocation, BMarker, BSpacer } from '@/components';
import { useMachine } from '@xstate/react';
import { locationMachine } from '@/machine/locationMachine';
import { Region } from 'react-native-maps';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import {
  CUSTOMER_DETAIL,
  LOCATION,
  LOCATION_TITLE,
  SEARCH_AREA,
  SPH,
  TAB_DISPATCH_TITLE,
  TAB_HOME_TITLE,
  TAB_RETURN_TITLE,
  TAB_PRICE_LIST_TITLE,
  TAB_PROFILE_TITLE,
  TAB_ROOT,
  TAB_TRANSACTION_TITLE,
} from '@/navigation/ScreenNames';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { resScale } from '@/utils';
import crashlytics from '@react-native-firebase/crashlytics';

const Location = () => {
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps>();
  const [searchedAddress, setSearchedAddress] = React.useState('');
  const [useSearchedAddress, setUseSearchedAddress] = React.useState(false);
  const [state, send] = useMachine(locationMachine);
  const isReadOnly = route?.params.isReadOnly;

  useHeaderTitleChanged({
    title: isReadOnly === true ? 'Lihat Area Proyek' : LOCATION_TITLE,
  });

  React.useEffect(() => {
    crashlytics().log(LOCATION);
    if (route?.params) {
      const { params } = route;
      const { latitude, longitude, formattedAddress } = params.coordinate;
      if (formattedAddress) {
        setSearchedAddress(formattedAddress);
      }

      setUseSearchedAddress(true);
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
    const { lon, lat, formattedAddress, postalId } = locationDetail;
    const from = route?.params?.from;
    const eventKey = route?.params?.eventKey;
    const sourceType = route?.params?.sourceType;
    const coordinate = {
      longitude: Number(lon),
      latitude: Number(lat),
      formattedAddress: route?.params?.coordinate?.formattedAddress
        ? route?.params?.coordinate?.formattedAddress
        : formattedAddress,
      postalId: postalId,
    };

    if (
      from === TAB_PRICE_LIST_TITLE ||
      from === TAB_TRANSACTION_TITLE ||
      from === TAB_PROFILE_TITLE ||
      from === TAB_HOME_TITLE ||
      from === TAB_RETURN_TITLE ||
      from === TAB_DISPATCH_TITLE ||
      from === SPH ||
      from === CUSTOMER_DETAIL
    ) {
      if (eventKey) {
        if (sourceType) {
          DeviceEventEmitter.emit(eventKey, {
            coordinate: coordinate,
            sourceType: sourceType,
          });
        } else {
          DeviceEventEmitter.emit(eventKey, { coordinate: coordinate });
        }
        navigation.dispatch(StackActions.pop(2));
      } else {
        navigation.navigate(TAB_ROOT, {
          screen: from,
          params: { coordinate: coordinate },
        });
      }
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
  const { params } = route;
  const { coordinate } = params;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BLocation
        onRegionChangeComplete={onRegionChangeComplete}
        onRegionChange={() => setUseSearchedAddress(false)}
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
            useSearchedAddress && searchedAddress.length > 0
              ? searchedAddress
              : locationDetail?.formattedAddress
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
