import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import BTabSections from '@/components/organism/TabSections';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BSpacer, BTouchableText } from '@/components';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { useMachine } from '@xstate/react';
import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import TransactionList from './element/TransactionList';
import { transactionMachine } from '@/machine/transactionMachine';
import useCustomHeaderRight from '@/hooks/useCustomHeaderRight';
import { SPH, TRANSACTION_DETAIL } from '@/navigation/ScreenNames';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const Transaction = () => {
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps>();
  const [index, setIndex] = React.useState(0);
  const [state, send] = useMachine(transactionMachine);

  const onTabPress = () => {
    const tabIndex = index === 0 ? 1 : 0;
    if (route.key !== routes[index].key) {
      send('onChangeType', { payload: tabIndex });
    }
  };

  useCustomHeaderRight({
    customHeaderRight: (
      <BTouchableText
        onPress={() => navigation.navigate(SPH)}
        title="Buat SPH"
      />
    ),
  });

  const {
    routes,
    isLoadMore,
    refreshing,
    transactionsData,
    loadTransaction,
    loadTab,
  } = state.context;

  return (
    <SafeAreaView style={styles.parent}>
      {loadTab && <ShimmerPlaceholder style={styles.shimmer} />}
      <BSpacer size="extraSmall" />
      {routes.length > 0 && (
        <BTabSections
          swipeEnabled={false}
          navigationState={{ index, routes }}
          renderScene={() => (
            <TransactionList
              onEndReached={() => send('onEndReached')}
              transactions={transactionsData}
              isLoadMore={isLoadMore}
              loadTransaction={loadTransaction}
              refreshing={refreshing}
              onRefresh={() => send('refreshingList')}
              onPress={(data: any) =>
                navigation.navigate(TRANSACTION_DETAIL, {
                  title: data.title,
                  data,
                })
              }
            />
          )}
          onTabPress={onTabPress}
          onIndexChange={setIndex}
          tabStyle={styles.tabStyle}
          tabBarStyle={styles.tabBarStyle}
          indicatorStyle={styles.tabIndicator}
          minTabHeaderWidth={80}
        />
      )}
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

export default Transaction;
