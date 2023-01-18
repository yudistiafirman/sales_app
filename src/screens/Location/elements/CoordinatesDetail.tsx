import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import LocationStyles from '../styles';
import Icons from 'react-native-vector-icons/Feather';
import colors from '@/constants/colors';
import resScale from '@/utils/resScale';
import { BText } from '@/components';

interface CoordinatesDetailsProps {
  address: string;
  onPress: () => void;
}

const CoordinatesDetail = ({ address, onPress }: CoordinatesDetailsProps) => {
  const isHasAddress = address.length > 0;
  const addressTitle = isHasAddress ? address.split(',')[0] : '';
  const addressDetail = isHasAddress
    ? address.split(',').join('').substring(addressTitle.length)
    : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={LocationStyles.coordinateDetailsOuterContainer}
    >
      <View style={LocationStyles.coordinateDetailsInnerContainer}>
        <View style={LocationStyles.mapIconContainer}>
          <Icons name="map-pin" size={resScale(20)} color={colors.primary} />
        </View>
        <View style={{ flex: 0.9 }}>
          <BText style={LocationStyles.addressTitle}>{addressTitle}</BText>
          <BText style={LocationStyles.addressDetails}>{addressDetail}</BText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CoordinatesDetail;
