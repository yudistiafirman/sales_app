import { ICustomerListData } from '@/models/Customer';
import React from 'react';
import { FlatList, StyleSheet, View, ViewStyle } from 'react-native';
import BSearchBar from '../molecules/BSearchBar';
import { colors, layout } from '@/constants';
import BSpacer from '../atoms/BSpacer';
import BTabSections from '../organism/TabSections';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { resScale } from '@/utils';
import BCard from '../molecules/BCard';
import { TextInput } from 'react-native-paper';
import BEmptyState from '../organism/BEmptyState';
import BShimmerAvatarList from './BShimmerAvatarList';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface IBList {
  data?: ICustomerListData[];
  onEndReached?:
    | ((info: { distanceFromEnd: number }) => void)
    | null
    | undefined;
  refreshing?: boolean;
  emptyPOName?: string;
  isLoadMore?: boolean;
  loadList?: boolean;
  onRefresh?: () => void;
  onPressCard?: (data: any) => void;
  onChangeText: (text: string) => void;
  onClearValue?: () => void;
  onPressMagnify?: () => void;
  searchQuery?: string;
  onTabPress?: (tabroutes: any) => any;
  onIndexChange: (index: number) => void;
  index: number;
  routes: any[];
  errorMessage?: any;
  isError?: boolean;
  placeholder?: string;
  onRetry?: () => void;
  emptyText: string;
  searchBarOutlineStyle?: ViewStyle;
  searchBarInputStyle?: ViewStyle;
  searchBarBgColor?: string;
  tabStyle?: ViewStyle;
  tabBarStyle?: ViewStyle;
  tabTextFocusedColor?: string;
  tabIndicatorStyle?: ViewStyle;
}

const BList = ({
  data,
  onEndReached,
  refreshing,
  emptyPOName,
  isLoadMore,
  loadList,
  onRefresh,
  onPressCard,
  onChangeText,
  onClearValue,
  onPressMagnify,
  searchQuery,
  onTabPress,
  onIndexChange,
  index,
  routes,
  errorMessage,
  isError,
  placeholder,
  onRetry,
  emptyText,
  searchBarOutlineStyle,
  searchBarBgColor,
  searchBarInputStyle,
  tabStyle,
  tabBarStyle,
  tabTextFocusedColor = colors.blueSail,
  tabIndicatorStyle,
}: IBList) => {
  const renderItemSeparator = () => {
    return <BSpacer size="extraSmall" />;
  };

  const renderItem: ListRenderItem<ICustomerListData> = React.useCallback(
    ({ item, index }) => {
      const avatarText = item?.name[0];
      const title = item?.displayName;
      const chipTitle = item?.type === 'COMPANY' ? 'PERUSAHAAN' : item?.type;
      const listTextData = [`Payment Type: -`, `-`];
      const availableDebit = '-';
      const availableCredit = '-';
      const chipBgColor =
        item?.type === 'INDIVIDU'
          ? colors.status.lightYellow
          : colors.status.lightBlue;
      return (
        <BCard
          avatarText={avatarText.toUpperCase()}
          title={title}
          chipStartIcon={
            <Icon
              name={item?.type === 'COMPANY' ? 'building' : 'user'}
              style={{ fontWeight: '600', marginRight: layout.pad.sm }}
              size={layout.pad.md}
            />
          }
          cardBgColor={index % 2 ? colors.veryLightShadeGray : ''}
          onPressCard={() => onPressCard && onPressCard(item)}
          searchQuery={searchQuery}
          chipTitle={chipTitle}
          availableDebit={availableDebit}
          availableCredit={availableCredit}
          listTextData={listTextData}
          chipBgColor={chipBgColor}
        />
      );
    },
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <BSearchBar
          outlineStyle={searchBarOutlineStyle}
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={onChangeText}
          bgColor={searchBarBgColor}
          textInputStyle={searchBarInputStyle}
          left={<TextInput.Icon size={layout.pad.xl} disabled icon="magnify" />}
          right={
            searchQuery &&
            searchQuery.length > 2 && (
              <TextInput.Icon
                onPress={onClearValue}
                size={layout.pad.lg}
                icon="close-circle"
              />
            )
          }
        />
      </View>

      <BSpacer size="extraSmall" />
      {routes.length > 0 && (
        <BTabSections
          swipeEnabled={false}
          navigationState={{ index, routes }}
          renderScene={() => (
            <FlashList
              data={data}
              contentContainerStyle={{
                paddingTop: layout.pad.lg,
              }}
              renderItem={renderItem}
              estimatedItemSize={200}
              initialNumToRender={10}
              onEndReachedThreshold={0.5}
              refreshing={refreshing}
              onRefresh={onRefresh}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={onEndReached}
              ListFooterComponent={isLoadMore ? <BShimmerAvatarList /> : null}
              ListEmptyComponent={
                loadList ? (
                  <BShimmerAvatarList />
                ) : (
                  <BEmptyState
                    errorMessage={errorMessage}
                    isError={isError}
                    onAction={onRetry}
                    emptyText={emptyText}
                  />
                )
              }
            />
          )}
          onTabPress={onTabPress}
          onIndexChange={onIndexChange}
          tabStyle={[styles.tabStyle, { tabStyle }]}
          tabBarStyle={[styles.tabBarStyle, { tabBarStyle }]}
          tabTextFocusedColor={tabTextFocusedColor}
          indicatorStyle={[styles.tabIndicator, { tabIndicatorStyle }]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: layout.pad.lg,
  },
  tabIndicator: {
    backgroundColor: colors.blueSail,
    marginLeft: layout.pad.lg - 4,
  },
  tabStyle: {
    width: 'auto',
    paddingRight: layout.pad.md,
  },
  tabBarStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: layout.pad.ml,
  },
});

export default BList;
