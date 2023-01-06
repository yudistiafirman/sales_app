import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import LocationStyles from '../styles';
import Icons from 'react-native-vector-icons/Feather';
import BText from '@/components/atoms/BText';
import colors from '@/constants/colors';
import resScale from '@/utils/resScale';

interface CoordinatesDetailsProps {
  addressTitle: string;
  addressDetail: string;
  onPress: () => void;
}

const CoordinatesDetail = ({
  addressTitle,
  addressDetail,
  onPress,
}: CoordinatesDetailsProps) => {
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
