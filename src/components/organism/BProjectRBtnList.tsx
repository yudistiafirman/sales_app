import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import BProjectRBtn from '../molecules/BProjectRBtn';

type BProjectData = {
  id?: string;
  display_name?: string;
  isSelected?: boolean;
};

interface IProps {
  data?: BProjectData[];
  isOption?: boolean;
  onSelect?: (index: number) => void;
}

const BProjectRBtnList = ({ data, isOption, onSelect }: IProps) => {
  const renderItem: ListRenderItem<BProjectData> = useCallback(
    ({ item, index }) => {
      return (
        <BProjectRBtn
          isOption={isOption}
          onSelect={onSelect}
          idx={index}
          projectId={item?.id}
          projectName={item?.display_name}
          isSelected={item?.isSelected}
        />
      );
    },
    [isOption, onSelect]
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};

export default BProjectRBtnList;
