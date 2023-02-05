import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

import PillStatus from './elements/PillStatus';
import Time from './elements/Time';
import VisitStatus from './elements/VisitStatus';

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import resScale from '@/utils/resScale';
import PillNames from './elements/PillNames';
import HighlightText from '../../atoms/BHighlightText';
import { colors, layout } from '@/constants';
import BLocationText from '@/components/atoms/BLocationText';
import { visitationDataType } from '@/interfaces';

// type visitationDataType = {
//   id?: number;
//   name: string;
//   location?: string;
//   time?: string;
//   status?: string;
//   pilNames?: string[];
//   pilStatus?: string;
// };

type VisitationCardType = {
  id?: string;
  item: visitationDataType;
  searchQuery?: string;
  onPress?: (data: visitationDataType) => void;
  isRenderIcon?: boolean;
  customIcon?: () => JSX.Element;
};

function iconRender(
  isRenderIcon: boolean,
  customIcon: (() => JSX.Element) | undefined
) {
  if (!isRenderIcon) {
    return null;
  }
  if (customIcon) {
    return customIcon();
  }
  return <MaterialIcon size={30} name="chevron-right" color={'#000000'} />;
}

export default function BVisitationCard({
  item,
  searchQuery,
  onPress = () => {},
  isRenderIcon = true,
  customIcon,
}: VisitationCardType) {
  return (
    <View style={style.container}>
      <View style={style.leftSide}>
        <View style={style.top}>
          <HighlightText
            fontSize={14}
            name={item.name}
            searchQuery={searchQuery}
          />
          <PillStatus pilStatus={item.pilStatus} />
        </View>
        <BLocationText location={item.location} />
        <PillNames pilNames={item.pilNames} searchQuery={searchQuery} />
        <View
          style={[style.row, item.time || item.status ? style.bottom : null]}
        >
          <Time time={item.time} />
          <VisitStatus status={item.status} />
        </View>
      </View>
      <TouchableOpacity
        style={style.rightSide}
        onPress={() => {
          onPress(item);
        }}
      >
        {iconRender(isRenderIcon, customIcon)}
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: resScale(330),
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    borderColor: '#EBEBEB',
    borderRadius: layout.radius.md,
    borderWidth: resScale(1),
    marginBottom: layout.pad.md,
    padding: layout.pad.md,
  },
  leftSide: {
    justifyContent: 'space-between',
  },
  rightSide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    // height: resScale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: layout.pad.sm,
    width: resScale(275),
  },
  row: {
    flexDirection: 'row',
  },
  bottom: {
    marginTop: layout.pad.md,
  },
});
