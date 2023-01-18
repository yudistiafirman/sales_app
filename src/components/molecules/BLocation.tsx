import * as React from 'react';
import resScale from '@/utils/resScale';
import { Dimensions, Platform } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Circle,
} from 'react-native-maps';
import colors from '@/constants/colors';
import { BLocationProps } from '@/interfaces';
const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = -6.18897;
const LONGITUDE = 106.738909;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const ANDROID = Platform.OS === 'android';
const MAPSPROVIDER = ANDROID ? PROVIDER_GOOGLE : PROVIDER_DEFAULT;

const BLocationDefaultStyle = {
  width: width,
  height: height - resScale(64),
};

const BLocationDefaultRegion = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const BLocationDefaultCoordinate = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
};

const BLocationDefaultProps = {
  mapStyle: BLocationDefaultStyle,
  region: BLocationDefaultRegion,
  coordinate: BLocationDefaultCoordinate,
};

const BLocation = ({
  mapStyle,
  onRegionChange,
  coordinate,
  region,
  CustomMarker,
}: BLocationProps & typeof BLocationDefaultProps) => {
  return (
    <MapView
      style={mapStyle}
      initialRegion={region}
      provider={MAPSPROVIDER}
      onRegionChangeComplete={onRegionChange}
      rotateEnabled={false}
      region={region}
    >
      <Marker coordinate={coordinate}>{CustomMarker}</Marker>
      <Circle
        center={coordinate}
        fillColor={`${colors.primary}60`}
        radius={700}
        strokeWidth={0.1}
      />
    </MapView>
  );
};

BLocation.defaultProps = BLocationDefaultProps;

export default BLocation;
