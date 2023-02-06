import { BVisitationCard } from '@/components';
import React, { useCallback } from 'react';
import { ListRenderItem, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

type SphData = {
  company_displayName: string;
  location: string;
  sph: [
    {
      no: string;
      productName: string;
      unit: number;
      pricePerUnit: number;
      total: number;
    }
  ];
};

interface SphListProps {
  sphData: SphData[];
  onPress: (data: SphData) => void;
}

const SphList = ({ sphData, onPress }: SphListProps) => {
  const renderItem: ListRenderItem<SphData> = useCallback(({ item, index }) => {
    return <View />;
  }, []);
  return (
    <FlatList
      data={sphData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};

export default SphList;
