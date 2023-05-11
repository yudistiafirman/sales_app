import { BChip, BHighlightText, BSpacer, BText } from '@/components';
import { colors, fonts, layout } from '@/constants';
import font from '@/constants/fonts';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ICustomerCard {
  avatarText?: string;
  customerName?: string;
  customerType?: string;
  chipBgColor?: string;
  searchQuery?: string;
  ktp?: string;
  npwp?: string;
}

const CustomerCard = ({
  avatarText,
  customerName,
  customerType,
  chipBgColor,
  ktp,
  npwp,
  searchQuery,
}: ICustomerCard) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <BText style={styles.textAvatar}>{avatarText}</BText>
      </View>
      <BSpacer size="extraSmall" />
      <View style={{ flex: 1 }}>
        <View style={styles.infoContainer}>
          <BHighlightText name={customerName} searchQuery={searchQuery} />
          <BChip type="header" backgroundColor={chipBgColor}>
            {customerType}
          </BChip>
        </View>
        <BSpacer size="extraSmall" />
        <View style={styles.credContainer}>
          <BText style={styles.credText}>KTP: {ktp}</BText>
          <BText style={styles.credText}>NPWP: {npwp}</BText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    borderRadius: layout.pad.xl + layout.pad.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: layout.pad.xl + layout.pad.md,
    height: layout.pad.xl + layout.pad.md,
    backgroundColor: colors.avatar,
  },
  textAvatar: {
    fontFamily: font.family.montserrat[600],
    fontSize: font.size.lg,
    color: colors.text.pinkRed,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
  },
  credContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  credText: {
    fontFamily: font.family.montserrat[300],
    fontSize: font.size.xs,
    color: colors.text.darker,
  },
});

export default CustomerCard;
