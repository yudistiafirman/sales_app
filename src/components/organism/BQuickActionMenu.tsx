import { View, FlatList } from 'react-native';
import React, { useCallback } from 'react';
import { QuickActionProps } from '@/interfaces/QuickActionButton.type';
import BQuickActionButton from '../molecules/BQuickAction';
import BSpacer from '../atoms/BSpacer';
import { resScale } from '@/utils';
import { layout } from '@/constants';

export default function BQuickAction({
  buttonProps,
  isHorizontal = true,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  containerStyle,
}: QuickActionProps) {
  const separator = useCallback(() => <BSpacer size={'extraSmall'} />, []);
  return (
    <View style={containerStyle}>
      <FlatList
        contentContainerStyle={{ paddingLeft: layout.mainPad }}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        horizontal={isHorizontal}
        data={buttonProps}
        renderItem={BQuickActionButton}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={separator}
      />
    </View>
  );
}
