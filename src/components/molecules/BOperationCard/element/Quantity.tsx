import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import resScale from '@/utils/resScale';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { layout } from '@/constants';

type quantityType = {
  name?: string;
  date?: string;
};
export default function Quantity({ name, date }: quantityType) {
  if (!name) {
    return null;
  }
  return (
    <View style={style.parent}>
      <View style={style.containerOne}>
        <FontAwesome name="database" style={style.iconStyle} size={13} />
        <Text>{name}</Text>
      </View>
      {date && (
        <View style={style.containerTwo}>
          <FontAwesome name="calendar" style={style.iconStyle} size={13} />
          <Text>{date}</Text>
        </View>
      )}
    </View>
  );
}
const style = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerOne: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: layout.pad.md,
    justifyContent: 'center',
  },
  containerTwo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: layout.pad.md,
    justifyContent: 'center',
  },
  iconStyle: {
    marginRight: resScale(7),
  },
});
