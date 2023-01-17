/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

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
import { Styles, Region, Input } from '@/interfaces';
import { updateRegion } from '@/redux/locationReducer';
import debounce from 'lodash.debounce';
import { colors, layout } from '@/constants';
import { useKeyboardActive } from '@/hooks';
import BrikApi from '../../../../brikApi/BrikApi';
import MapView from 'react-native-maps';
import { createVisitationContext } from '@/context/CreateVisitationContext';
// import BrikApi from '@/brikApi/BrikApi';

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
      },
      value: values?.stepOne?.locationAddress?.line1,
      placeholder: 'contoh: Jalan Kusumadinata no 5',
    },
  ];

  // map function
  const mapRef = React.useRef<MapView>(null);

  const onChangeRegion = async (coordinate: Region) => {
    const result = await BrikApi.getLocationCoordinates(
      coordinate.longitude,
      coordinate.latitude
    );
    console.log(result, 'ini result??');
    dispatch(updateRegion(coordinate));
  };

  const debounceResult = React.useMemo(() => debounce(onChangeRegion, 500), []);

  React.useEffect(() => {
    // use gpsLocation device to update createdLocation;

    return () => {
      debounceResult.cancel();
    };
  }, []);

  React.useEffect(() => {
    console.log(navigation.isFocused(), 'ini navgitation value?');
    if (mapRef.current && navigation.isFocused()) {
      mapRef.current?.animateToRegion(region);
    }
  }, [navigation.isFocused()]);

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
                <BLabel label="Nama Alamat" />
                <BText>Detail alamat</BText>
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
