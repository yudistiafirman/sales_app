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
  },
  tabStyle: {
    width: 'auto',
    marginLeft: resScale(22),
  },
  tabBarStyle: { backgroundColor: colors.white, marginLeft: layout.pad.lg },
});

export default SearchProductStyles;
