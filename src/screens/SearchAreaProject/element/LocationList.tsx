import BSpinner from '@/components/atoms/BSpinner';
import resScale from '@/utils/resScale';
import React from 'react';
import { FlatList } from 'react-native';
import LocationListCard from './LocationListCard';

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
  onEndReached?:
    | ((info: { distanceFromEnd: number }) => void)
    | null
    | undefined;
  refreshing?: boolean;
  isLoadMore?: boolean;
}

const LocationList = <ArrayOfObject extends LocationData>({
  locationData,
  onEndReached,
  refreshing,
  isLoadMore,
}: LocationDatarops<ArrayOfObject>) => {
  return (
    <FlatList
      data={locationData}
      contentContainerStyle={{ marginHorizontal: resScale(16) }}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={onEndReached}
      refreshing={refreshing}
      ListFooterComponent={isLoadMore ? <BSpinner /> : null}
      renderItem={({ item }) => (
        <LocationListCard
          addressDetail={item.structured_formatting.main_text}
          addressTitle={item.structured_formatting.secodary_text}
          onPress={() => console.log(item.place_id)}
        />
      )}
    />
  );
};

export default LocationList;
