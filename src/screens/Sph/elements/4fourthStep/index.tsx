import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  DeviceEventEmitter,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  BBackContinueBtn,
  BContainer,
  BDivider,
  BProductCard,
  BSearchBar,
  BSpacer,
} from '@/components';
import ProductCartModal from '../ProductOrderDetailModal';
import { ProductDataInterface } from '@/interfaces';
import { TextInput } from 'react-native-paper';
import { resScale } from '@/utils';
import { colors, fonts } from '@/constants';
import { SphContext } from '../context/SphContext';
import { useNavigation } from '@react-navigation/native';

type ChosenProductType = {
  volume: string;
  sellPrice: string;
  product: ProductDataInterface;
}[];

function RenderModal(
  selectedProduct: ProductDataInterface | null,
  isModalVisible: boolean,
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<ProductDataInterface | null>
  >,
  setChosenProducts: React.Dispatch<React.SetStateAction<any[]>>,
  chosenProducts: ChosenProductType,
  backToChosenProducst: () => void
) {
  if (!selectedProduct) {
    return null;
  }
  let prevData = { volume: '', sellPrice: '' };
  const existingDataIndex = chosenProducts.findIndex(
    (data) => data.product.id === selectedProduct.id
  );

  if (existingDataIndex !== -1) {
    prevData.sellPrice = chosenProducts[existingDataIndex].sellPrice;
    prevData.volume = chosenProducts[existingDataIndex].volume;
    // productDataProp = chosenProducts[existingDataIndex].product;
  }

  return (
    <ProductCartModal
      productData={selectedProduct}
      isVisible={isModalVisible}
      setIsVisible={setIsModalVisible}
      resetSelectedProduct={() => {
        setSelectedProduct(null);
        backToChosenProducst();
      }}
      choseProduct={setChosenProducts}
      prevData={prevData}
    />
  );
}

function renderSeparator() {
  return <BSpacer size={'extraSmall'} />;
}

export default function FourthStep() {
  const navigation = useNavigation();
  const [sphState, stateUpdate, setCurrentPosition] = useContext(SphContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modeSearch, setModeSearch] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDataInterface | null>(null);
  const [chosenProducts, setChosenProducts] = useState<ChosenProductType>([]);

  const getProduct = useCallback((data: ProductDataInterface) => {
    setSelectedProduct(data);
    setIsModalVisible(true);
  }, []);

  const deleteSelectedProduct = useCallback((index: number) => {
    setChosenProducts((curr) => {
      const currentProducts = curr;
      currentProducts.splice(index, 1);
      return [...currentProducts];
    });
  }, []);

  useEffect(() => {
    if (sphState) {
      setChosenProducts(sphState?.chosenProducts);
    }
    DeviceEventEmitter.addListener('event.testEvent', ({ data }) => {
      getProduct(data);
    });
    return () => {
      DeviceEventEmitter.removeAllListeners('event.testEvent');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stateUpdate) {
      stateUpdate('chosenProducts')(chosenProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenProducts]);

  return (
    <BContainer>
      {RenderModal(
        selectedProduct,
        isModalVisible,
        setIsModalVisible,
        setSelectedProduct,
        setChosenProducts,
        chosenProducts,
        () => {
          setModeSearch(false);
        }
      )}
      <View style={style.searchModeContainer}>
        <View>
          <Text style={style.productText}>Produk</Text>
          <View>
            <BDivider />
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={style.posRelative}>
            <TouchableOpacity
              style={style.touchable}
              onPress={() => {
                navigation.navigate('SearchProduct', {
                  isGobackAfterPress: false,
                });
              }}
            />
            <BSearchBar
              placeholder="Cari Produk"
              activeOutlineColor="gray"
              left={<TextInput.Icon icon="magnify" />}
            />
          </View>
          <BSpacer size={'small'} />
          {/* <Text>Tidak ada produk yang terpilih</Text> */}
          <FlatList
            data={chosenProducts}
            keyExtractor={(item) => item.product.id}
            renderItem={({ item, index }) => {
              return (
                <BProductCard
                  name={item.product.name}
                  volume={+item.volume}
                  pricePerVol={+item.sellPrice}
                  totalPrice={+item.volume * +item.sellPrice}
                  onPressEdit={() => {
                    setSelectedProduct(item.product);
                    setIsModalVisible(true);
                  }}
                  onPressDelete={() => {
                    deleteSelectedProduct(index);
                  }}
                />
              );
            }}
            ItemSeparatorComponent={renderSeparator}
          />
        </View>
        <BBackContinueBtn
          onPressBack={() => {
            if (setCurrentPosition) {
              setCurrentPosition(2);
            }
          }}
          onPressContinue={() => {
            if (setCurrentPosition) {
              setCurrentPosition(4);
            }
          }}
          disableContinue={sphState?.chosenProducts.length === 0}
        />
      </View>

      {/* <Text>ini step 4</Text> */}
    </BContainer>
  );
}

const style = StyleSheet.create({
  posRelative: {
    position: 'relative',
    marginBottom: resScale(10),
  },
  touchable: {
    position: 'absolute',
    width: '100%',
    borderRadius: resScale(4),
    height: resScale(45),
    zIndex: 2,
  },
  productText: {
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
  searchModeContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
