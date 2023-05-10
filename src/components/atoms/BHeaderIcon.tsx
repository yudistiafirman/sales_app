import Icon from 'react-native-vector-icons/Feather';
import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import resScale from '@/utils/resScale';
import colors from '@/constants/colors';
import { layout } from '@/constants';

interface BHeaderIconProps {
  onBack?: () => void;
  size: number;
  iconName: 'chevron-left' | 'x' | 'arrow-left';
  marginRight?: number;
  marginLeft?: number;
}

function BHeaderIcon({
  onBack,
  size,
  iconName,
  marginRight = layout.pad.xs + layout.pad.md + layout.pad.lg,
  marginLeft = 0,
}: BHeaderIconProps) {
  return (
    <TouchableOpacity
      style={{
        marginRight,
        marginLeft,
      }}
      onPress={onBack}
    >
      <Icon name={iconName} size={size} color={colors.text.darker} />
    </TouchableOpacity>
  );
}

export default BHeaderIcon;
