import { colors, fonts, layout } from '@/constants';
import font from '@/constants/fonts';
import { Input } from '@/interfaces';
import { resScale } from '@/utils';
import formatCurrency from '@/utils/formatCurrency';
import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { RadioButton } from 'react-native-paper';
import BText from '../atoms/BText';
import BForm from '../organism/BForm';

interface Props<TItem> {
  item?: TItem;
  onChecked?: (index: number) => void;
  checked?: boolean;
  productName?: string;
  pricePerVol?: number;
  totalPrice?: number;
  inputsSelection?: Input[];
  remainingQuantity?: string;
  hasMultipleCheck?: boolean;
  index?: number;
  isOptions?: boolean;
  onPressRadioButton?: (index: string) => void;
}

const { width } = Dimensions.get('window');

const BExpandableProductCard = ({
  item,
  onChecked,
  checked,
  productName,
  pricePerVol,
  totalPrice,
  inputsSelection,
  remainingQuantity,
  hasMultipleCheck,
  index,
  onPressRadioButton,
  isOptions,
}: Props) => {
  const checkbox = [
    {
      type: 'checkbox',
      checkbox: {
        value: checked,
        onValueChange: () => onChecked && onChecked(item!),
      },
    },
  ];

  return (
    <View style={styles.customerCard}>
      <View style={styles.parentContainer}>
        {isOptions && (
          <View style={styles.checkBoxContainer}>
            {hasMultipleCheck ? (
              <BForm titleBold="500" inputs={checkbox} />
            ) : (
              <RadioButton
                value={index.toString()}
                status={checked ? 'checked' : 'unchecked'}
                color={colors.primary}
                uncheckedColor={colors.border.altGrey}
                onPress={() => onPressRadioButton(index.toString())}
              />
            )}
          </View>
        )}

        <View style={styles.expandableContainer}>
          <View style={styles.topCard}>
            <BText type="title">{productName}</BText>
          </View>
          <View style={styles.textContentContainer}>
            <BText style={styles.parentPrice}>
              {`${formatCurrency(pricePerVol!)}/m3`}
            </BText>
            <BText
              numberOfLines={1}
              style={styles.totalParentPrice}
            >{`IDR ${formatCurrency(totalPrice)}`}</BText>
          </View>
        </View>
      </View>
      {checked && (
        <View style={styles.inputContainer}>
          <View style={styles.volumeContainer}>
            <BForm
              titleBold="500"
              inputs={inputsSelection}
              spacer="extraSmall"
            />
            {remainingQuantity && (
              <View style={styles.volContent}>
                <BText>Sisa vol. yang belum dikirim</BText>
                <BText
                  style={{
                    marginStart: layout.pad.sm,
                    fontFamily: fonts.family.montserrat[500],
                  }}
                >
                  {remainingQuantity}
                </BText>
              </View>
            )}
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
    fontFamily: font.family.montserrat[300],
    fontSize: font.size.xs,
    color: colors.text.darker,
  },
  totalParentPrice: {
    fontFamily: font.family.montserrat[500],
    fontSize: font.size.sm,
    color: colors.text.darker,
    textAlign: 'right',
    width: width - 170,
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
    flex: 1,
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
  volContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default BExpandableProductCard;
