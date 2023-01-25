import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Switch } from 'react-native-paper';
import { colors, fonts } from '@/constants';
import { resFontSize } from '@/utils';

type BSwitchType = {
  value: boolean;
  onChange?: (e: any) => void;
  label?: string;
};

export default function BSwitch({ value, onChange, label }: BSwitchType) {
  return (
    <View style={style.container}>
      <Text style={style.labelStyle}>{label}</Text>
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
    fontFamily: fonts.family.montserrat[500],
    fontSize: resFontSize(11),
    color: colors.text.darker,
  },
});
