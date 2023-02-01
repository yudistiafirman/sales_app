import BHeaderIcon from '@/components/atoms/BHeaderIcon';
import BSearchBar from '@/components/molecules/BSearchBar';
import resScale from '@/utils/resScale';
import { useNavigation } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { TextInput } from 'react-native-paper';
import { SafeAreaView, AppState } from 'react-native';
import SearchAreaStyles from './styles';
import CurrentLocation from './element/SearchAreaCurrentLocation';
import LocationList from './element/LocationList';
import { useMachine } from '@xstate/react';
import { searchAreaMachine } from '@/machine/searchAreaMachine';
import { assign } from 'xstate';
import LocationListShimmer from './element/LocationListShimmer';
import { BSpacer } from '@/components';
import { useDispatch } from 'react-redux';
import { updateRegion } from '@/redux/locationReducer';

const SearchAreaProject = ({ route }: { route: any }) => {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
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
        let coordinate = {
          longitude: lon,
          latitude: lat,
          formattedAddress,
        };

        console.log(event.data, context, 'ini apa?? di search are');

        if (typeof lon === 'string') {
          coordinate.longitude = Number(lon);
        }

        if (typeof lat === 'string') {
          coordinate.latitude = Number(lat);
        }
        if (route?.params?.from) {
          dispatch(updateRegion(coordinate));
          navigation.goBack();
          return;
        }
        navigation.navigate('Location', {
          coordinate: coordinate,
        });
      },
    },
  });

  const renderHeaderLeft = useCallback(() => {
    return (
      <BHeaderIcon
        size={resScale(23)}
        onBack={() => navigation.goBack()}
        iconName="x"
      />
    );
  }, [navigation]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerTitle: 'Pilih Area Proyek',
      headerLeft: () => renderHeaderLeft(),
    });
  }, [navigation, renderHeaderLeft]);

  useEffect(() => {
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
    const coordinate = {
      longitude: longitude,
      latitude: latitude,
    };
    navigation.navigate('Location', {
      coordinate: coordinate,
    });
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
