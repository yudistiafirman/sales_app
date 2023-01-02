import { View, FlatList } from 'react-native';
import React from 'react';
import { QuickActionProps } from '@/interfaces/QuickActionButton.type';
import scaleSize from '@/utils/scale';
import BQuickActionButton from './elements/BQuickActionButton';

export default function BQuickAction({
  buttonProps,
  isHorizontal = true,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  containerStyle,
}: QuickActionProps) {
  return (
    <View style={containerStyle}>
      <FlatList
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        horizontal={isHorizontal}
        data={buttonProps}
        renderItem={BQuickActionButton}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}
