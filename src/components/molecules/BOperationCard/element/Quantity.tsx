import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import resScale from '@/utils/resScale';
import Icons from 'react-native-vector-icons/Feather';
import IconsEntypo from 'react-native-vector-icons/Entypo';
import { layout } from '@/constants';

type quantityType = {
  name?: string;
  date?: string;
  isQuantity: boolean;
};
export default function Quantity({ isQuantity, name, date }: quantityType) {
  if (!name) {
    return null;
  }
  return (
    <View style={style.parent}>
      <View style={style.containerOne}>
        <IconsEntypo
          name={isQuantity ? 'database' : 'text-document'}
          style={style.iconStyle}
          size={13}
        />
        <Text>{name}</Text>
      </View>
      {date && (
        <View style={style.containerTwo}>
          <Icons name="clock" style={style.iconStyle} size={13} />
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
