/* eslint-disable react/no-unstable-nested-components */
import BHeaderIcon from '@/components/atoms/BHeaderIcon';
import BSearchBar from '@/components/molecules/BSearchBar';
import resScale from '@/utils/resScale';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

const SearchAreaProject = () => {
  const navigation = useNavigation();
  const [text, setText] = useState('');
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
        const { lon, lat } = event.data;
        const coordinate = {
          longitude: Number(lon),
          latitude: Number(lat),
        };
        navigation.navigate('Location', {
          coordinate: coordinate,
        });
      },
    },
  });
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
