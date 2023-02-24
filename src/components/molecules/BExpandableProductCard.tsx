import { colors, fonts, layout } from '@/constants';
import font from '@/constants/fonts';
import { Input } from '@/interfaces';
import { resScale } from '@/utils';
import formatCurrency from '@/utils/formatCurrency';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BText from '../atoms/BText';
import BTextInput from '../atoms/BTextInput';
import BForm from '../organism/BForm';
import { TextInput } from 'react-native-paper';

interface Props {
  index?: number;
  onChecked?: (index: number) => void;
  checked?: boolean;
  productName?: string;
  pricePerVol?: number;
  totalPrice?: number;
  volume?: number;
}

const BExpandableProductCard = ({
  index,
  onChecked,
  checked,
  productName,
  pricePerVol,
  totalPrice,
  volume,
}: Props) => {
  const checkbox = [
    {
      type: 'checkbox',
      checkbox: {
        value: checked,
        onValueChange: () => onChecked && onChecked(index!),
      },
    },
  ];

  const renderTextIcon = (label: string) => {
    return <Text style={styles.textIcon}>{label}</Text>;
  };
  return (
    <View style={styles.customerCard}>
      <View style={styles.parentContainer}>
        <View style={styles.checkBoxContainer}>
          <BForm inputs={checkbox} />
        </View>
        <View style={styles.expandableContainer}>
          <View style={styles.topCard}>
            <BText type="title">{productName}</BText>
          </View>
          <View style={styles.textContentContainer}>
            <BText style={styles.parentPrice}>
              {`${formatCurrency(pricePerVol!)}/m3`}
            </BText>
            <BText style={styles.totalParentPrice}>{`IDR ${formatCurrency(
              totalPrice!
            )}`}</BText>
          </View>
        </View>
      </View>
      {checked && (
        <View style={styles.inputContainer}>
          <View style={styles.volumeContainer}>
            <Text style={styles.inputLabel}>Volume</Text>
            <BTextInput
              value={volume?.toString()}
              disabled
              keyboardType="numeric"
              returnKeyType="next"
              right={<TextInput.Icon icon={() => renderTextIcon('m³')} />}
              placeholder="0"
              placeholderTextColor={colors.textInput.placeHolder}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  customerCard: {
    backgroundColor: colors.tertiary,
    borderRadius: layout.radius.md,
    padding: layout.pad.md,
  },
  parentContainer: { flexDirection: 'row' },
  checkBoxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: layout.pad.ml,
    paddingTop: layout.pad.lg,
  },
  expandableContainer: { flex: 1, minHeight: resScale(56) },
  textContentContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topCard: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  parentPrice: {
    fontFamily: font.family.montserrat['300'],
    fontSize: font.size.xs,
    color: colors.text.darker,
  },
  totalParentPrice: {
    fontFamily: font.family.montserrat['500'],
    fontSize: font.size.sm,
    color: colors.text.darker,
  },
  bottomCard: {
    marginTop: layout.pad.sm,
    overflow: 'hidden',
  },
  productCardContainer: {
    borderRadius: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    flex:1
  },
  inputLabel: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
  volumeContainer: {
    width: '100%',
  },
  textIcon: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
});

export default BExpandableProductCard;
