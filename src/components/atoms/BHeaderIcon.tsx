import Icon from 'react-native-vector-icons/Feather';

import React from 'react';
import { TouchableOpacity } from 'react-native';
import resScale from '@/utils/resScale';
import colors from '@/constants/colors';

interface BHeaderIconProps {
  onBack?: () => void;
  size: number;
  iconName: 'chevron-left' | 'x';
  marginRight?: number;
}

const BHeaderIcon = ({
  onBack,
  size,
  iconName,
  marginRight = resScale(26),
}: BHeaderIconProps) => {
  return (
    <TouchableOpacity style={{ marginRight: marginRight }} onPress={onBack}>
      <Icon name={iconName} size={size} color={colors.text.darker} />
    </TouchableOpacity>
  );
};

export default BHeaderIcon;
