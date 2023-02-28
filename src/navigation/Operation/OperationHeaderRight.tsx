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

export default function OperationHeaderRight(badgeName: string) {
  return (
    <View
      style={[
        _styles.chipView,
        (badgeName === 'Dispatch' || badgeName === 'Return') && {
          marginEnd: layout.pad.lg,
        },
      ]}
    >
      <View style={_styles.chip}>
        <Text style={_styles.chipText}>{badgeName}</Text>
      </View>
    </View>
  );
}
