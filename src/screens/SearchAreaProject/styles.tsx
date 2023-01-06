import colors from '@/constants/colors';
import font from '@/constants/fonts';
import scaleSize from '@/utils/scale';
import { StyleSheet } from 'react-native';

const SearchAreaStyles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: scaleSize.moderateScale(16) },
  currentLocationContainer: {
    flexDirection: 'row',
    marginVertical: scaleSize.moderateScale(20),
    alignItems: 'center',
  },
  currentLocationText: {
    fontFamily: font.family.montserrat['400'],
    fontSize: scaleSize.moderateScale(14),
    color: colors.text.darker,
  },
  locationListCardContainer: {
    height: scaleSize.moderateScale(56),
    borderBottomWidth: 1,
    borderColor: colors.border.disabled,
    marginBottom: scaleSize.moderateScale(8),
  },
  innerListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTitle: {
    fontFamily: font.family.montserrat['500'],
    fontSize: scaleSize.moderateScale(14),
    color: colors.text.darker,
    marginBottom: scaleSize.moderateScale(4),
  },
  addressDetail: {
    fontFamily: font.family.montserrat['300'],
    fontSize: scaleSize.moderateScale(12),
    color: colors.text.darker,
  },
});

export default SearchAreaStyles;
