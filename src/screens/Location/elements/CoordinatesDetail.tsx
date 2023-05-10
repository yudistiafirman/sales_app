import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icons from 'react-native-vector-icons/Feather';
import LocationStyles from '../styles';
import colors from '@/constants/colors';
import resScale from '@/utils/resScale';
import { BText } from '@/components';
import LocationListShimmer from '@/screens/SearchAreaProject/element/LocationListShimmer';

interface CoordinatesDetailsProps {
  address: string;
  onPress: () => void;
  loadingLocation: boolean;
  disable?: boolean;
}

function CoordinatesDetail({
  address,
  onPress,
  loadingLocation,
  disable = false,
}: CoordinatesDetailsProps) {
  const isHasAddress = address.length > 0;
  const addressTitle = isHasAddress ? address.split(',')[0] : '';
  const addressDetail = isHasAddress
    ? address.split(',').join('').substring(addressTitle.length)
    : '';
  if (loadingLocation) {
    return (
      <View style={LocationStyles.coordinateDetailsInnerContainer}>
        <View style={LocationStyles.coordinateDetailsInnerContainer}>
          <LocationListShimmer />
        </View>
      </View>
    );
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disable}
      style={LocationStyles.coordinateDetailsOuterContainer}
    >
      <View style={[LocationStyles.coordinateDetailsInnerContainer]}>
        <View style={LocationStyles.mapIconContainer}>
          <Icons name="map-pin" size={resScale(20)} color={colors.primary} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Text numberOfLines={1} style={LocationStyles.addressTitle}>
            {addressTitle}
          </Text>
          <Text numberOfLines={2} style={LocationStyles.addressDetails}>
            {addressDetail}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default CoordinatesDetail;
