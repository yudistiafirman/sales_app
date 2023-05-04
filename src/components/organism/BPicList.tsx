import { PIC } from '@/interfaces';
import React from 'react';
import { View } from 'react-native';
import BSpacer from '../atoms/BSpacer';
import BPic from '../molecules/BPic';

interface IProps {
  data: PIC[];
  isOption: boolean;
  onSelect: (index: number) => void;
  isCompetitor: boolean;
}

const BPicList = ({
  data,
  isOption = false,
  onSelect,
  isCompetitor = false,
}: IProps) => {
  return (
    <View>
      {data?.map((el, key) => (
        <React.Fragment key={key}>
          <View>
            <BPic
              isOption={isOption}
              isSelected={el.isSelected}
              {...el}
              onSelect={onSelect}
              index={key}
              isCompetitor={isCompetitor}
            />
          </View>
          <BSpacer size="extraSmall" />
        </React.Fragment>
      ))}
    </View>
  );
};

export default BPicList;
