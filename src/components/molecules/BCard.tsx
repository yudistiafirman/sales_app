import { BChip, BHighlightText, BSpacer, BText } from '@/components';
import colors from '../../constants/colors';
import layout from '../../constants/layout';
import font from '@/constants/fonts';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import formatCurrency from '@/utils/formatCurrency';

interface IBCard {
  avatarText?: string;
  title?: string;
  chipTitle?: string;
  chipBgColor?: string;
  cardBgColor?: string;
  searchQuery?: string;
  listTextData?: string[];
  availableDebit?: number;
  availableCredit?: number;
  onPressCard?: () => void;
  chipStartIcon: React.ReactNode;
}

const BCard = ({
  avatarText,
  title,
  chipTitle,
  chipBgColor,
  cardBgColor,
  listTextData,
  searchQuery,
  availableDebit,
  availableCredit,
  onPressCard,
  chipStartIcon,
}: IBCard) => {
  return (
    <TouchableOpacity
      onPress={onPressCard}
      style={{ ...styles.container, backgroundColor: cardBgColor }}
    >
      <View style={styles.innerContainer}>
        <View style={styles.avatar}>
          <BText style={styles.textAvatar}>{avatarText}</BText>
        </View>
        <BSpacer size="extraSmall" />
        <View style={{ flex: 1 }}>
          <View style={styles.infoContainer}>
            <BHighlightText name={title} searchQuery={searchQuery} />
            <BChip
              titleWeight="700"
              type="header"
              startIcon={chipStartIcon}
              backgroundColor={chipBgColor}
            >
              {chipTitle}
            </BChip>
          </View>
          <BSpacer size="extraSmall" />
          <View style={styles.credContainer}>
            {listTextData &&
              listTextData.map((v, i) => {
                return (
                  <Text key={i} style={styles.credText}>
                    {v}
                  </Text>
                );
              })}
          </View>
        </View>
      </View>

      <BSpacer size="extraSmall" />
      <View style={styles.paymentContainer}>
        {availableDebit && (
          <View style={styles.remainingAmount}>
            <Text style={styles.credText}>Sisa Debit : </Text>
            <Text
              style={{
                ...styles.credText,
                fontFamily: font.family.montserrat[500],
              }}
            >
              -
            </Text>
          </View>
        )}
        {availableCredit && (
          <View style={styles.remainingAmount}>
            <Text style={styles.credText}>Sisa Credit : </Text>
            <Text
              style={{
                ...styles.credText,
                fontFamily: font.family.montserrat[500],
              }}
            >
              -
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: layout.pad.md,
    paddingHorizontal: layout.pad.lg,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  remainingAmount: {
    flexDirection: 'row',
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
  paymentContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
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

export default BCard;
