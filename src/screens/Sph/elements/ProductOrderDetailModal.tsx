import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import Modal from 'react-native-modal';
import { Input, ProductDataInterface } from '@/interfaces';
import { resScale } from '@/utils';
import { colors, fonts, layout } from '@/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  BSpacer,
  BChip,
  BDivider,
  BButtonPrimary,
  BText,
  BTextInput,
  BForm,
} from '@/components';
import formatCurrency from '@/utils/formatCurrency';
import { TextInput } from 'react-native-paper';
import calcTrips from '@/utils/calcTrips';
import { METHOD_LIST } from '@/constants/dropdown';

type ProductCartModalType = {
  productData: ProductDataInterface;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  resetSelectedProduct: () => void;
  choseProduct: React.Dispatch<React.SetStateAction<any[]>>;
  prevData: { volume: string; sellPrice: string };
  distance: number | null;
};

type distanceDeliverType = {
  id: string;
  price: number;
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
  distance,
}: ProductCartModalType) {
  useEffect(() => {
    setDetailOrder(prevData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [detailOrder, setDetailOrder] = useState({
    volume: '',
    sellPrice: '',
    method: '',
  });

  const calcPrice = useMemo(() => {
    return calcTrips(detailOrder.volume ? +detailOrder.volume : 0)?.calcCost;
  }, [detailOrder.volume]);
  const totalPrice =
    +detailOrder.volume * +detailOrder.sellPrice + (calcPrice ? calcPrice : 0);
  const distanceCeil = distance ? Math.ceil(distance / 1000) : 0;
  function getAddPrice(): {
    delivery: distanceDeliverType;
    distance: distanceDeliverType;
  } {
    const { Category } = productData;
    const { Parent } = Category;
    const { AdditionalPrices } = Parent;

    const additionalData = {
      distance: {} as distanceDeliverType,
      delivery: {} as distanceDeliverType,
    };
    for (const price of AdditionalPrices) {
      if (price.type === 'DISTANCE') {
        if (distanceCeil >= price.min && distanceCeil <= price.max) {
          additionalData.distance.id = price.id;
          additionalData.distance.price = price.price;
        }
      }

      if (price.type === 'TRANSPORT') {
        if (+detailOrder.volume >= price.min) {
          additionalData.delivery.id = price.id;
          additionalData.delivery.price = price.price;
        }
      }
    }
    return additionalData;
  }

  const onChange = (key: string) => (val: string) => {
    setDetailOrder((curr) => {
      return {
        ...curr,
        [key]: val
          .toString()
          .split('')
          .filter((char) => /^\d+$/.test(char))
          .join(''),
      };
    });
  };

  const methodInput: Input[] = [
    {
      label: 'Metode penuangan',
      isRequire: true,
      type: 'dropdown',
      value: detailOrder.method,
      isError: detailOrder.method === '',
      customerErrorMsg: 'Metode penuangan harus dipilih',
      dropdown: {
        items: METHOD_LIST,
        placeholder: 'Pilih metode penuangan',
        onChange: (value: any) => {
          setDetailOrder((prev) => ({ ...prev, method: value }));
        },
      },
    },
  ];

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
              {productData.Category?.Parent?.name}
            </BChip>
            <BChip backgroundColor={colors.chip.disabled}>
              slump {productData?.properties?.slump}±12 cm
            </BChip>
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={style.priceContainer}>
            <Text style={style.hargaText}>Harga Dasar</Text>
            <Text style={style.hargaText}>
              IDR {formatCurrency(productData?.Price?.price)}
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
            <Text style={style.distanceText}>{distanceCeil} KM</Text>
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
              IDR {formatCurrency(productData.calcPrice)}
            </Text>
          </View>
        </View>
        <View style={style.outerInputContainer}>
          <BSpacer size="extraSmall" />
          <View style={style.inputContainer}>
            <View style={style.volumeContainer}>
              <Text style={style.inputLabel}>Volume</Text>
              <BTextInput
                onChange={(
                  event: NativeSyntheticEvent<TextInputChangeEventData>
                ) => {
                  onChange('volume')(event.nativeEvent.text);
                }}
                value={detailOrder.volume}
                keyboardType="numeric"
                returnKeyType="next"
                right={
                  <TextInput.Icon
                    forceTextInputFocus={false}
                    icon={() => TextIcon('m³')}
                  />
                }
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
            <View style={style.sellPriceContainer}>
              <Text style={style.inputLabel}>Harga Jual</Text>
              <BTextInput
                onChange={(
                  event: NativeSyntheticEvent<TextInputChangeEventData>
                ) => {
                  onChange('sellPrice')(event.nativeEvent.text);
                }}
                value={detailOrder.sellPrice}
                keyboardType="numeric"
                left={
                  <TextInput.Icon
                    forceTextInputFocus={false}
                    icon={() => TextIcon('IDR')}
                  />
                }
                right={
                  <TextInput.Icon
                    forceTextInputFocus={false}
                    icon={() => TextIcon('/m³')}
                  />
                }
                placeholder="0"
                placeholderTextColor={colors.textInput.placeHolder}
              />
              {
                // !!(+detailOrder.sellPrice < productData.calcPrice) && (
                //   <BText size="small" color="primary" bold="100">
                //     {!detailOrder.sellPrice
                //       ? 'Harga jual harus diisi'
                //       : 'Harga tidak bisa lebih rendah dari Harga Jual Terendah'}
                //   </BText>
                // )
              }
            </View>
          </View>
          <BSpacer size="extraSmall" />
          <View style={style.priceContainer}>
            <Text style={style.hargaText}>Biaya Mobilisasi</Text>
            <Text style={style.hargaText}>
              IDR {calcPrice ? formatCurrency(calcPrice) : '0'}
            </Text>
          </View>
          <BSpacer size="extraSmall" />
          <View>
            <BForm titleBold="500" inputs={methodInput} />
          </View>
          <BSpacer size="extraSmall" />
          <View style={style.priceContainer}>
            <Text style={style.productName}>Total Harga</Text>
            <Text style={style.boldPrice}>
              IDR {formatCurrency(totalPrice)}
            </Text>
          </View>
          <BSpacer size="large" />
        </View>
        <View style={style.buttonContainer}>
          <BButtonPrimary
            title="Tambah Produk"
            disable={
              // +detailOrder.sellPrice < productData.calcPrice ||
              !detailOrder.volume || !detailOrder.method
            }
            onPress={() => {
              choseProduct((curr) => {
                const currentValue = [...curr];
                const newData = {
                  product: productData,
                  productId: productData.id,
                  categoryId: productData.Category.id,
                  sellPrice: detailOrder.sellPrice,
                  volume: detailOrder.volume,
                  pouringMethod: detailOrder.method,
                  totalPrice: totalPrice,
                  additionalData: getAddPrice(),
                };
                const existingDataIndex = currentValue.findIndex(
                  (data) => data.product.id === productData.id
                );
                if (existingDataIndex !== -1) {
                  currentValue.splice(existingDataIndex, 1, newData);
                } else {
                  currentValue.push(newData);
                }
                return currentValue;
              });
              setIsVisible((curr) => !curr);
              setTimeout(() => {
                resetSelectedProduct();
              }, 100);
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
    height: '95%',
    borderTopLeftRadius: layout.radius.lg,
    borderTopRightRadius: layout.radius.lg,
  },
  modalHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.pad.ml,
  },
  headerText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[700],
    fontSize: fonts.size.lg,
  },
  grayContent: {
    backgroundColor: colors.tertiary,
    height: resScale(250),
    paddingHorizontal: layout.mainPad,
    paddingTop: layout.mainPad,
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
  outerInputContainer: {
    paddingHorizontal: layout.mainPad,
    paddingTop: layout.pad.xs,
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
    flex: 1,
    justifyContent: 'flex-end',
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
  volumeContainer: {
    width: '45%',
  },
  sellPriceContainer: {
    width: '50%',
  },
});
