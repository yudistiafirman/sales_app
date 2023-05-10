import { FlashList } from '@shopify/flash-list';
import React from 'react';
import LocationListCard from './LocationListCard';
import LocationListShimmer from './LocationListShimmer';
import EmptyState from '@/components/organism/BEmptyState';

interface LocationData {
  description?: string;
  matched_substring?: any[];
  place_id?: string;
  reference?: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substring: any[];
    secodary_text: string;
  };
  terms?: string[];
  types?: string[];
}

interface LocationDatarops<ArrayOfObject> {
  locationData: ArrayOfObject[];
  onPress: (place_id: string) => void;
  isError?: boolean;
  errorMessage?: string;
  isLoading?: boolean;
  searchValue?: string;
  onAction?: () => void;
}

function LocationList<ArrayOfObject extends LocationData>({
  locationData,
  onPress,
  isError,
  errorMessage,
  isLoading,
  searchValue,
  onAction,
}: LocationDatarops<ArrayOfObject>) {
  const renderEmptyComponent = () => {
    if (isLoading) {
      return <LocationListShimmer />;
    }
    if (searchValue?.length > 2) {
      return (
        <EmptyState
          emptyText={`${searchValue} tidak ditemukan!`}
          isError={isError}
          errorMessage={errorMessage}
          onAction={onAction}
        />
      );
    }
  };
  return (
    <FlashList
      estimatedItemSize={10}
      data={locationData}
      render
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={renderEmptyComponent}
      renderItem={({ item }) => (
        <LocationListCard
          addressDetail={item.structured_formatting.secondary_text}
          addressTitle={item.structured_formatting.main_text}
          onPress={() => onPress(item)}
        />
      )}
    />
  );
}

export default LocationList;
