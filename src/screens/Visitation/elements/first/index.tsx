/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
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
import { Styles, Region, Input } from '@/interfaces';
import { updateRegion } from '@/redux/locationReducer';
import { colors, layout } from '@/constants';
import { createVisitationContext } from '@/context/CreateVisitationContext';
import { useMachine } from '@xstate/react';
import { deviceLocationMachine } from '@/machine/modules';
import { getLocationCoordinates } from '@/actions/CommonActions';

import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const FirstStep = () => {
  const { values, action } = React.useContext(createVisitationContext);
  const { updateValueOnstep } = action;
  const { region } = useSelector((state: RootState) => state.location);
  const [isMapLoading, setIsMapLoading] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch<any>();

  // const styles: Styles = React.useMemo(() => {
  //   return {
  //     container: { flex: 1, marginHorizontal: -resScale(20) },
  //     map: {
  //       height: resScale(400),
  //       width: '100%',
  //     },
  //     titleShimmer: {
  //       width: resScale(108),
  //       height: resScale(17),
  //       marginBottom: resScale(4),
  //     },
  //     secondaryTextShimmer: { width: resScale(296), height: resScale(15) },
  //   };
  // }, []);

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
    setIsMapLoading(() => true);
    const { data } = await getLocationCoordinates(
      // '',
      coordinate.longitude as unknown as number,
      coordinate.latitude as unknown as number,
      ''
    );
    const { result } = data;
    const _coordinate = {
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
    setIsMapLoading(() => false);
  };

  const debounceResult = React.useMemo(() => debounce(onChangeRegion, 500), []);
  React.useEffect(() => {
    return () => {
      debounceResult.cancel();
    };
  }, []);

  React.useEffect(() => {
    if (mapRef.current) {
      mapRef?.current?.animateToRegion(region);
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
        const coordinate = {
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
      <View style={{ flex: 1 }}>
        <BLocation
          ref={mapRef}
          region={region}
          onRegionChangeComplete={debounceResult}
          CustomMarker={<BMarker />}
          mapStyle={styles.map}
        />
      </View>
      <View style={{ flex: 1 }}>
        <BBottomSheet percentSnapPoints={['100%']}>
          <ScrollView>
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
                    {isMapLoading ? (
                      <View>
                        <ShimmerPlaceholder style={styles.titleShimmer} />
                        <ShimmerPlaceholder
                          style={styles.secondaryTextShimmer}
                        />
                      </View>
                    ) : (
                      <>
                        <BLabel label={nameAddress!} />
                        <BText>
                          {region.formattedAddress || 'Detail Alamat'}
                        </BText>
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              <BSpacer size="extraSmall" />
              <BForm inputs={inputs} />
            </BContainer>
          </ScrollView>
        </BBottomSheet>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: -resScale(20) },
  map: {
    height: resScale(330),
    width: '100%',
  },
  titleShimmer: {
    width: resScale(108),
    height: resScale(17),
    marginBottom: resScale(4),
  },
  secondaryTextShimmer: { width: resScale(296), height: resScale(15) },
});

export default FirstStep;
