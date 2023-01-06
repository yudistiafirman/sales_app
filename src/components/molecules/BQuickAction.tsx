import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { buttonDataType } from '@/interfaces/QuickActionButton.type';
import resScale from '@/utils/resScale';
import font from '@/constants/fonts';
import colors from '@/constants/colors';
import respFS from '@/utils/resFontSize';

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
    width: resScale(90),
    height: resScale(93),
    borderRadius: resScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: resScale(10),
  },
  buttonTitle: {
    fontFamily: font.family.montserrat[600],
    color: colors.black,
    fontSize: respFS(12),
    marginTop: resScale(8),
  },
});
