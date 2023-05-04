import { View } from 'react-native';
import React from 'react';
import { QuickActionProps } from '@/interfaces/QuickActionButton.type';
import BQuickActionButton from '../molecules/BQuickAction';
import { layout } from '@/constants';
import { FlashList } from '@shopify/flash-list';

export default function BQuickAction({
  buttonProps,
  isHorizontal = true,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  containerStyle,
}: QuickActionProps) {
  return (
    <View style={containerStyle}>
      <FlashList
        estimatedItemSize={6}
        contentContainerStyle={{ paddingLeft: layout.pad.lg }}
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
