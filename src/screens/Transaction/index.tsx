import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import BTabSections from '@/components/organism/TabSections';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  BEmptyState,
  BSpacer,
  BText,
  BTouchableText,
  BVisitationCard,
  PopUpQuestion,
} from '@/components';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { useMachine } from '@xstate/react';
import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import TransactionList from './element/TransactionList';
import { transactionMachine } from '@/machine/transactionMachine';
import useCustomHeaderRight from '@/hooks/useCustomHeaderRight';
import {
  SPH,
  TAB_TRANSACTION,
  TRANSACTION_DETAIL,
} from '@/navigation/ScreenNames';
import { getPOOrderByID, getVisitationOrderByID } from '@/actions/OrderActions';
import crashlytics from '@react-native-firebase/crashlytics';
import { customLog } from '@/utils/generalFunc';
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from '@/redux/reducers/SphReducer';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const Transaction = () => {
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps>();
  const [index, setIndex] = React.useState(0);
  const [state, send] = useMachine(transactionMachine);
  const [isPopupSPHVisible, setPopupSPHVisible] = React.useState(false);
  const sphData = useSelector((rootState: RootState) => rootState.sph);
  const dispatch = useDispatch();

  const {
    routes,
    isLoadMore,
    refreshing,
    data,
    loadTransaction,
    loadTab,
    selectedType,
    errorMessage,
  } = state.context;

  const onTabPress = (index: number) => {
    send('onChangeType', { payload: index });
  };

  useCustomHeaderRight({
    customHeaderRight: (
      <BTouchableText
        onPress={() => {
          if (sphData?.selectedCompany) setPopupSPHVisible(true);
          else navigation.navigate(SPH, {});
        }}
        title={'Buat ' + selectedType}
      />
    ),
  });

  useFocusEffect(
    React.useCallback(() => {
      send('backToGetTransactions');
    }, [send])
  );

  React.useEffect(() => {
    crashlytics().log(TAB_TRANSACTION);
  }, []);

  const getOneOrder = async (id: string) => {
    customLog('ini id', id);
    try {
      let data
      if (selectedType === 'SPH') {
        data = await getVisitationOrderByID(id);
        data = data.data.data
      } else {
        data = await getPOOrderByID(id);
        data = data.data.data
        data = {
          ...data,
          mainPic: data.QuotationLetter?.QuotationRequest?.mainPic,
          paymentType: data.QuotationLetter?.QuotationRequest?.paymentType,
        }
      }
      console.log('inii data: ', JSON.stringify(data.QuotationLetter.QuotationRequest))
      navigation.navigate(TRANSACTION_DETAIL, {
        title: data ? data.number : 'N/A',
        data: data,
      });
    } catch (error) {
      customLog(error);
    }
  };

  const renderSPHContinueData = () => {
    return (
      <>
        <View style={styles.popupSPHContent}>
          <BVisitationCard
            item={{
              name: sphData?.selectedCompany?.name,
              location: sphData?.selectedCompany?.locationAddress?.line1,
            }}
            isRenderIcon={false}
          />
        </View>
        <BSpacer size={'medium'} />
        <BText bold="300" sizeInNumber={14} style={styles.popupSPHDesc}>
          {selectedType +
            ' yang lama akan hilang kalau Anda buat ' +
            selectedType +
            ' yang baru'}
        </BText>
        <BSpacer size={'small'} />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.parent}>
      {loadTab && <ShimmerPlaceholder style={styles.shimmer} />}
      <BSpacer size="extraSmall" />
      {state.matches('getTransaction.errorGettingTypeTransactions') && (
        <BEmptyState
          onAction={() => send('retryGettingTransactions')}
          isError
          errorMessage={errorMessage}
        />
      )}
      {routes.length > 0 && (
        <BTabSections
          swipeEnabled={false}
          navigationState={{ index, routes }}
          renderScene={() => (
            <TransactionList
              onEndReached={() => send('onEndReached')}
              transactions={data}
              isLoadMore={isLoadMore}
              loadTransaction={loadTransaction}
              refreshing={refreshing}
              isError={state.matches(
                'getTransaction.typeLoaded.errorGettingTypeTransactions'
              )}
              errorMessage={errorMessage}
              onAction={() => send('retryGettingTypeTransactions')}
              onRefresh={() => send('refreshingList')}
              onPress={(data: any) => getOneOrder(data.id)}
            />
          )}
          onTabPress={(data) => {
            onTabPress(parseInt(data?.route?.key));
          }}
          onIndexChange={setIndex}
          tabStyle={styles.tabStyle}
          tabBarStyle={styles.tabBarStyle}
          indicatorStyle={styles.tabIndicator}
          minTabHeaderWidth={80}
        />
      )}
      <PopUpQuestion
        isVisible={isPopupSPHVisible}
        setIsPopupVisible={() => {
          setPopupSPHVisible(false);
          dispatch(resetState());
          navigation.navigate(SPH, {});
        }}
        actionButton={() => {
          setPopupSPHVisible(false);
          navigation.navigate(SPH, {});
        }}
        cancelText={'Buat Baru'}
        actionText={'Lanjutkan'}
        descContent={renderSPHContinueData()}
        text={
          'Apakah Anda Ingin Melanjutkan Pembuatan ' +
          selectedType +
          ' Sebelumnya?'
        }
      />
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
  popupSPHContent: { height: resScale(78), paddingHorizontal: layout.pad.lg },
  popupSPHDesc: {
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: layout.pad.xl,
  },
});

export default Transaction;
