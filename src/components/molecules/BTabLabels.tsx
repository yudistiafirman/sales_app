import colors from '@/constants/colors';
import font from '@/constants/fonts';
import resScale from '@/utils/resScale';
import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import BChip from '../atoms/BChip';
import BText from '../atoms/BText';

type Route = {
  key: string;
  title: string;
  totalItems?: number;
  chipPosition?: 'right' | 'bottom' | undefined;
};

interface BTabLabelsProps {
  route: Route;
  focused: boolean;
}

const BTabLabels = ({ route, focused }: BTabLabelsProps) => {
  const isHasItems = route?.totalItems > 0;
  const rightChipPosition = route?.chipPosition === 'right';

  const chipBackgroundColor = rightChipPosition ? colors.chip.disabled : '';
  const BTabLabelsContainer: ViewStyle = {
    flexDirection: rightChipPosition ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const BTabLabelsTextStyle: TextStyle = {
    color: focused ? colors.primary : colors.text.dark,
    fontFamily: focused
      ? font.family.montserrat['600']
      : font.family.montserrat['400'],
    fontSize: font.size.md,
    marginRight: isHasItems ? 4 : 0,
  };
  return (
    <View style={BTabLabelsContainer}>
      <BText style={BTabLabelsTextStyle}>{route.title}</BText>

      <BChip
        type="header"
        backgroundColor={isHasItems ? chipBackgroundColor : null}
      >
        {isHasItems && route?.totalItems}
      </BChip>
    </View>
  );
};

export default BTabLabels;
