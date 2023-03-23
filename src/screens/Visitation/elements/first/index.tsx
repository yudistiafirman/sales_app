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
import { useMachine } from '@xstate/react';
import { deviceLocationMachine } from '@/machine/modules';
import { getLocationCoordinates } from '@/actions/CommonActions';

import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { CREATE_VISITATION, SEARCH_AREA } from '@/navigation/ScreenNames';
import crashlytics from '@react-native-firebase/crashlytics';
import { customLog } from '@/utils/generalFunc';
import { updateDataVisitation } from '@/redux/reducers/VisitationReducer';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const FirstStep = () => {
  const { region } = useSelector((state: RootState) => state.location);
  const [isMapLoading, setIsMapLoading] = React.useState(false);
  const visitationData = useSelector((state: RootState) => state.visitation);
  const navigation = useNavigation();
  const dispatch = useDispatch<any>();

  const inputs: Input[] = [
    {
      label: 'Detail Alamat',
      type: 'area',
      isRequire: false,
      onChange: (e: string) => {
        const newLocation = { ...visitationData.locationAddress };
        newLocation.line2 = e;
        dispatch(updateDataVisitation({ type: 'locationAddress', value: newLocation }));
        dispatch(updateRegion({ ...region, line1: e }));
      },
      value: visitationData.locationAddress?.line2,
      placeholder: 'contoh: Jalan Kusumadinata no 5',
    },
  ];

  // map function
  const mapRef = React.useRef<MapView>(null);
  const onChangeRegion = async (coordinate: Region) => {
    try {
      customLog(coordinate, 'coordinateonchange66');
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
        lat: 0,
        lon: 0,
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
      setIsMapLoading(() => false);
      customLog(JSON.stringify(error), 'onChangeRegionerror');
    }
  };

  const debounceResult = React.useMemo(() => debounce(onChangeRegion, 500), []);
  React.useEffect(() => {
    return () => {
      debounceResult.cancel();
    };
  }, []);

  React.useEffect(() => {
    crashlytics().log(CREATE_VISITATION + '-Step1');

    customLog(visitationData.createdLocation?.formattedAddress, 'onEffect');
    if (mapRef.current) {
      mapRef?.current?.animateToRegion(region);
    }
    const locationAddress = {
      ...visitationData.locationAddress,
      ...region,
    };
    customLog(visitationData.locationAddress, 'location117', region);
    customLog(locationAddress, 'locationAddress118');
    dispatch(updateDataVisitation({ type: 'locationAddress', value: locationAddress }));
  }, [
    region.formattedAddress,
    visitationData.createdLocation?.formattedAddress,
  ]);

  const [, send] = useMachine(deviceLocationMachine, {
    actions: {
      dispatchState: (context, _event, _meta) => {
        const coordinate = {
          longitude: context?.lon,
          latitude: context?.lat,
          formattedAddress: context?.formattedAddress,
          PostalId: context?.PostalId,
        };
        dispatch(updateDataVisitation({ type: 'createdLocation', value: context }));
        if (region.latitude === 0) {
          dispatch(updateRegion(coordinate));
        }
      },
    },
  });

  React.useEffect(() => {
    const isExist =
      !visitationData.createdLocation?.lat ||
      visitationData.createdLocation?.lon === 0;

    if (isExist) {
      customLog('jalan143');
      send('askingPermission');
    }
  }, []);

  const nameAddress = React.useMemo(() => {
    const idx = region.formattedAddress?.split(',');
    if (idx && idx?.length > 1) {
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
    flex: 1,
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
