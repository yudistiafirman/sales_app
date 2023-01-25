import * as React from 'react';
import resScale from '@/utils/resScale';
import { Dimensions, Platform, View, ViewStyle } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
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

const BLocationDefaultProps = {
  mapStyle: BLocationDefaultStyle,
  region: BLocationDefaultRegion,
};

const fixedCenterContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

const BLocation = ({
  mapStyle,
  onRegionChangeComplete,
  region,
  CustomMarker,
}: BLocationProps & typeof BLocationDefaultProps) => {
  return (
    <View style={fixedCenterContainer}>
      <MapView
        style={mapStyle}
        initialRegion={region}
        provider={MAPSPROVIDER}
        rotateEnabled={false}
        onRegionChangeComplete={onRegionChangeComplete}
        region={region}
      />
      {CustomMarker}
    </View>
  );
};

BLocation.defaultProps = BLocationDefaultProps;

export default BLocation;
