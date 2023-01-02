import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import font from '@/constants/fonts';
import colors from '@/constants/colors';
import respFS from '@/utils/respFS';

export default function BVisitationCard() {
  return (
    <View style={style.container}>
      <View style={style.leftSide}>
        <View style={style.top}>
          <Text
          style={{
            fontFamily: font.family.montserrat[500],
            fontSize: respFS(14),
            color: colors.textInput.input
          }}
          numberOfLines={1}
          >PT. Guna Karya Mandiriiiiii iiiiiiaiushniuhiuii</Text>
          <View style={{
            padding:2,
            backgroundColor: '#C2FCC8',
            paddingVertical: 1,
            paddingHorizontal: 10,
            borderRadius: 32
          }}>
            <Text style={{
               fontFamily: font.family.montserrat[300],
            fontSize: respFS(10),
            color: colors.textInput.input
            }}
            >Selesai</Text>
          </View>
        </View>
        <View>
          <Text>lokasi</Text>
        </View>
        <View style={{
          flexDirection: 'row'
        }}>
          <Text>waktu</Text>
          <Text>visit</Text>
        </View>

      </View>
      <View style={style.rightSide}>
        <Text>kanan</Text>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: 350,
    height: 100,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderColor: '#EBEBEB',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 8,
  },
  leftSide: {
    justifyContent: 'space-between'
  },
  rightSide: {
    justifyContent: 'center'
  },
  top: {
    height: 20,
    width: 300,
    flexDirection:'row', 
    justifyContent: 'space-between',
  }
});
