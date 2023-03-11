import { bStorage } from '@/actions';
import BChoosenProductList from '@/components/templates/BChoosenProductList';
import { PO } from '@/navigation/ScreenNames';
import { closePopUp, openPopUp } from '@/redux/reducers/modalReducer';
import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type ModalType = 'loading' | 'success' | 'error';
type ModalText = string;

const ProductDetail = () => {
  const poState = useSelector((state: RootState) => state.purchaseOrder);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const {
    choosenSphDataFromModal,
    selectedProducts,
    isLoadingPostPurchaseOrder,
  } = poState.currentState.context;
  const isPostingPurchaseOrder =
    poState.currentState.matches('PostPurchaseOrder');
  const successPostPurchaseOrder = poState.currentState.matches(
    'PostPurchaseOrder.successCreatedPo'
  );
  const failPostPurchaseOrder = poState.currentState.matches(
    'PostPurchaseOrder.failCreatedPo'
  );
  const getGlobalModalType = useCallback((): [ModalType, ModalText] => {
    let modalType = '' as ModalType;
    let modalText = '';
    if (isLoadingPostPurchaseOrder) {
      modalType = 'loading';
      modalText = 'Menyimpan PO';
    } else if (successPostPurchaseOrder) {
      modalType = 'success';
      modalText = 'Berhasil Dibuat';
    } else {
      modalType = 'error';
      modalText = 'Gagal Dibuat';
    }
    return [modalType, modalText];
  }, [isLoadingPostPurchaseOrder, successPostPurchaseOrder]);

  const calculatedTotalPrice = (): number => {
    const total = selectedProducts
      .map((v) => {
        return v.quantity.toString()[0] === '0' || v.quantity.length === 0
          ? 0
          : v.offeringPrice * v.quantity;
      })
      .reduce((a, b) => a + b,0);
    return total;
  };

  const [modalType, modalText] = getGlobalModalType();

  const handleReturnToInitialState = useCallback(() => {
    bStorage.deleteItem(PO);
    dispatch(closePopUp());
    if (navigation.canGoBack()) {
      navigation.dispatch(StackActions.popToTop());
    }

    dispatch({ type: 'backToInitialState' });
  }, [dispatch, navigation]);

  useEffect(() => {
    if (isPostingPurchaseOrder) {
      dispatch(
        openPopUp({
          popUpType: modalType,
          popUpTitle: !isLoadingPostPurchaseOrder ? 'PO' : '',
          popUpText: modalText,
          isRenderActions: failPostPurchaseOrder && !isLoadingPostPurchaseOrder,
          outsideClickClosePopUp: false,
          outlineBtnTitle: 'Kembali',
          primaryBtnTitle: 'Coba Lagi',
          isPrimaryButtonLoading: isLoadingPostPurchaseOrder,
          primaryBtnAction: () => dispatch({ type: 'retryPostPurchaseOrder' }),
          outlineBtnAction: handleReturnToInitialState,
        })
      );

      if (successPostPurchaseOrder) {
        setTimeout(() => {
          handleReturnToInitialState();
        }, 3000);
      }
    } else {
      dispatch(closePopUp());
    }
  }, [
    dispatch,
    failPostPurchaseOrder,
    getGlobalModalType,
    handleReturnToInitialState,
    isLoadingPostPurchaseOrder,
    isPostingPurchaseOrder,
    modalText,
    modalType,
    navigation,
    poState.currentState,
    successPostPurchaseOrder,
  ]);

  return (
    <BChoosenProductList
      data={choosenSphDataFromModal?.QuotationRequests[0]?.products}
      onChecked={(data) => dispatch({ type: 'selectProduct', value: data })}
      selectedProducts={selectedProducts}
      hasMultipleCheck
      calculatedTotalPrice={calculatedTotalPrice()}
      onChangeQuantity={(index: number, value: string) =>
        dispatch({ type: 'onChangeQuantity', index, value })
      }
    />
  );
};

export default ProductDetail;
