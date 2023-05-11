import crashlytics from '@react-native-firebase/crashlytics';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useMachine } from '@xstate/react';
import * as React from 'react';
import { SafeAreaView, DeviceEventEmitter, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { assign } from 'xstate';
import { BSpacer } from '@/components';
import BHeaderIcon from '@/components/atoms/BHeaderIcon';
import BSearchBar from '@/components/molecules/BSearchBar';
import { layout } from '@/constants';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import { searchAreaMachine } from '@/machine/searchAreaMachine';
import {
  CREATE_VISITATION,
  CUSTOMER_DETAIL,
  LOCATION,
  SEARCH_AREA,
  SPH,
} from '@/navigation/ScreenNames';
import { updateRegion } from '@/redux/reducers/locationReducer';
import { hasLocationPermission } from '@/utils/permissions';
import resScale from '@/utils/resScale';
import SearchAreaStyles from './styles';
import CurrentLocation from './element/SearchAreaCurrentLocation';
import LocationList from './element/LocationList';

function SearchAreaProject({ route }: { route: any }) {
  const navigation = useNavigation();
  const [text, setText] = React.useState('');
  const dispatch = useDispatch();
  const [state, send] = useMachine(searchAreaMachine, {
    actions: {
      clearInputValue: assign((context, event) => {
        setText('');
        return {
          result: [],
          searchValue: '',
        };
      }),
      navigateToLocation: (context, event) => {
        const { lon, lat } = event.data;
        const { formattedAddress } = context;
        const from = route?.params?.from;
        const eventKey = route?.params?.eventKey;
        const sourceType = route?.params?.sourceType;
        const coordinate = {
          longitude: lon,
          latitude: lat,
          formattedAddress,
        };

        if (typeof lon === 'string') {
          coordinate.longitude = Number(lon);
        }

        if (typeof lat === 'string') {
          coordinate.latitude = Number(lat);
        }
        if (from === CREATE_VISITATION || from === SPH || from === CUSTOMER_DETAIL) {
          if (eventKey) {
            if (sourceType) {
              DeviceEventEmitter.emit(eventKey, {
                coordinate,
                sourceType,
              });
            } else {
              DeviceEventEmitter.emit(eventKey, { coordinate });
            }
          } else {
            dispatch(updateRegion(coordinate));
          }
          navigation.goBack();
        } else {
          navigation.navigate(LOCATION, {
            coordinate,
            isReadOnly: false,
            from: route?.params?.from,
          });
        }
      },
    },
  });

  useCustomHeaderLeft({
    customHeaderLeft: (
      <BHeaderIcon size={resScale(23)} onBack={() => navigation.goBack()} iconName="x" />
    ),
  });

  React.useEffect(() => {
    crashlytics().log(SEARCH_AREA);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      hasLocationPermission();
    }, [])
  );

  const { result, loadPlaces, longlat, errorMessage } = state.context;
  const onChangeValue = (event: string) => {
    setText(event);
    send('searchingLocation', { payload: event });
  };

  const onPressCurrentLocation = () => {
    const { latitude, longitude } = longlat;
    const eventKey = route?.params?.eventKey;
    const sourceType = route?.params?.sourceType;

    const coordinate = {
      longitude,
      latitude,
    };
    if (route?.params?.from === CREATE_VISITATION) {
      dispatch(updateRegion(coordinate));
      navigation.goBack();
    } else {
      navigation.navigate(LOCATION, {
        coordinate,
        from: route?.params?.from,
        isReadOnly: false,
        eventKey,
        sourceType,
      });
    }
  };

  const onPressListLocations = (item: string) => {
    send('onGettingPlacesId', { payload: item });
  };

  return (
    <SafeAreaView style={SearchAreaStyles.container}>
      <BSpacer size="small" />
      <BSearchBar
        textInputStyle={Platform.OS !== 'android' && { paddingBottom: layout.pad.sm }}
        onChangeText={onChangeValue}
        placeholder="Cari alamat Area Proyek"
        value={text}
        left={<TextInput.Icon icon="magnify" />}
        right={<TextInput.Icon onPress={() => send('clearInput')} icon="close" />}
      />
      <BSpacer size="small" />
      <CurrentLocation disabled={longlat.latitude === undefined} onPress={onPressCurrentLocation} />
      <BSpacer size="small" />

      <LocationList
        isLoading={loadPlaces}
        searchValue={text}
        isError={state.matches('searchLocation.errorGettingLocationData')}
        errorMessage={errorMessage}
        onAction={() => send('retryGettingLocation')}
        onPress={onPressListLocations}
        locationData={result}
      />
    </SafeAreaView>
  );
}

export default SearchAreaProject;
