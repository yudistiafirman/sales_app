import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Switch } from 'react-native-paper';
import { resFontSize } from '@/utils';
import { colors, fonts, layout } from '@/constants';

const style = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelStyle: {
    flex: 1,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
    marginEnd: layout.pad.md,
  },
});

type BSwitchType = {
  value: boolean;
  onChange?: (e: any) => void;
  label?: string;
  labelStyle?: ViewStyle;
};

export default function BSwitch({ value, onChange, label, labelStyle }: BSwitchType) {
  return (
    <View style={style.container}>
      <Text numberOfLines={1} style={[style.labelStyle, labelStyle]}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={val => {
          if (onChange) {
            onChange(val);
          }
        }}
      />
    </View>
  );
}
