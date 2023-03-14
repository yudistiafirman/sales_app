import BVisitationCard from '@/components/molecules/BVisitationCard';
import { colors, layout } from '@/constants';
import * as React from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import BCommonListShimmer from './BCommonListShimmer';
import { selectedCompanyInterface, visitationDataType } from '@/interfaces';
import BSpacer from '@/components/atoms/BSpacer';
import { CreatedSPHListResponse } from '@/interfaces/CreatePurchaseOrder';
import BSearchBar from '@/components/molecules/BSearchBar';
import { TextInput } from 'react-native-paper';
import BTabSections from '@/components/organism/TabSections';
import BEmptyState from '../organism/BEmptyState';
type POData = {
  companyName: string;
  locationName: string;
  sphs: any[];
  id: string;
};

type ListRenderItemData = POData & CreatedSPHListResponse & selectedCompanyInterface;

interface BCommonSearchListProps<ArrayOfObject> {
  data: ArrayOfObject[];
  onEndReached?:
    | ((info: { distanceFromEnd: number }) => void)
    | null
    | undefined;
  refreshing?: boolean;
  emptyPOName?: string;
  isLoadMore?: boolean;
  loadList?: boolean;
  onRefresh?: () => void;
  onPressList?: (data: any) => void;
  colorStatus?: string;
  onChangeText: (text: string) => void;
  onClearValue?:()=> void;
  onPressMagnify?:()=> void;
  searchQuery: string;
  onTabPress?: (tabroutes: any) => any;
  onIndexChange: (index: number) => void;
  index: number;
  routes: any[];
  errorMessage?: string;
  isError?: boolean;
  placeholder?: string;
  onRetry?: () => void;
  emptyText: string;
}

const BCommonSearchList = <ArrayOfObject extends ListRenderItemData>({
  data,
  onEndReached,
  refreshing,
  errorMessage,
  isLoadMore,
  onRefresh,
  loadList,
  onPressList,
  onChangeText,
  searchQuery,
  onTabPress,
  onIndexChange,
  index,
  routes,
  isError,
  onRetry,
  placeholder,
  emptyText,
  onClearValue,
  onPressMagnify,
}: BCommonSearchListProps<ArrayOfObject>) => {
  const isSearching = searchQuery.length > 2;
  const renderItem: ListRenderItem<ListRenderItemData> = React.useCallback(
    ({ item, idx }) => {
      let picOrCompanyName;
      if (item?.Company?.name) {
        picOrCompanyName = item.Company?.name;
      } else if (item?.mainPic?.name) {
        picOrCompanyName = item?.mainPic?.name;
      }
      const constructVisitationData: visitationDataType = {
        id: idx,
        name: item?.companyName || item?.name,
        location:
          item.locationName || item?.ShippingAddress?.Postal?.City?.name || item?.location || item?.locationAddress?.line1,
        pilNames:
          item?.sphs?.map((it) => it.name) ||
          item?.QuotationRequests?.map((val) => val?.QuotationLetter?.number),
          picOrCompanyName: picOrCompanyName,
        status:item?.status,
        pilStatus:item?.pilStatus
       
      };
      return (
        <>
          <BSpacer size={'small'} />
          <BVisitationCard
            item={constructVisitationData}
            key={item.id}
            onPress={onPressList ? () => onPressList(item) : undefined}
            isRenderIcon
            pillColor={colors.status.orange}
            searchQuery={searchQuery}
          />
        </>
      );
    },
    [onPressList, searchQuery]
  );
  return (
    <View style={styles.container}>
      <BSearchBar
        value={searchQuery}
        onChangeText={(text) => onChangeText(text)}
        left={<TextInput.Icon onPress={onPressMagnify && onPressMagnify} forceTextInputFocus={false} icon="magnify" />}
        right={onClearValue && <TextInput.Icon
          onPress={onClearValue}
          forceTextInputFocus={false}
          icon="close"
        />}
        placeholder={placeholder}
      />
      <BSpacer size="extraSmall" />
      {isSearching && (
        <BTabSections
          navigationState={{ index, routes }}
          swipeEnabled={false}
          onTabPress={onTabPress}
          onIndexChange={onIndexChange}
          renderScene={() => (
            <>
              <BSpacer size="extraSmall" />
              <FlatList
                data={data}
                removeClippedSubviews={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                onRefresh={onRefresh}
                keyExtractor={(item, indx) => indx.toString()}
                onEndReached={onEndReached}
                refreshing={refreshing}
                ListFooterComponent={isLoadMore ? <BCommonListShimmer /> : null}
                ListEmptyComponent={
                  loadList ? (
                    <BCommonListShimmer />
                  ) : (
                    <BEmptyState
                      errorMessage={errorMessage}
                      isError={isError}
                      onAction={onRetry}
                      emptyText={emptyText}
                    />
                  )
                }
                renderItem={renderItem}
              />
            </>
          )}
          tabStyle={styles.tabStyle}
          tabBarStyle={styles.tabBarStyle}
          indicatorStyle={styles.tabIndicator}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabIndicator: {
    backgroundColor: colors.primary,
  },
  tabStyle: {
    flex: 1,
  },
  tabBarStyle: {
    backgroundColor: colors.white,
  },
});

export default BCommonSearchList;
