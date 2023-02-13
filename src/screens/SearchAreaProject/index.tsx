import BHeaderIcon from '@/components/atoms/BHeaderIcon';
import BSearchBar from '@/components/molecules/BSearchBar';
import resScale from '@/utils/resScale';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { TextInput } from 'react-native-paper';
import { SafeAreaView, AppState, DeviceEventEmitter } from 'react-native';
import SearchAreaStyles from './styles';
import CurrentLocation from './element/SearchAreaCurrentLocation';
import LocationList from './element/LocationList';
import { useMachine } from '@xstate/react';
import { searchAreaMachine } from '@/machine/searchAreaMachine';
import { assign } from 'xstate';
import LocationListShimmer from './element/LocationListShimmer';
import { BSpacer } from '@/components';
import { useDispatch } from 'react-redux';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import { CREATE_VISITATION, LOCATION, SPH } from '@/navigation/ScreenNames';
import { updateRegion } from '@/redux/reducers/locationReducer';

const SearchAreaProject = ({ route }: { route: any }) => {
  const navigation = useNavigation();
  const [text, setText] = React.useState('');
  const dispatch = useDispatch();
  const appState = React.useRef(AppState.currentState);
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
        const { lon, lat, formattedAddress } = event.data;
        const from = route?.params?.from;
        const eventKey = route?.params?.eventKey;
        let coordinate = {
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
        if (from === CREATE_VISITATION || from === SPH) {
          if (eventKey) {
            DeviceEventEmitter.emit(eventKey, { coordinate: coordinate });
          } else {
            dispatch(updateRegion(coordinate));
          }
          navigation.goBack();
        } else {
          navigation.navigate(LOCATION, {
            coordinate: coordinate,
            isReadOnly: false,
            from: route?.params?.from,
          });
        }
      },
    },
  });

  useCustomHeaderLeft({
    customHeaderLeft: (
      <BHeaderIcon
        size={resScale(23)}
        onBack={() => navigation.goBack()}
        iconName="x"
      />
    ),
  });

  React.useEffect(() => {
    if (state.matches('getLocation.denied')) {
      const subscription = AppState.addEventListener(
        'change',
        (nextAppState) => {
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
          ) {
            send('appComeForeground');
          } else {
            send('appComeBackground');
          }
          appState.current = nextAppState;
        }
      );
      return () => {
        subscription.remove();
      };
    }
  }, [state, send]);

  const { result, loadPlaces, longlat } = state.context;
  const onChangeValue = (event: string) => {
    setText(event);
    send('searchingLocation', { payload: event });
  };

  const onPressCurrentLocation = () => {
    const { latitude, longitude } = longlat;
    const eventKey = route?.params?.eventKey;

    const coordinate = {
      longitude: longitude,
      latitude: latitude,
    };
    if (route?.params?.from === CREATE_VISITATION) {
      dispatch(updateRegion(coordinate));
      navigation.goBack();
    } else {
      navigation.navigate(LOCATION, {
        coordinate: coordinate,
        from: route?.params?.from,
        isReadOnly: false,
        eventKey: eventKey,
      });
    }
  };

  const onPressListLocations = (placeId: string) => {
    send('onGettingPlacesId', { payload: placeId });
  };

  return (
    <SafeAreaView style={SearchAreaStyles.container}>
      <BSpacer size="small" />
      <BSearchBar
        onChangeText={onChangeValue}
        placeholder="Cari alamat Area Proyek"
        value={text}
        left={<TextInput.Icon icon="magnify" />}
        right={
          <TextInput.Icon onPress={() => send('clearInput')} icon="close" />
        }
      />
      <BSpacer size="small" />
      <CurrentLocation
        disabled={longlat.latitude === undefined}
        onPress={onPressCurrentLocation}
      />
      <BSpacer size="small" />
      {loadPlaces ? (
        <LocationListShimmer />
      ) : (
        <LocationList onPress={onPressListLocations} locationData={result} />
      )}
    </SafeAreaView>
  );
};

export default SearchAreaProject;
