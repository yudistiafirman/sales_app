import BText from '@/components/atoms/BText';
import colors from '@/constants/colors';
import resScale from '@/utils/resScale';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import SearchAreaStyles from '../styles';
import Icons from 'react-native-vector-icons/Feather';

interface LocationListCardProps {
  onPress: () => void;
  addressTitle: string;
  addressDetail: string;
}

const LocationListCard = ({
  onPress,
  addressTitle,
  addressDetail,
}: LocationListCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={SearchAreaStyles.locationListCardContainer}
    >
      <View style={SearchAreaStyles.innerListContainer}>
        <Icons
          name="map-pin"
          size={resScale(20)}
          color={colors.text.darker}
          style={{ marginRight: resScale(11) }}
        />

        <View>
          <BText style={SearchAreaStyles.addressTitle}>{addressTitle}</BText>
          <BText style={SearchAreaStyles.addressDetail}>{addressDetail}</BText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LocationListCard;
