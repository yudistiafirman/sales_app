import colors from '@/constants/colors';
import font from '@/constants/fonts';
import resScale from '@/utils/resScale';
import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import BChip from '../atoms/BChip';
import BText from '../atoms/BText';
import BSpacer from '../atoms/BSpacer';

type Route = {
  key: string;
  title: string;
  totalItems?: number;
  chipPosition?: 'right' | 'bottom' | undefined;
};

interface BTabLabelsProps {
  route: Route;
  focused: boolean;
  tabTextfocusedColor?: string;
  minWidth?: number | undefined;
}

const BTabLabels = ({
  route,
  focused,
  minWidth,
  tabTextfocusedColor = colors.primary,
}: BTabLabelsProps) => {
  const isHasItems = route?.totalItems > 0;
  const rightChipPosition = route?.chipPosition === 'right';

  const chipBackgroundColor = rightChipPosition ? colors.chip.disabled : '';
  const BTabLabelsContainer: ViewStyle = {
    flexDirection: rightChipPosition ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const BTabLabelsTextStyle: TextStyle = {
    color: focused ? tabTextfocusedColor : colors.text.dark,
    fontFamily: focused
      ? font.family.montserrat[600]
      : font.family.montserrat[400],
    fontSize: font.size.md,
    minWidth: minWidth && minWidth,
    alignSelf: 'center',
    textAlign: 'center',
  };

  const BChipStyle: ViewStyle = {
    flex: 1,
    width: resScale(20),
  };
  return (
    <View style={BTabLabelsContainer}>
      <BText style={BTabLabelsTextStyle}>{route.title}</BText>
      <BSpacer size="extraSmall" />
      <BChip
        type="header"
        titleWeight={focused ? '700' : 'normal'}
        textColor={focused && tabTextfocusedColor}
        backgroundColor={isHasItems ? chipBackgroundColor : null}
        style={BChipStyle}
      >
        {isHasItems && route?.totalItems}
      </BChip>
    </View>
  );
};

export default BTabLabels;
