import colors from '@/constants/colors';
import resScale from '@/utils/resScale';
import { StyleSheet } from 'react-native';

const SearchProductStyles = StyleSheet.create({
  searchBarContainer: {
    width: resScale(293),
  },
  tabIndicator: {
    height: 2,
    backgroundColor: colors.primary,
    marginLeft: resScale(16),
  },
  tabStyle: {
    width: resScale(66),
    marginLeft: resScale(16),
  },
});

export default SearchProductStyles;
