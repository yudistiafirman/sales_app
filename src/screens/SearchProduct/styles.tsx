import { layout } from '@/constants';
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
    marginLeft: layout.pad.lg,
  },
  tabStyle: {
    width: 'auto',
    paddingHorizontal: layout.pad.lg,
  },
  tabBarStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: layout.pad.lg,
  },
});

export default SearchProductStyles;
