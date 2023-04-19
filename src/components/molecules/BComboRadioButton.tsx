import { colors, layout } from '@/constants';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BSpacer from '../atoms/BSpacer';
import BLabel from '../atoms/BLabel';
import { RadioButton } from 'react-native-paper';
import BText from '../atoms/BText';
import font from '@/constants/fonts';
import { IComboRadioBtn, Input, TitleBold } from '@/interfaces';
import { resScale } from '@/utils';

const BComboRadioButton = ({
  isRequire,
  textSize,
  titleBold,
  label,
  firstValue,
  firstText,
  firstStatus,
  secondValue,
  secondText,
  secondStatus,
  firstChildren,
  secondChildren,
  onSetComboRadioButtonValue,
}: Partial<Input> & IComboRadioBtn & TitleBold) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={{ paddingLeft: layout.pad.md }}>
          <BLabel
            sizeInNumber={textSize}
            bold={titleBold}
            label={label}
            isRequired={isRequire}
          />
        </View>

        <BSpacer size="extraLarge" />
        <View style={styles.radio}>
          <RadioButton
            value={firstValue}
            status={firstStatus}
            color={colors.primary}
            uncheckedColor={colors.border.altGrey}
            onPress={() =>
              onSetComboRadioButtonValue &&
              onSetComboRadioButtonValue(firstValue!)
            }
          />
          <BText style={styles.radioValue}>{firstText}</BText>
        </View>
        {firstChildren}
        <View style={styles.radio}>
          <RadioButton
            value={secondValue}
            status={secondStatus}
            color={colors.primary}
            uncheckedColor={colors.border.altGrey}
            onPress={() =>
              onSetComboRadioButtonValue &&
              onSetComboRadioButtonValue(secondValue!)
            }
          />
          <BText style={styles.radioValue}>{secondText}</BText>
        </View>
        {secondChildren}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiary,
    borderRadius: layout.radius.md,
    minHeight: resScale(93),
  },
  innerContainer: {
    paddingVertical: layout.pad.md + layout.pad.xs,
    paddingRight: layout.pad.md,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioValue: {
    fontFamily: font.family.montserrat[400],
    fontSize: font.size.sm,
    color: colors.text.darker,
  },
});

export default BComboRadioButton;
