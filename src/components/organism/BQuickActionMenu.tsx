import { View, FlatList } from 'react-native';
import React from 'react';
import { QuickActionProps } from '@/interfaces/QuickActionButton.type';
import BQuickActionButton from '../molecules/BQuickAction';
import { layout } from '@/constants';

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
