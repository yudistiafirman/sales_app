import { View, StyleSheet, FlatList } from 'react-native';
import React, { useCallback } from 'react';

import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { resScale } from '@/utils';
import { layout } from '@/constants';
import { BSpacer, BOperationCard } from '@/components';
import { useNavigation } from '@react-navigation/native';
import { USER_TYPE } from '@/models/EnumModel';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type FooterType = {
  role?: USER_TYPE;
  isLoading?: boolean;
};
type OperationListType = {
  data: {
    id: string;
    name: string;
    qty?: string;
    status?: string;
    addressID?: string;
  }[];
};

const FooterLoading = ({ isLoading }: FooterType) => {
  if (!isLoading) {
    return null;
  }
  return (
    <View style={style.flatListLoading}>
      <ShimmerPlaceHolder style={style.flatListShimmer} />
    </View>
  );
};

export default function OperationList({
  isLoading,
  data,
  role,
}: FooterType & OperationListType) {
  const navigation = useNavigation();
  const footerComp = useCallback(
    () => <FooterLoading isLoading={isLoading} />,
    [isLoading]
  );
  const separator = useCallback(() => <BSpacer size={'small'} />, []);

  const onClickItem = (id: string) => {
    if (role === USER_TYPE.OPERATION) {
      navigation.navigate('Schedule', { id: id });
    } else {
      navigation.navigate('Camera', {
        photoTitle: 'DO',
        navigateTo: 'return',
      });
    }
  };

  return (
    <FlatList
      style={style.flatList}
      data={data}
      keyExtractor={(item, index) => `${item.name}-${index}`}
      renderItem={({ item }) => {
        return (
          <BOperationCard
            onPress={() => onClickItem(item.id)}
            item={item}
            useChevron
            clickable
          />
        );
      }}
      ListFooterComponent={footerComp}
      ItemSeparatorComponent={separator}
    />
  );
}

const style = StyleSheet.create({
  flatList: {
    width: '100%',
    paddingVertical: layout.pad.lg,
    paddingHorizontal: layout.pad.lg,
  },
  flatListLoading: {
    marginTop: layout.pad.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListShimmer: {
    width: resScale(330),
    height: resScale(60),
    borderRadius: layout.radius.md,
  },
});
