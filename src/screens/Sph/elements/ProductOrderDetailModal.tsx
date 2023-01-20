import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { ProductDataInterface } from '@/interfaces';
import { resScale } from '@/utils';
import { colors, fonts, layout } from '@/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  BSpacer,
  BChip,
  BDivider,
  BContainer,
  BButtonPrimary,
  BText,
  BTextInput,
} from '@/components';
import formatCurrency from '@/utils/formatCurrency';
import { TextInput } from 'react-native-paper';

type ProductCartModalType = {
  productData: ProductDataInterface;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  resetSelectedProduct: () => void;
  choseProduct: React.Dispatch<React.SetStateAction<any[]>>;
  prevData: { volume: string; sellPrice: string };
};

function TextIcon(label: string) {
  return <Text style={style.textIcon}>{label}</Text>;
}

export default function ProductCartModal({
  productData,
  isVisible,
  setIsVisible,
  resetSelectedProduct,
  choseProduct,
  prevData,
}: ProductCartModalType) {
  useEffect(() => {
    setDetailOrder(prevData);
  }, []);

  const [detailOrder, setDetailOrder] = useState({
    volume: '',
    sellPrice: '',
  });

  const onChange = (key: string) => (val: string) => {
    setDetailOrder((curr) => {
      return {
        ...curr,
        [key]: val.toString(),
      };
    });
  };

  return (
    <Modal style={style.modal} isVisible={isVisible}>
      <View style={style.modalContent}>
        <View style={style.modalHeader}>
          <Text style={style.headerText}>Detil Pemesanan Produk</Text>
          <TouchableOpacity
            onPress={() => {
              setIsVisible((curr) => !curr);
              setTimeout(() => {
                resetSelectedProduct();
              }, 200);
            }}
          >
            <MaterialCommunityIcons
              name="close"
              size={resScale(30)}
              color="#000000"
            />
          </TouchableOpacity>
        </View>
        <BSpacer size={'extraSmall'} />
        <View style={style.grayContent}>
          <Text style={style.productName}>{productData.name}</Text>
          <BSpacer size={'extraSmall'} />
          <View style={style.chipContainer}>
            <BChip backgroundColor={colors.chip.green}>
              {productData.Category.Parent.name}
            </BChip>
            <BChip backgroundColor={colors.chip.disabled}>slump 12±12 cm</BChip>
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={style.priceContainer}>
            <Text style={style.hargaText}>Harga Dasar</Text>
            <Text style={style.hargaText}>
              IDR {formatCurrency(productData.Price.price)}
            </Text>
          </View>
          <BSpacer size={'extraSmall'} />
          <View>
            <BDivider />
          </View>
          <BSpacer size={'small'} />
          <View style={style.chipContainer}>
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={resScale(20)}
              color="#000000"
            />
            <Text style={style.distanceText}>30 KM</Text>
          </View>
          <BSpacer size={'small'} />
          <View>
            <BDivider />
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={style.priceContainer}>
            <View style={{ maxWidth: resScale(200) }}>
              <Text style={style.hargaJualText}>Harga Jual Terendah</Text>
              <Text style={style.detailText}>
                Harga jual terendah sudah termasuk biaya penambahan jarak
              </Text>
            </View>
            <Text style={style.hargaJualPrice}>
              IDR {formatCurrency(productData.Price.price)}
            </Text>
          </View>
        </View>
        <BContainer>
          <View style={style.inputContainer}>
            <View style={{ width: '45%' }}>
              <Text style={style.inputLabel}>Volume</Text>
              <BTextInput
                onChange={(
                  event: NativeSyntheticEvent<TextInputChangeEventData>
                ) => {
                  onChange('volume')(event.nativeEvent.text);
                }}
                value={detailOrder.volume}
                keyboardType="numeric"
                right={<TextInput.Icon icon={() => TextIcon('m³')} />}
                placeholder="0"
                placeholderTextColor={colors.textInput.placeHolder}
              />
              {!detailOrder.volume && (
                <BText size="small" color="primary" bold="100">
                  Volume harus diisi
                </BText>
              )}
            </View>
            <BSpacer size={'extraSmall'} />
            <View style={{ width: '50%' }}>
              <Text style={style.inputLabel}>Harga Jual</Text>
              <BTextInput
                onChange={(
                  event: NativeSyntheticEvent<TextInputChangeEventData>
                ) => {
                  onChange('sellPrice')(event.nativeEvent.text);
                }}
                value={detailOrder.sellPrice}
                keyboardType="numeric"
                left={<TextInput.Icon icon={() => TextIcon('IDR')} />}
                right={<TextInput.Icon icon={() => TextIcon('/m³')} />}
                placeholder="0"
                placeholderTextColor={colors.textInput.placeHolder}
              />
              {!detailOrder.sellPrice && (
                <BText size="small" color="primary" bold="100">
                  Harga jual harus diisi
                </BText>
              )}
            </View>
          </View>
          <BSpacer size={'small'} />
          <View style={style.priceContainer}>
            <Text style={style.hargaText}>Biaya Mobilisasi</Text>
            <Text style={style.hargaText}>IDR 250.000</Text>
          </View>
          <BSpacer size={'small'} />
          <View style={style.priceContainer}>
            <Text style={style.productName}>Total Harga</Text>
            <Text style={style.boldPrice}>
              IDR {formatCurrency(+detailOrder.volume * +detailOrder.sellPrice)}
            </Text>
          </View>
        </BContainer>
        <View style={style.buttonContainer}>
          <BButtonPrimary
            title="Tambah Produk"
            disable={!detailOrder.sellPrice || !detailOrder.volume}
            onPress={() => {
              choseProduct((curr) => {
                const currentValue = curr;
                const newData = {
                  product: productData,
                  sellPrice: detailOrder.sellPrice,
                  volume: detailOrder.volume,
                };
                const existingDataIndex = currentValue.findIndex(
                  (data) => data.product.id === productData.id
                );
                if (existingDataIndex !== -1) {
                  currentValue.splice(existingDataIndex, 1, newData);
                } else {
                  currentValue.push({
                    product: productData,
                    sellPrice: detailOrder.sellPrice,
                    volume: detailOrder.volume,
                  });
                }
                return currentValue;
              });
              setIsVisible((curr) => !curr);
              setTimeout(() => {
                resetSelectedProduct();
              }, 200);
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const style = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  modalContent: {
    backgroundColor: 'white',
    height: resScale(550),
    borderTopLeftRadius: layout.radius.sm,
    borderTopRightRadius: layout.radius.sm,
  },
  modalHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.mainPad,
    paddingTop: layout.mainPad,
  },
  headerText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[700],
    fontSize: fonts.size.lg,
  },
  grayContent: {
    backgroundColor: colors.tertiary,
    height: resScale(250),
    padding: layout.mainPad,
  },
  productName: {
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.lg,
    color: colors.text.darker,
  },
  chipContainer: {
    flexDirection: 'row',
  },
  hargaText: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
    color: colors.text.darker,
  },
  distanceText: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
    color: colors.text.darker,
    marginLeft: layout.pad.md,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hargaJualText: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
    color: colors.text.darker,
  },
  hargaJualPrice: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
    color: colors.text.darker,
  },
  detailText: {
    marginTop: layout.pad.sm,
    fontFamily: fonts.family.montserrat[300],
    fontSize: fonts.size.xs,
    color: colors.text.darker,
  },
  buttonContainer: {
    paddingHorizontal: layout.mainPad,
    paddingVertical: layout.pad.md,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  textIcon: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
  boldPrice: {
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.lg,
    color: colors.text.darker,
  },
  inputLabel: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
});
