import colors from '@/constants/colors';
import font from '@/constants/fonts';
import resScale from '@/utils/resScale';
import { StyleSheet } from 'react-native';

const SearchAreaStyles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: resScale(16) },
  currentLocationContainer: {
    flexDirection: 'row',
    marginVertical: resScale(20),
    alignItems: 'center',
  },
  currentLocationText: {
    fontFamily: font.family.montserrat['400'],
    fontSize: resScale(14),
    color: colors.text.darker,
  },
  locationListCardContainer: {
    height: resScale(56),
    borderBottomWidth: 1,
    borderColor: colors.border.disabled,
    marginBottom: resScale(8),
  },
  innerListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTitle: {
    fontFamily: font.family.montserrat['500'],
    fontSize: resScale(14),
    color: colors.text.darker,
    marginBottom: resScale(4),
  },
  addressDetail: {
    fontFamily: font.family.montserrat['300'],
    fontSize: resScale(12),
    color: colors.text.darker,
  },
});

export default SearchAreaStyles;
