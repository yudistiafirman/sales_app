/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';
import debounce from 'lodash.debounce';

import {
  BBottomSheet,
  BContainer,
  BForm,
  BLabel,
  BLocation,
  BMarker,
  BSpacer,
  BText,
} from '@/components';
import Icons from 'react-native-vector-icons/Feather';

import { resScale } from '@/utils';
import { Styles, Region, Input, Location } from '@/interfaces';
import { updateRegion } from '@/redux/locationReducer';
import { colors, layout } from '@/constants';
import { useKeyboardActive } from '@/hooks';
import { createVisitationContext } from '@/context/CreateVisitationContext';
import { useMachine } from '@xstate/react';
import { deviceLocationMachine } from '@/machine/modules';
import { getLocationCoordinates } from '@/actions/CommonActions';
import { searchAreaMachine } from '@/machine/searchAreaMachine';

const FirstStep = () => {
  const { values, action } = React.useContext(createVisitationContext);
  const { updateValueOnstep } = action;
  const { region } = useSelector((state: RootState) => state.location);
  const { keyboardVisible, keyboardHeight } = useKeyboardActive();

  const navigation = useNavigation();
  const dispatch = useDispatch<any>();

  const styles: Styles = React.useMemo(() => {
    return {
      container: { flex: 1, marginHorizontal: -resScale(20) },
      map: {
        height: keyboardVisible ? keyboardHeight : resScale(400),
        width: '100%',
      },
    };
  }, [keyboardVisible, keyboardHeight]);

  const inputs: Input[] = [
    {
      label: 'Detail Alamat',
      type: 'area',
      isRequire: false,
      onChange: (e: string) => {
        const newLocation = { ...values.stepOne.locationAddress };
        newLocation.line1 = e;

        updateValueOnstep('stepOne', 'locationAddress', newLocation);
        dispatch(updateRegion({ ...region, line1: e }));
      },
      value: values?.stepOne?.locationAddress?.line1,
      placeholder: 'contoh: Jalan Kusumadinata no 5',
    },
  ];

  // map function
  const mapRef = React.useRef<MapView>(null);
  const onChangeRegion = async (coordinate: Region) => {
    const { result } = await getLocationCoordinates(
      '',
      coordinate.longitude,
      coordinate.latitude,
      ''
    );
    const _coordinate: Location = {
      latitude: result?.lat,
      longitude: result?.lon,
      formattedAddress: result?.formattedAddress,
      PostalId: result?.PostalId,
    };

    if (typeof result?.lon === 'string') {
      _coordinate.longitude = Number(result.lon);
    }

    if (typeof result?.lat === 'string') {
      _coordinate.latitude = Number(result.lat);
    }
    dispatch(updateRegion(_coordinate));
  };

  const debounceResult = React.useMemo(() => debounce(onChangeRegion, 500), []);
  React.useEffect(() => {
    return () => {
      debounceResult.cancel();
    };
  }, []);

  React.useEffect(() => {
    if (mapRef.current) {
      mapRef?.current?.animateToRegion(region as Region);
    }
    const locationAddress = {
      ...values.stepOne.locationAddress,
      ...region,
    };
    updateValueOnstep('stepOne', 'locationAddress', locationAddress);
  }, [region.formattedAddress]);

  const [, send] = useMachine(deviceLocationMachine, {
    actions: {
      dispatchState: (context, _event, _meta) => {
        const coordinate: Location = {
          longitude: context?.lon,
          latitude: context?.lat,
          formattedAddress: context?.formattedAddress,
          PostalId: context?.PostalId,
        };

        updateValueOnstep('stepOne', 'createdLocation', context);
        if (region.latitude === 0) {
          dispatch(updateRegion(coordinate));
        }
      },
    },
  });

  React.useEffect(() => {
    const isExist =
      !values.stepOne.createdLocation.lat ||
      values.stepOne.createdLocation.lan === 0;
    if (isExist) {
      console.log('jalan');
      send('askingPermission');
    }
    // console.log(state.context, 'ini apa?');
  }, []);

  const nameAddress = React.useMemo(() => {
    const idx = region.formattedAddress?.split(',');
    if (idx?.length > 1) {
      return idx?.[0];
    }

    return 'Nama Alamat';
  }, [region.formattedAddress]);

  return (
    <View style={styles.container}>
      <BLocation
        ref={mapRef}
        region={region}
        onRegionChange={debounceResult}
        coordinate={region}
        CustomMarker={<BMarker />}
        mapStyle={
          styles.map as ViewStyle & {
            width: number;
            height: number;
          }
        }
      />
      <BBottomSheet
        percentSnapPoints={[
          keyboardVisible ? `${70 - keyboardHeight * 0.01}%` : '47%',
        ]}
      >
        <BContainer>
          <BLabel label={'Alamat Proyek'} isRequired />
          <BSpacer size="extraSmall" />
          <TouchableOpacity
            style={{
              padding: layout.pad.lg,
              backgroundColor: colors.border.disabled,
              borderRadius: layout.radius.sm,
            }}
            onPress={() =>
              navigation.navigate('SearchArea', {
                from: 'Create Visitation',
              })
            }
          >
            <View style={{ flexDirection: 'row' }}>
              <Icons
                name="map-pin"
                size={resScale(20)}
                color={colors.primary}
              />
              <BSpacer size="large" />
              <View>
                <BLabel label={nameAddress!} />
                <BText>{region.formattedAddress || 'Detail Alamat'}</BText>
              </View>
            </View>
          </TouchableOpacity>
          <BSpacer size="extraSmall" />
          <BForm inputs={inputs} />
        </BContainer>
      </BBottomSheet>
    </View>
  );
};

export default FirstStep;
