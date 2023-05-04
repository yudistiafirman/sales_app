import colors from '@/constants/colors';
import resScale from '@/utils/resScale';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import SearchAreaStyles from '../styles';
import Icons from 'react-native-vector-icons/Feather';
import { BSpacer, BText } from '@/components';
import { layout } from '@/constants';

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
          style={{ marginRight: layout.pad.ml }}
        />

        <View>
          <BText style={SearchAreaStyles.addressTitle}>{addressTitle}</BText>
          <BSpacer size={layout.pad.xs} />
          <BText style={SearchAreaStyles.addressDetail}>{addressDetail}</BText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LocationListCard;
