import { BSpinner } from '@/components';
import EmptyProduct from '@/components/templates/Price/EmptyProduct';
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
  onPress: (place_id: string) => void;
}

const LocationList = <ArrayOfObject extends LocationData>({
  locationData,
  onPress,
}: LocationDatarops<ArrayOfObject>) => {
  return (
    <FlatList
      data={locationData}
      keyExtractor={(item, index) => index.toString()}
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
