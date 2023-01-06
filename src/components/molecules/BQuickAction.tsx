import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { buttonDataType } from '@/interfaces/QuickActionButton.type';
import scaleSize from '@/utils/scale';
import font from '@/constants/fonts';
import colors from '@/constants/colors';
import respFS from '@/utils/respFS';

export default function BQuickActionButton({ item }: { item: buttonDataType }) {
  return (
    <TouchableOpacity onPress={item.action}>
      <View style={style.buttonContainer}>
        <Image source={item.icon} />
        <Text style={style.buttonTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
}
const style = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.white,
    width: scaleSize.moderateScale(90),
    height: scaleSize.moderateScale(93),
    borderRadius: scaleSize.moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleSize.moderateScale(10),
  },
  buttonTitle: {
    fontFamily: font.family.montserrat[600],
    color: colors.black,
    fontSize: respFS(12),
    marginTop: scaleSize.moderateScale(8),
  },
});
