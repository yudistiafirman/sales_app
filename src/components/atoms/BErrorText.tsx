import { colors } from '@/constants';
import font from '@/constants/fonts';
import { resScale } from '@/utils';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BText from './BText';
const BErrorText = ({ text }: { text: string }) => {
  return (
    <View style={styles.container}>
      <Icon
        style={styles.warningIcon}
        name="warning"
        color={colors.primary}
        size={resScale(14)}
      />
      <BText style={styles.warningText}>{text}</BText>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
  warningIcon: { marginRight: resScale(11), alignSelf: 'center' },
  warningText: {
    fontFamily: font.family.montserrat['500'],
    fontSize: font.size.md,
    color: colors.primary,
  },
});
export default BErrorText;
