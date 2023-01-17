/* eslint-disable react/no-unstable-nested-components */
import BHeaderIcon from '@/components/atoms/BHeaderIcon';
import BSearchBar from '@/components/molecules/BSearchBar';
import resScale from '@/utils/resScale';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native';
import SearchAreaStyles from './styles';
import CurrentLocation from './element/SearchAreaCurrentLocation';
import LocationList from './element/LocationList';
import { useDispatch } from 'react-redux';
import { updateRegion } from '@/redux/locationReducer';
import { useMachine } from '@xstate/react';
import { searchAreaMachine } from '@/machine/searchAreaMachine';
import { assign } from 'xstate';
import LocationListShimmer from './element/LocationListShimmer';
import { BSpacer } from '@/components';

const SearchAreaProject = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [state, send] = useMachine(searchAreaMachine, {
    actions: {
      sendingLonglat: (context, event) => {
        const { longitude, latitude } = context.longlat;
        const coordinate = {
          longitude: longitude,
          latitude: latitude,
        };
        dispatch(updateRegion(coordinate));
        navigation.push('Location');
      },
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
          longitude: lon,
          latitude: lat,
        };
        dispatch(updateRegion(coordinate));
        navigation.push('Location');
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

  const { result, loadPlaces } = state.context;

  const onChangeValue = (event: string) => {
    setText(event);
    send('searchingLocation', { payload: event });
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
      <CurrentLocation onPress={() => send('askingPermission')} />
      <BSpacer size="small" />
      {loadPlaces ? (
        <LocationListShimmer />
      ) : (
        <LocationList
          onPress={(place_id) =>
            send('onGettingPlacesId', { payload: place_id })
          }
          locationData={result}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchAreaProject;
