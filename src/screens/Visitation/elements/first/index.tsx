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
import BrikApi from '../../../../BrikApi/BrikApi';
// import BrikApi from '@/brikApi/BrikApi';

const FirstStep = () => {
  const navigation = useNavigation();
  const { keyboardVisible, keyboardHeight } = useKeyboardActive();
  const { region } = useSelector((state: RootState) => state.location);
  const dispatch = useDispatch<any>();

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
    return () => {
      debounceResult.cancel();
    };
  }, []);

  const inputs: Input[] = [
    {
      label: 'Detail Alamat',
      type: 'area',
      isRequire: false,
      onChange: () => {},
      value: '',
      placeholder: 'contoh: Jalan Kusumadinata no 5',
    },
  ];

  const styles: Styles = React.useMemo(() => {
    return {
      container: { flex: 1, marginHorizontal: -resScale(20) },
      map: {
        height: keyboardVisible ? keyboardHeight : resScale(400),
        width: '100%',
      },
    };
  }, [keyboardVisible, keyboardHeight]);

  return (
    <View style={styles.container}>
      {/* <View style={{ flex: 1 }}> */}
      <BLocation
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
            }}
            onPress={() =>
              navigation.navigate('SearchArea', {
                from: 'CreateVisitation',
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
          {/* <BSpacer size="extraSmall" /> */}
        </BContainer>
      </BBottomSheet>
    </View>
  );
};

export default FirstStep;
