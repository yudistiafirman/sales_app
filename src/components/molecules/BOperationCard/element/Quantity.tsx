import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import resScale from '@/utils/resScale';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type quantityType = {
  name?: string;
};
export default function Quantity({ name }: quantityType) {
  if (!name) {
    return null;
  }
  return (
    <View style={style.container}>
      <FontAwesome name="database" style={style.iconStyle} size={13} />
      <Text>{name}</Text>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginRight: resScale(7),
  },
});
