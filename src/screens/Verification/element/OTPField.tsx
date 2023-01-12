import { colors } from '@/constants';
import font from '@/constants/fonts';
import { resScale } from '@/utils';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
const CELL_COUNT = 6;

interface OTPFieldProps {
  value?: string;
  setValue: (text: string) => void;
}

const OTPField = ({ value = '', setValue }: OTPFieldProps) => {
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({ index, symbol, isFocused }) => (
        <Text
          key={index}
          style={[styles.cell, (isFocused || value[index]) && styles.focusCell]}
          onLayout={getCellOnLayoutHandler(index)}
        >
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      )}
    />
  );
};
const styles = StyleSheet.create({
  root: { flex: 1, padding: resScale(20) },
  title: { textAlign: 'center', fontSize: resScale(30) },
  codeFieldRoot: { marginTop: 0 },
  cell: {
    width: resScale(46),
    height: resScale(54),
    fontSize: resScale(20),
    borderRadius: resScale(4),
    fontFamily: font.family.montserrat['500'],
    color: colors.text.dark,
    borderColor: colors.border.otpField,
    textAlign: 'center',
    paddingTop: resScale(16),
    borderWidth: 1,
  },
  focusCell: {
    borderColor: colors.primary,
    backgroundColor: colors.chip.disabled,
  },
});
export default OTPField;
