/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
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
import { Region, Input } from '@/interfaces';
import { updateRegion } from '@/redux/reducers/locationReducer';
import { colors, layout } from '@/constants';
import { createVisitationContext } from '@/context/CreateVisitationContext';
import { useMachine } from '@xstate/react';
import { deviceLocationMachine } from '@/machine/modules';
import { getLocationCoordinates } from '@/actions/CommonActions';

import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { CREATE_VISITATION, SEARCH_AREA } from '@/navigation/ScreenNames';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const FirstStep = () => {
  const { values, action } = React.useContext(createVisitationContext);
  const { updateValueOnstep } = action;
  const { region } = useSelector((state: RootState) => state.location);
  const [isMapLoading, setIsMapLoading] = React.useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch<any>();

  const inputs: Input[] = [
    {
      label: 'Detail Alamat',
      type: 'area',
      isRequire: false,
      onChange: (e: string) => {
        const newLocation = { ...values.stepOne.locationAddress };
        newLocation.line2 = e;

        updateValueOnstep('stepOne', 'locationAddress', newLocation);
        dispatch(updateRegion({ ...region, line1: e }));
      },
      value: values?.stepOne?.locationAddress?.line2,
      placeholder: 'contoh: Jalan Kusumadinata no 5',
    },
  ];

  // map function
  const mapRef = React.useRef<MapView>(null);
  const onChangeRegion = async (coordinate: Region) => {
    try {
      console.log(coordinate, 'coordinateonchange66');
      setIsMapLoading(() => true);
      const { data } = await getLocationCoordinates(
        // '',
        coordinate.longitude as unknown as number,
        coordinate.latitude as unknown as number,
        ''
      );
      const { result } = data;
      if (!result) {
        throw data;
      }
      const _coordinate = {
        latitude: result?.lat,
        longitude: result?.lon,
        formattedAddress: result?.formattedAddress,
        PostalId: result?.PostalId,
      };

      if (typeof result?.lon === 'string') {
        _coordinate.longitude = Number(result.lon);
        _coordinate.lon = Number(result.lon);
      }

      if (typeof result?.lat === 'string') {
        _coordinate.latitude = Number(result.lat);
        _coordinate.lat = Number(result.lat);
      }
      dispatch(updateRegion(_coordinate));
      setIsMapLoading(() => false);
    } catch (error) {
      console.log(JSON.stringify(error), 'onChangeRegionerror');
    }
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
    // console.log(region, 'region116first', locationAddress);
    console.log(values.stepOne.locationAddress, 'location117', region);
    console.log(locationAddress, 'locationAddress118');

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
      values.stepOne.createdLocation.lon === 0;

    if (isExist) {
      console.log('jalan143');
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
        <BBottomSheet
          handleIndicatorStyle={{ display: 'none' }}
          backgroundStyle={{
            borderTopEndRadius: layout.radius.lg,
            borderTopStartRadius: layout.radius.lg,
          }}
          percentSnapPoints={['100%']}
        >
          <ScrollView>
            <BContainer
              paddingHorizontal={layout.pad.lg}
              paddingVertical={layout.pad.zero}
            >
              <BLabel bold="500" label={'Alamat Proyek'} isRequired />
              <BSpacer size="verySmall" />
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  paddingVertical: layout.pad.md,
                  backgroundColor: colors.border.disabled,
                  borderRadius: layout.radius.sm,
                  paddingHorizontal: layout.pad.ml,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() =>
                  navigation.navigate(SEARCH_AREA, {
                    from: CREATE_VISITATION,
                  })
                }
              >
                <View>
                  <Icons
                    name="map-pin"
                    size={resScale(20)}
                    color={colors.primary}
                  />
                </View>
                <View style={{ paddingStart: layout.pad.ml, flex: 1 }}>
                  {isMapLoading ? (
                    <View>
                      <ShimmerPlaceholder style={styles.titleShimmer} />
                      <ShimmerPlaceholder style={styles.secondaryTextShimmer} />
                    </View>
                  ) : (
                    <>
                      <BLabel bold="500" label={nameAddress!} />
                      <BSpacer size="verySmall" />
                      <BText bold="300">
                        {region.formattedAddress || 'Detail Alamat'}
                      </BText>
                    </>
                  )}
                </View>
              </TouchableOpacity>
              <BSpacer size="medium" />
              <BForm titleBold="500" inputs={inputs} />
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
