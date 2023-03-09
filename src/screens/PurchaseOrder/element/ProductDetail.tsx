import BChoosenProductList from '@/components/templates/BChoosenProductList';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const ProductDetail = () => {
  const poState = useSelector((state: RootState) => state.purchaseOrder);
  const dispatch = useDispatch<AppDispatch>();

  const { choosenSphDataFromModal, selectedProducts } =
    poState.currentState.context;

  return (
    <View style={styles.container}>
      <BChoosenProductList
        data={choosenSphDataFromModal?.QuotationRequests[0]?.RequestedProducts}
        onChecked={(data) => dispatch({ type: 'selectProduct', value: data })}
        selectedProducts={selectedProducts}
        hasMultipleCheck
        onChangeQuantity={(index: number, value: string) =>
          dispatch({ type: 'onChangeQuantity', index, value })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProductDetail;
