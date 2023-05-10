import React from 'react';
import { View } from 'react-native';
import BSpacer from '../atoms/BSpacer';
import BPic from '../molecules/BPic';
import { PIC } from '@/interfaces';

interface IProps {
  data: PIC[];
  isOption: boolean;
  onSelect: (index: number) => void;
  isCompetitor: boolean;
}

function BPicList({ data, isOption = false, onSelect, isCompetitor = false }: IProps) {
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
}

export default BPicList;
