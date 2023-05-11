import * as React from 'react';
import { Dimensions, Platform, View, ViewStyle } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { BLocationProps } from '@/interfaces';
import resScale from '@/utils/resScale';
import BMarker from '../atoms/BMarker';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = -6.18897;
const LONGITUDE = 106.738909;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const ANDROID = Platform.OS === 'android';
const MAPSPROVIDER = ANDROID ? PROVIDER_GOOGLE : PROVIDER_DEFAULT;

const BLocationDefaultStyle = {
  width,
  height: height - resScale(64),
};

const BLocationDefaultRegion = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const BLocationDefaultProps = {
  mapStyle: BLocationDefaultStyle,
  region: BLocationDefaultRegion,
  scrollEnabled: false || true,
};

const fixedCenterContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

const BLocation = React.forwardRef(
  (
    {
      mapStyle,
      region,
      onRegionChangeComplete,
      onRegionChange,
      CustomMarker,
      onMapReady,
      scrollEnabled = true,
    }: BLocationProps & typeof BLocationDefaultProps,
    ref: React.LegacyRef<MapView> | undefined
  ) => (
    <View style={fixedCenterContainer}>
      <MapView
        ref={ref}
        style={mapStyle}
        initialRegion={region}
        provider={MAPSPROVIDER}
        rotateEnabled={false}
        onMapReady={onMapReady}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChangeComplete}
        region={region}
        scrollEnabled={scrollEnabled}
        pitchEnabled={scrollEnabled}
        zoomTapEnabled={scrollEnabled}
        scrollDuringRotateOrZoomEnabled={scrollEnabled}
      />
      {CustomMarker || <BMarker />}
    </View>
  )
);

BLocation.defaultProps = BLocationDefaultProps;

export default BLocation;
