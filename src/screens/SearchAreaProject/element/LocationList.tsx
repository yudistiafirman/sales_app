import EmptyState from '@/components/organism/BEmptyState';
import React from 'react';
import { FlatList } from 'react-native';
import LocationListCard from './LocationListCard';
import LocationListShimmer from './LocationListShimmer';

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

const LocationList = <ArrayOfObject extends LocationData>({
  locationData,
  onPress,
  isError,
  errorMessage,
  isLoading,
  searchValue,
  onAction,
}: LocationDatarops<ArrayOfObject>) => {
  const renderEmptyComponent = () => {
    if (isLoading) {
      return <LocationListShimmer />;
    } else if (searchValue?.length > 2) {
      return (
        <EmptyState
          emptyText={`Pencarian mu ${searchValue} tidak ada. Coba cari alamat lainnya.`}
          isError={isError}
          errorMessage={errorMessage}
          onAction={onAction}
        />
      );
    }
  };
  return (
    <FlatList
      data={locationData}
      render
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={renderEmptyComponent}
      renderItem={({ item }) => (
        <LocationListCard
          addressDetail={item.structured_formatting.secondary_text}
          addressTitle={item.structured_formatting.main_text}
          onPress={() => onPress(item.place_id)}
        />
      )}
    />
  );
};

export default LocationList;
