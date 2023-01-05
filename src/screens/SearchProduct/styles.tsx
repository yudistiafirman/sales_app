import colors from '@/constants/colors';
import scaleSize from '@/utils/scale';
import { StyleSheet } from 'react-native';

const SearchProductStyles = StyleSheet.create({
  searchBarContainer: {
    width:scaleSize.moderateScale(293)
  },
  tabIndicator: {
    height: 2,
    backgroundColor: colors.primary,
    marginLeft: scaleSize.moderateScale(16),
  },
  tabStyle: {
    width: scaleSize.moderateScale(66),
    marginLeft: scaleSize.moderateScale(16),
  },
});

export default SearchProductStyles;
