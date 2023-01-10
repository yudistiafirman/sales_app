import colors from '@/constants/colors';
import resScale from '@/utils/resScale';
import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import font from '@/constants/fonts';
import { BText, BViewMoreText } from '@/components';
interface CurrentLocationProps {
  location?: string | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

const CurrentLocation = ({ location, onPress }: CurrentLocationProps) => {
  return (
    <TouchableOpacity style={CurrentLocationStyles.container} onPress={onPress}>
      <Icon
        name="map-pin"
        style={{ marginRight: resScale(8) }}
        color={colors.text.blue}
      />
      <BViewMoreText textStyle={{ width: resScale(316) }} numberOfLines={1}>
        <BText style={CurrentLocationStyles.viewMoreText}>{location}</BText>
      </BViewMoreText>
    </TouchableOpacity>
  );
};

const CurrentLocationStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: resScale(16),
    marginBottom: resScale(9.5),
  },
  viewMoreText: {
    fontFamily: font.family.montserrat['300'],
    fontSize: font.size.xs,
    color: colors.text.blue,
  },
});

export default CurrentLocation;
