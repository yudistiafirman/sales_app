import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';
import { Switch } from 'react-native-paper';
import { colors, fonts } from '@/constants';
import { resFontSize } from '@/utils';

type BSwitchType = {
  value: boolean;
  onChange?: (e: any) => void;
  label?: string;
  labelStyle?: ViewStyle;
};

export default function BSwitch({
  value,
  onChange,
  label,
  labelStyle,
}: BSwitchType) {
  return (
    <View style={style.container}>
      <Text style={[style.labelStyle, labelStyle]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={(val) => {
          if (onChange) {
            onChange(val);
          }
        }}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelStyle: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
});
