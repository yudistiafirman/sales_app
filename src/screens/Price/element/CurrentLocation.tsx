import colors from '@/constants/colors';
import resScale from '@/utils/resScale';
import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import font from '@/constants/fonts';
import { layout } from '@/constants';
interface CurrentLocationProps {
  location?: string | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

const CurrentLocation = ({ location, onPress }: CurrentLocationProps) => {
  return (
    <TouchableOpacity style={CurrentLocationStyles.container} onPress={onPress}>
      <Icon
        name="map-pin"
        style={{ marginRight: layout.pad.md }}
        color={colors.text.blue}
      />
      <Text numberOfLines={1} style={CurrentLocationStyles.viewMoreText}>
        {location}
      </Text>
    </TouchableOpacity>
  );
};

const CurrentLocationStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: layout.pad.lg,
  },
  viewMoreText: {
    fontFamily: font.family.montserrat['300'],
    fontSize: font.size.xs,
    color: colors.text.blue,
  },
});

export default CurrentLocation;
