import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { buttonDataType } from '@/interfaces/QuickActionButton.type';
import resScale from '@/utils/resScale';
import font from '@/constants/fonts';
import colors from '@/constants/colors';

import { fonts, layout } from '@/constants';
import BSvg from '../atoms/BSvg';

export default function BQuickActionButton({ item }: { item: buttonDataType }) {
  return (
    <TouchableOpacity onPress={item.action}>
      <View style={style.buttonContainer}>
        <BSvg
          svgName={item.icon}
          width={resScale(48)}
          height={resScale(48)}
          type="fill"
          color={colors.white}
        />
        <Text style={style.buttonTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
}
const style = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.white,
    width: resScale(82),
    height: resScale(98),
    borderRadius: layout.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.pad.lg,
  },
  buttonTitle: {
    fontFamily: font.family.montserrat[400],
    color: colors.black,
    fontSize: fonts.size.sm,
    marginTop: layout.pad.md,
    textAlign: 'center',
  },
});
