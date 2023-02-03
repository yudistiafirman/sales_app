import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BText } from '@/components';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackScreenProps } from '@/navigation/navTypes';
import { colors, layout } from '@/constants';
import { resScale } from '@/utils';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const TransactionDetail = () => {
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps>();

  return (
    <SafeAreaView style={styles.parent}>
      <View>
        <BText>Test</BText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  shimmer: {
    marginHorizontal: layout.pad.lg,
    height: layout.pad.lg,
    width: '92%',
  },
  tabIndicator: {
    backgroundColor: colors.primary,
    marginLeft: resScale(15.5),
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

export default TransactionDetail;
