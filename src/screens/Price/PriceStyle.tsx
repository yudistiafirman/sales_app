import { layout } from '@/constants';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import resScale from '@/utils/resScale';
import { StyleSheet } from 'react-native';

const PriceStyle = StyleSheet.create({
  tabIndicator: {
    backgroundColor: colors.primary,
    marginLeft: layout.pad.md,
  },
  tabStyle: {
    width: 'auto',
    marginLeft: resScale(22),
  },
  tabBarStyle: { backgroundColor: colors.white },

  titleStyle: {
    fontFamily: font.family.montserrat['600'],
    fontSize: font.size.lg,
    color: colors.text.darker,
  },
  searchBarWrapper: {
    marginHorizontal: layout.pad.lg,
  },
});

export default PriceStyle;
