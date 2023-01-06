import colors from '@/constants/colors';
import font from '@/constants/fonts';
import resScale from '@/utils/resScale';
import { StyleSheet } from 'react-native';

const PriceStyle = StyleSheet.create({
  tabIndicator: {
    height: 2,
    backgroundColor: colors.primary,
    marginLeft: resScale(16),
  },
  tabStyle: {
    width: resScale(66),
    marginLeft: resScale(14),
  },
  titleStyle: {
    fontFamily: font.family.montserrat['600'],
    fontSize: font.size.lg,
    color: colors.text.darker,
  },
  searchBarWrapper: {
    marginBottom: resScale(16),
    marginHorizontal: resScale(16),
  },
});

export default PriceStyle;
