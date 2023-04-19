import * as React from 'react';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import { StyleSheet, View } from 'react-native';
import resScale from '@/utils/resScale';
import { BChip, BText } from '@/components';
import { layout } from '@/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getColorStatusTrx, getStatusTrx } from '@/utils/generalFunc';
import formatCurrency from '@/utils/formatCurrency';

interface TransactionListCardProps {
  number: string;
  projectName: string;
  status: string;
  name?: string;
  nominal?: number;
  useBEStatus?: boolean;
}

const TransactionListCard = ({
  number,
  projectName,
  status,
  name,
  nominal,
  useBEStatus
}: TransactionListCardProps) => {
  const statusFinal = useBEStatus ? status : getStatusTrx(status);
  const { color, textColor } = getColorStatusTrx(statusFinal);
  return (
    <View
      style={[
        styles.parent,
        name ? { height: resScale(88) } : { height: resScale(68) },
      ]}
    >
      <View style={styles.leftSide}>
        <View style={styles.container}>
          <BText style={styles.title}>{number}</BText>
          <BChip type="default" backgroundColor={color} textColor={textColor}>
            {statusFinal}
          </BChip>
        </View>
        {name && <BText style={styles.name}>{name}</BText>}
        <View style={styles.bottomContainer}>
          <BText numberOfLines={1} style={styles.desc}>
            {projectName}
          </BText>
          {nominal !== undefined && (
            <BText sizeInNumber={14} bold={'500'}>
              {'IDR ' + formatCurrency(nominal ? nominal : 0)}
            </BText>
          )}
        </View>
      </View>
      <View style={styles.rightSide}>
        <Icon name="chevron-right" size={20} color={colors.textInput.input} />
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  parent: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: layout.pad.md,
    borderColor: colors.border.disabled,
    marginTop: layout.pad.lg,
    padding: layout.pad.md,
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: layout.pad.md,
    flex: 1,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontFamily: font.family.montserrat[500],
    color: colors.text.darker,
    fontSize: font.size.md,
  },
  name: {
    flex: 1,
    marginTop: layout.pad.xs,
    fontFamily: font.family.montserrat[300],
    color: colors.text.secondary,
    fontSize: font.size.xs,
  },
  desc: {
    flex: 1,
    fontFamily: font.family.montserrat[400],
    color: colors.text.darker,
    fontSize: font.size.sm,
    marginEnd: layout.pad.sm,
  },
  nominal: {
    flex: 1,
    fontFamily: font.family.montserrat[500],
    color: colors.text.darker,
    fontSize: font.size.md,
  },
  leftSide: {
    flex: 1,
    justifyContent: 'space-between',
  },
  rightSide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TransactionListCard;
