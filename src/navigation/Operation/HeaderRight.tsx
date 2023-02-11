import * as React from 'react';
import { colors, fonts, layout } from '@/constants';
import { Styles } from '@/interfaces';
import { View, Text } from 'react-native';

const _styles: Styles = {
  chipView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: layout.pad.ml,
    paddingVertical: layout.pad.sm,
    backgroundColor: colors.chip.green,
    borderRadius: layout.radius.sm,
  },
  chipText: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
};

export default function OperationHeaderRight() {
  return (
    <View style={_styles.chipView}>
      <View style={_styles.chip}>
        <Text style={_styles.chipText}>{'Operation'}</Text>
      </View>
    </View>
  );
}
