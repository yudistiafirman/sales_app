import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import BSpacer from '../atoms/BSpacer';
import BCommonCompanyCard from '../molecules/BCommonCompanyCard';

type ProductsData = {
  name: string;
  volume: number;
  pricePerVol: number;
  totalPrice: number;
};

export type SPH = {
  no: string;
  totalPrice: number;
  checked?: boolean;
  productsData: ProductsData[];
};

export type CompanyData = {
  name?: string;
  location?: string;
  paymentType?: 'CBD' | 'CREDIT';
  sph?: SPH[];
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
          onPress={() => onPress(item)}
          sph={item.sph}
          needRightIcon={needRightIcon}
        />
      );
    },
    [needRightIcon, onPress, searchQuery]
  );

  const renderItemSeparator = () => {
    return <BSpacer size="extraSmall" />;
  };
  return (
    <FlatList
      data={companyData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={renderItemSeparator}
    />
  );
};

export default BCommonCompanyList;
