import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

import PillStatus from './elements/PillStatus';
import Time from './elements/Time';
import VisitStatus from './elements/VisitStatus';

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import scaleSize from '@/utils/scale';
import Location from './elements/Location';
import PillNames from './elements/PillNames';
import HighlightText from '../../atoms/BHighlightText';

type VisitationCardType = {
  item: {
    name: string;
    location?: string;
    time?: string;
    status?: string;
    pilNames?: string[];
    pilStatus?: string;
  };
  searchQuery?: string;
};

export default function BVisitationCard({
  item,
  searchQuery,
}: VisitationCardType) {
  return (
    <TouchableOpacity>
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
          <Location location={item.location} />
          <PillNames pilNames={item.pilNames} searchQuery={searchQuery} />
          <View
            style={[style.row, item.time || item.status ? style.bottom : null]}
          >
            <Time time={item.time} />
            <VisitStatus status={item.status} />
          </View>
        </View>
        <View style={style.rightSide}>
          <MaterialIcon size={30} name="chevron-right" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: scaleSize.moderateScale(330),
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderColor: '#EBEBEB',
    borderRadius: scaleSize.moderateScale(8),
    borderWidth: scaleSize.moderateScale(1),
    marginBottom: scaleSize.moderateScale(10),
    paddingVertical: scaleSize.moderateScale(15),
    paddingHorizontal: scaleSize.moderateScale(8),
  },
  leftSide: {
    justifyContent: 'space-between',
  },
  rightSide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    height: scaleSize.moderateScale(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scaleSize.moderateScale(5),
    width: scaleSize.moderateScale(285),
  },
  row: {
    flexDirection: 'row',
  },
  bottom: {
    marginTop: scaleSize.moderateScale(10),
  },
});
