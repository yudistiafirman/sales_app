import colors from '@/constants/colors';
import font from '@/constants/fonts';
import scaleSize from '@/utils/scale';
import { StyleSheet } from 'react-native';

const PriceStyle = StyleSheet.create({
  tabIndicator: {
    height: 2,
    backgroundColor: colors.primary,
    marginLeft: scaleSize.moderateScale(16),
  },
  tabStyle: {
    width: scaleSize.moderateScale(66),
    marginLeft: scaleSize.moderateScale(14),
  },
  titleStyle: {
    fontFamily: font.family.montserrat['600'],
    fontSize: font.size.lg,
    color: colors.text.darker,
  },
  searchBarWrapper:{
    marginBottom: scaleSize.moderateScale(16),
    marginHorizontal: scaleSize.moderateScale(16),
  }
});

export default PriceStyle;
