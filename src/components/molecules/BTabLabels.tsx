import colors from '@/constants/colors';
import font from '@/constants/fonts';
import scaleSize from '@/utils/scale';
import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import BChip from '../atoms/BChip';
import BText from '../atoms/BText';

type Route = {
  key: string;
  title: string;
  totalItems: number;
  chipPosition: 'right' | 'bottom';
};

interface BTabLabelsProps {
  route: Route;
  focused: boolean;
}

const BTabLabels = ({ route, focused }: BTabLabelsProps) => {
  const { title, totalItems, chipPosition } = route;
  const rightChipPosition = chipPosition === 'right';
  const chipBackgroundColor = rightChipPosition ? colors.chip.disabled : '';

  const BTabLabelsContainer: ViewStyle = {
    flexDirection: rightChipPosition ? 'row' : 'column',
    alignItems: 'center',
  };

  const BTabLabelsTextStyle: TextStyle = {
    color: focused ? colors.primary : colors.text.dark,
    fontFamily: focused
      ? font.family.montserrat['600']
      : font.family.montserrat['400'],
    fontSize: font.size.md,
    marginRight: scaleSize.moderateScale(4),
  };

  return (
    <View style={BTabLabelsContainer}>
      <BText style={BTabLabelsTextStyle}>{title}</BText>
      <BChip type="header" backgroundColor={chipBackgroundColor}>
        {totalItems}
      </BChip>
    </View>
  );
};

export default BTabLabels;
