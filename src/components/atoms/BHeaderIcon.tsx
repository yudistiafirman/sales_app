import Icon from 'react-native-vector-icons/Feather';
import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import resScale from '@/utils/resScale';
import colors from '@/constants/colors';

interface BHeaderIconProps {
  onBack?: () => void;
  size: number;
  iconName: 'chevron-left' | 'x' | 'arrow-left';
  marginRight?: number;
  marginLeft?: number;
}

const BHeaderIcon = ({
  onBack,
  size,
  iconName,
  marginRight = resScale(26),
  marginLeft = 0,
}: BHeaderIconProps) => {
  return (
    <TouchableOpacity
      style={{
        marginRight: marginRight,
        marginLeft: marginLeft,
      }}
      onPress={onBack}
    >
      <Icon name={iconName} size={size} color={colors.text.darker} />
    </TouchableOpacity>
  );
};

export default BHeaderIcon;
