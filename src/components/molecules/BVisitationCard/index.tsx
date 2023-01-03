import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import font from '@/constants/fonts';
import colors from '@/constants/colors';
import respFS from '@/utils/respFS';

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
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
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10
        }}>
          <SimpleLineIcons
            name='location-pin'
            size={13}
            color='#0080FF'
            style={{
              marginRight:7
            }}
          />
          <Text
          style={{
            color: '#0080FF',
            fontFamily: font.family.montserrat[300],
            fontSize: respFS(12)
          }}
          >Jakarta Selatan</Text>
        </View>
        <View style={{
          flexDirection: 'row',
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight:7
          }}>
            <MaterialIcon name="clock-time-four-outline" 
            style={{
              marginRight:7
            }}
            size={13}
            />
            <Text>12:00</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <FontAwesome name="list-alt"
            style={{
              marginRight:7
            }}
            size={13}
            />
            <Text>visit ke 7</Text>
          </View>
        </View>

      </View>
      <View style={style.rightSide}>
        <MaterialIcon
        size={30}
        name='chevron-right'
        />

      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: 350,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderColor: '#EBEBEB',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 8,
  },
  leftSide: {
    justifyContent: 'space-between',

  },
  rightSide: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    width: 40,

  },
  top: {
    height: 20,
    width: 300,
    flexDirection:'row', 
    justifyContent: 'space-between',
    marginBottom:10
  }
});
