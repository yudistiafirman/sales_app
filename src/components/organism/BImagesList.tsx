import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import BAddImage from '../molecules/BAddImage';
import BImageCard from '../molecules/BImageCard';

type ImageData = {
  photo?: {
    uri: string;
    type: string;
    name: string;
  } | null;
};

interface BImageListProps {
  imageData?: ImageData[];
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
}

const BImageList = ({
  imageData,

  onAddImage,
  onRemoveImage,
}: BImageListProps) => {
  const renderItem: ListRenderItem<ImageData> = useCallback(
    ({ item, index }) => {
      console.log('ini item',item.photo?.uri)
      if (!item.photo) {
        return <BAddImage onAddImage={onAddImage} />;
      }
      return (
        <BImageCard
          uri={item?.photo?.uri}
          onRemoveImage={() => onRemoveImage(index)}
        />
      );
    },
    [onAddImage, onRemoveImage]
  );
  return (
    <FlatList
      data={imageData}
      numColumns={3}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};

export default BImageList;
