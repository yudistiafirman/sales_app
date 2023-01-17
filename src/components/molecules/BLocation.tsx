import * as React from 'react';
import resScale from '@/utils/resScale';
import { Dimensions, Platform, ViewStyle } from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Circle,
} from 'react-native-maps';
import colors from '@/constants/colors';
import { BLocationProps } from '@/interfaces';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRoute } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = -6.18897;
const LONGITUDE = 106.738909;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const ANDROID = Platform.OS === 'android';
const MAPSPROVIDER = ANDROID ? PROVIDER_GOOGLE : PROVIDER_DEFAULT;

const bLocationDefaultStyle = {
  width: width,
  height: height - resScale(64),
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

const BLocation = React.forwardRef(
  (
    {
      mapStyle,
      region,
      onRegionChange,
      coordinate,
      CustomMarker,
    }: BLocationProps & typeof bLocationDefaultProps,
    ref: React.LegacyRef<MapView> | undefined
  ) => {
    // const mapRef = React.useRef<MapView>(null);
    // // const { region: regionRedux } = useSelector(
    // //   (state: RootState) => state.location
    // // );

    // React.useEffect(() => {
    //   console.log(region, 'ini value?');
    //   if (mapRef.current) {
    //     mapRef.current?.animateToRegion(region);
    //   }
    // }, [region.latitude]);

    return (
      <MapView
        ref={ref}
        style={mapStyle}
        initialRegion={region}
        provider={MAPSPROVIDER}
        onRegionChange={onRegionChange}
        rotateEnabled={false}
      >
        <Marker coordinate={region}>{CustomMarker}</Marker>
        <Circle
          center={region}
          fillColor={`${colors.primary}60`}
          radius={700}
          strokeWidth={0}
        />
      </MapView>
    );
  }
);

BLocation.defaultProps = bLocationDefaultProps;

export default BLocation;
