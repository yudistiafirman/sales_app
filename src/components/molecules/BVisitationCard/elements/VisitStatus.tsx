import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import resScale from '@/utils/resScale';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

type visitStatusType = {
  status?: string;
};
export default function VisitStatus({ status }: visitStatusType) {
  if (!status) {
    return null;
  }
  return (
    <View style={style.container}>
      <FontAwesome name="list-alt" style={style.iconStyle} size={13} />
      <Text>{status}</Text>
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
