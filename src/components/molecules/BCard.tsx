import { BChip, BHighlightText, BSpacer, BText } from '@/components';
import colors from '../../constants/colors';
import layout from '../../constants/layout';
import font from '@/constants/fonts';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface IBCard {
  avatarText?: string;
  title?: string;
  chipTitle?: string;
  chipBgColor?: string;
  cardBgColor?: string;
  searchQuery?: string;
  listTextData?: string[];
  onPressCard?: () => void;
}

const BCard = ({
  avatarText,
  title,
  chipTitle,
  chipBgColor,
  cardBgColor,
  listTextData,
  searchQuery,
  onPressCard,
}: IBCard) => {
  return (
    <TouchableOpacity
      onPress={onPressCard}
      style={{ ...styles.container, backgroundColor: cardBgColor }}
    >
      <View style={styles.avatar}>
        <BText style={styles.textAvatar}>{avatarText}</BText>
      </View>
      <BSpacer size="extraSmall" />
      <View style={{ flex: 1 }}>
        <View style={styles.infoContainer}>
          <BHighlightText name={title} searchQuery={searchQuery} />
          <BChip type="header" backgroundColor={chipBgColor}>
            {chipTitle}
          </BChip>
        </View>
        <BSpacer size="extraSmall" />
        <View style={styles.credContainer}>
          {listTextData &&
            listTextData.map((v, i) => {
              return (
                <BText key={i} style={styles.credText}>
                  {v}
                </BText>
              );
            })}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: layout.pad.md,
    paddingHorizontal: layout.pad.lg,
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
  },
  credText: {
    fontFamily: font.family.montserrat[300],
    fontSize: font.size.xs,
    color: colors.text.darker,
    marginRight: layout.pad.lg,
  },
});

export default BCard;
