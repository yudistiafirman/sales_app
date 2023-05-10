import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import BSvg from '../atoms/BSvg';
import { fonts, layout } from '@/constants';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import { buttonDataType } from '@/interfaces/QuickActionButton.type';
import resScale from '@/utils/resScale';

export default function BQuickActionButton({ item }: { item: buttonDataType }) {
  const title = item.title.split(' ');
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
        {title.length > 2 ? (
          <Text style={style.buttonTitle}>{item.title}</Text>
        ) : (
          <>
            <Text style={style.buttonTitle}>{title[0]}</Text>
            <Text style={style.buttonTitle}>{title[1]}</Text>
          </>
        )}
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
    textAlign: 'center',
    lineHeight: layout.pad.lg,
  },
});
