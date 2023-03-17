import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import BTabSections from '@/components/organism/TabSections';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
import { useMachine } from '@xstate/react';
import { colors, fonts, layout } from '@/constants';
import { resScale } from '@/utils';
import TransactionList from './element/TransactionList';
import { transactionMachine } from '@/machine/transactionMachine';
import useCustomHeaderRight from '@/hooks/useCustomHeaderRight';
import {
  CAMERA,
  CREATE_DEPOSIT,
  CREATE_SCHEDULE,
  PO,
  SPH,
  TAB_TRANSACTION,
  TRANSACTION_DETAIL,
} from '@/navigation/ScreenNames';
import {
  getDeliveryOrderByID,
  getDepositByID,
  getPurchaseOrderByID,
  getScheduleByID,
  getVisitationOrderByID,
} from '@/actions/OrderActions';
import crashlytics from '@react-native-firebase/crashlytics';
import { customLog } from '@/utils/generalFunc';
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetFocusedStepperFlag,
  resetSPHState,
} from '@/redux/reducers/SphReducer';
import { bStorage } from '@/actions';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const Transaction = () => {
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);
  const [state, send] = useMachine(transactionMachine);
  const [isPopupSPHVisible, setPopupSPHVisible] = React.useState(false);
  const sphData = useSelector((rootState: RootState) => rootState.sph);
  const dispatch = useDispatch();
  const [feature, setFeature] = React.useState<'PO' | 'SPH'>('SPH');
  const poState = useSelector((state: RootState) => state.purchaseOrder);
  const { isModalContinuePo, poNumber, currentStep } =
    poState.currentState.context;

  const {
    routes,
    isLoadMore,
    refreshing,
    data,
    loadTransaction,
    loadTab,
    selectedType,
    errorMessage,
    isErrorData: isError,
  } = state.context;

  const onTabPress = (title: string) => {
    if (isError) send('retryGettingTransactions', { payload: title });
    else send('onChangeType', { payload: title });
  };

  useCustomHeaderRight({
    customHeaderRight:
      selectedType === 'DO' ||
      (selectedType === 'SPH' && loadTab) ? undefined : (
        <BTouchableText
          onPress={() => {
            if (selectedType === 'PO') {
              setFeature('PO');
              if (!isModalContinuePo) {
                navigation.navigate(PO);
              }
            } else if (selectedType === 'Deposit') {
              navigation.navigate(CAMERA, {
                photoTitle: 'Bukti',
                navigateTo: CREATE_DEPOSIT,
                closeButton: true,
                disabledDocPicker: false,
                disabledGalleryPicker: false,
              });
            } else if (selectedType === 'Jadwal') {
              navigation.navigate(CREATE_SCHEDULE);
            } else {
              setFeature('SPH');
              if (sphData?.selectedCompany) setPopupSPHVisible(true);
              else navigation.navigate(SPH, {});
            }
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
      let data;
      if (selectedType === 'SPH') {
        data = await getVisitationOrderByID(id);
        data = data.data.data;
      } else {
        if (selectedType === 'PO') {
          data = await getPurchaseOrderByID(id);
          data = data.data.data;

          // TODO: handle from BE, ugly when use mapping in FE side
          data = {
            ...data,
            mainPic: data.QuotationLetter?.QuotationRequest?.mainPic,
            paymentType: data.QuotationLetter?.QuotationRequest?.paymentType,
            deposit: data.DepositPurchaseOrders,
            DepositPurchaseOrders: undefined,
            address: data.project.Address,
            products: data.QuotationLetter?.QuotationRequest?.products,
            project: {
              ...data.project,
              Address: undefined,
            },
            QuotationLetter: {
              ...data.QuotationLetter,
              QuotationRequest: {
                ...data.QuotationLetter.QuotationRequest,
                mainPic: undefined,
                paymentType: undefined,
                products: undefined,
              },
            },
          };
        } else if (selectedType === 'Deposit') {
          data = await getDepositByID(id);
          data = data.data.data;

          // TODO: handle from BE, ugly when use mapping in FE side
          data = {
            ...data,
            mainPic: data.QuotationLetter?.QuotationRequest?.mainPic,
            QuotationLetter: {
              ...data.QuotationLetter,
              QuotationRequest: {
                ...data.QuotationLetter.QuotationRequest,
                mainPic: undefined,
              },
            },
          };
        } else if (selectedType === 'Jadwal') {
          data = await getScheduleByID(id);
          data = data.data.data;

          // TODO: handle from BE, ugly when use mapping in FE side
          data = {
            ...data,
            mainPic: data.QuotationLetter?.QuotationRequest?.mainPic,
            products: data.QuotationLetter?.QuotationRequest?.products,
            QuotationLetter: {
              ...data.QuotationLetter,
              QuotationRequest: {
                ...data.QuotationLetter.QuotationRequest,
                mainPic: undefined,
                products: undefined,
              },
            },
          };
        } else if (selectedType === 'DO') {
          data = await getDeliveryOrderByID(id);
          data = data.data.data;

          // TODO: handle from BE, ugly when use mapping in FE side
          let products: any[] = [];
          products.push(data.Schedule?.SaleOrder?.PoProduct);
          data = {
            ...data,
            mainPic: data.project?.mainPic,
            address: data.project.Address,
            products: products,
            project: {
              ...data.project,
              mainPic: undefined,
              Address: undefined,
            },
            Schedule: {
              ...data.Schedule,
              SaleOrder: {
                ...data.Schedule.SaleOrder,
                PoProduct: undefined,
              },
            },
          };
        }
      }
      navigation.navigate(TRANSACTION_DETAIL, {
        title: data ? data.number : 'N/A',
        data: data,
        type: selectedType,
      });
    } catch (error) {
      customLog(error);
    }
  };

  const renderPoNumber = () => {
    return (
      <View style={styles.poNumberWrapper}>
        <Text style={styles.poNumber}>{poNumber}</Text>
      </View>
    );
  };

  const renderContinueData = () => {
    return (
      <>
        <View style={styles.popupSPHContent}>
          {poNumber ? (
            renderPoNumber()
          ) : (
            <BVisitationCard
              item={{
                name: sphData?.selectedCompany?.name,
                location: sphData?.selectedCompany?.locationAddress?.line1,
              }}
              isRenderIcon={false}
            />
          )}
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

  const continuePopUpAction = () => {
    if (feature === 'PO') {
      if (currentStep === 0) {
        dispatch({ type: 'goToSecondStepFromSaved' });
      } else {
        dispatch({ type: 'goToThirdStepFromSaved' });
      }
      navigation.navigate(PO);
    } else {
      setPopupSPHVisible(false);
      dispatch(resetFocusedStepperFlag());
      navigation.navigate(SPH, {});
    }
  };

  return (
    <SafeAreaView style={styles.parent}>
      {loadTab && <ShimmerPlaceholder style={styles.shimmer} />}
      <BSpacer size="extraSmall" />
      {state.matches('getTransaction.errorGettingTypeTransactions') && (
        <BEmptyState
          onAction={() => send('retryGettingTypeTransactions')}
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
                'getTransaction.typeLoaded.errorGettingTransactions'
              )}
              errorMessage={errorMessage}
              onAction={() =>
                send('retryGettingTransactions', { payload: selectedType })
              }
              onRefresh={() => send('refreshingList')}
              onPress={(data: any) => getOneOrder(data.id)}
              selectedType={selectedType}
            />
          )}
          onTabPress={(data) => {
            onTabPress(data?.route?.title);
          }}
          onIndexChange={setIndex}
          tabStyle={styles.tabStyle}
          tabBarStyle={styles.tabBarStyle}
          indicatorStyle={styles.tabIndicator}
          minTabHeaderWidth={80}
        />
      )}
      <PopUpQuestion
        isVisible={feature === 'SPH' ? isPopupSPHVisible : isModalContinuePo}
        setIsPopupVisible={() => {
          if (feature === 'SPH') {
            setPopupSPHVisible(false);
            dispatch(resetSPHState());
            navigation.navigate(SPH, {});
          } else {
            bStorage.deleteItem(PO);
            dispatch({ type: 'createNewPo' });
            navigation.navigate(PO);
          }
        }}
        actionButton={continuePopUpAction}
        descContent={renderContinueData()}
        cancelText={'Buat Baru'}
        actionText={'Lanjutkan'}
        text={`Apakah Anda Ingin Melanjutkan Pembuatan ${
          feature === 'PO' ? 'PO' : 'SPH'
        } Sebelumnya?`}
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
  poNumber: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
    color: colors.text.darker,
    padding: layout.pad.xs + layout.pad.md,
  },
  poNumberWrapper: {
    backgroundColor: colors.tertiary,
    height: resScale(37),
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: resScale(277),
    alignSelf: 'center',
    borderRadius: layout.radius.md,
  },
});

export default Transaction;
