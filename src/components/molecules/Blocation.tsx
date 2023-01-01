import { scaleSize } from '@/utils';
import * as React from 'react';
import { Dimensions, Platform, ViewStyle } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = -6.18897;
const LONGITUDE = 106.738909;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const ANDROID = Platform.OS === 'android';
const MAPSPROVIDER = ANDROID ? PROVIDER_GOOGLE : PROVIDER_DEFAULT;

type LatLng = {
  latitude: number;
  longitude: number;
};

type Region = LatLng & {
  latitudeDelta: number;
  longitudeDelta: number;
};

type Details = {
  isGesture?: boolean;
};

interface Blocation {
  mapStyle?: ViewStyle | undefined;
  region?: Region | undefined;
  onRegionChange?: ((region: Region, details: Details) => void) | undefined;
  coordinate: LatLng;
  CustomMarker?: React.ReactNode | undefined;
}

const bLocationDefaultStyle = {
  width: width,
  height: height - scaleSize.moderateScale(64),
};

const bLocationDefaultRegion = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const bLocationDefaultProps = {
  mapStyle: bLocationDefaultStyle,
  region: bLocationDefaultRegion,
  coordinate: bLocationDefaultRegion,
};

const Blocation = ({
  mapStyle,
  region,
  onRegionChange,
  coordinate,
  CustomMarker,
}: Blocation & typeof bLocationDefaultProps) => {
  return (
    <MapView
      style={mapStyle}
      initialRegion={region}
      provider={MAPSPROVIDER}
      onRegionChange={onRegionChange}
      rotateEnabled={false}
    >
      <Marker coordinate={coordinate}>{CustomMarker}</Marker>
    </MapView>
  );
};

Blocation.defaultProps = bLocationDefaultProps;

export default Blocation;
