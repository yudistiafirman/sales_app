import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function BVisitationCard() {
  return (
    <View style={style.container}>
      <View>
        <Text>kiri</Text>
      </View>
      <View>
        <Text>kanan</Text>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: 328,
    height: 120,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  leftSide: {},
  rightSide: {},
});
