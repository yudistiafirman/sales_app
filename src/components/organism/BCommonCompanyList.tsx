import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import BCommonCompanyCard from '../molecules/BCommonCompanyCard';

type ProductsData = {
  display_name: string;
  unit: number;
  price_per_unit: number;
};

export type SPH = {
  no: string;
  totalPrice: number;
  products: ProductsData[];
};

type CompanyData = {
  name: string;
  location: string;
  paymentType: 'CBD' | 'CREDIT';
  sph: SPH[];
};

interface BCompanyCardProps {
  companyData: CompanyData[];
  searchQuery: string;
  onPress: (data: CompanyData) => void;
  needRightIcon?: boolean;
}

const BCommonCompanyList = ({
  companyData,
  searchQuery,
  onPress,
  needRightIcon = true,
}: BCompanyCardProps) => {
  const renderItem: ListRenderItem<CompanyData> = useCallback(
    ({ item }) => {
      return (
        <BCommonCompanyCard
          name={item.name}
          location={item.location}
          searchQuery={searchQuery}
          onPress={onPress}
          sph={item.sph}
          needRightIcon={needRightIcon}
        />
      );
    },
    [needRightIcon, onPress, searchQuery]
  );
  return (
    <FlatList
      data={companyData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};

export default BCommonCompanyList;
