import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
} from 'react-native';
import React, { useContext, useState } from 'react';
import {
  BBackContinueBtn,
  BContainer,
  BForm,
  BPic,
  BSpacer,
  BProductCard,
} from '@/components';
import { BVisitationCard } from '@/components';
import { resScale } from '@/utils';
import { colors, fonts } from '@/constants';
import {
  deliveryAndDistance,
  Input,
  postSphResponseType,
  requestedProductsType,
  shippingAddressType,
  sphOrderPayloadType,
  SphStateInterface,
} from '@/interfaces';
import ChoosePicModal from '../ChoosePicModal';
import BSheetAddPic from '@/screens/Visitation/elements/second/BottomSheetAddPic';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { SphContext } from '../context/SphContext';
import StepDone from '../StepDoneModal/StepDone';
import { postUploadFiles } from '@/redux/async-thunks/commonThunks';
import { useDispatch, useSelector } from 'react-redux';
import { postOrderSph } from '@/redux/async-thunks/orderThunks';
import { RootState } from '@/redux/store';
import { closePopUp, openPopUp } from '@/redux/reducers/modalReducer';
import crashlytics from '@react-native-firebase/crashlytics';
import { SPH } from '@/navigation/ScreenNames';
import {
  updateSelectedCompany,
  updateSelectedPic,
  updateUploadedAndMappedRequiredDocs,
  updateUseHighway,
} from '@/redux/reducers/SphReducer';

function countNonNullValues(array) {
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== null) {
      count++;
    }
  }
  return count;
}

function payloadMapper(sphState: SphStateInterface) {
  const payload = {
    shippingAddress: {} as shippingAddressType,
    requestedProducts: [] as requestedProductsType[],
    delivery: {} as deliveryAndDistance,
    distance: {} as deliveryAndDistance,
    billingAddress: {},
  } as sphOrderPayloadType;
  const { selectedCompany, projectAddress } = sphState;
  const LocationAddress = selectedCompany?.LocationAddress;

  if (sphState.chosenProducts.length > 0) {
    //harcode m3
    payload.requestedProducts = sphState.chosenProducts.map((product) => {
      return {
        productId: product.productId,
        categoryId: product.categoryId,
        offeringPrice: +product.sellPrice,
        quantity: +product.volume,
        productName: product.product.name,
        productUnit: 'm3',
      };
    });

    payload.distance.id = sphState.chosenProducts[0].additionalData.distance.id;
    payload.distance.price =
      sphState.chosenProducts[0].additionalData.distance.price;

    if (sphState.distanceFromLegok) {
      payload.distance.userDistance = Math.ceil(
        sphState.distanceFromLegok / 1000
      );
    }
    // find highest delivery
    const deliveries: deliveryAndDistance[] = [];
    sphState.chosenProducts.forEach((prod) => {
      deliveries.push(prod.additionalData.delivery);
    });
    const highestPrice = deliveries.reduce(function (prev, curr) {
      return prev.price > curr.price ? prev : curr;
    });
    payload.delivery = highestPrice;
  }

  if (LocationAddress) {
    if (LocationAddress.id) {
      payload.shippingAddress.id = LocationAddress.id;
    }
  }
  if (projectAddress) {
    if (projectAddress.city) {
      payload.shippingAddress.city = projectAddress.city;
    }
    if (projectAddress.district) {
      payload.shippingAddress.district = projectAddress.district;
    }
    if (projectAddress.lat) {
      payload.shippingAddress.lat = projectAddress.lat.toString();
    }
    if (projectAddress.lon) {
      payload.shippingAddress.lon = projectAddress.lon.toString();
    }
    if (projectAddress.formattedAddress) {
      payload.shippingAddress.line1 = projectAddress.formattedAddress;
    }
    if (projectAddress.rural) {
      payload.shippingAddress.rural = projectAddress.rural;
    }
    if (projectAddress.postalId) {
      payload.shippingAddress.postalId = projectAddress.postalId;
    }
  }
  if (sphState.paymentType) {
    payload.paymentType = sphState.paymentType;
  }
  if (typeof sphState.useHighway === 'boolean') {
    payload.viaTol = sphState.useHighway;
  }
  if (typeof sphState.isBillingAddressSame === 'boolean') {
    payload.isUseSameAddress = sphState.isBillingAddressSame;
  }
  if (selectedCompany) {
    payload.projectId = selectedCompany.id;
    if (selectedCompany?.Pics?.length > 0) {
      payload.picArr = selectedCompany.Pics;
    } else {
      const newPicArr = [{ ...selectedCompany?.Pic, isSelected: true }];
      payload.picArr = newPicArr;
    }
  }
  if (typeof sphState.paymentBankGuarantee === 'boolean') {
    payload.isProvideBankGuarantee = sphState.paymentBankGuarantee;
  }

  if (sphState.isBillingAddressSame) {
    if (sphState.selectedPic?.name) {
      payload.billingRecipientName = sphState.selectedPic.name;
    }
    if (sphState.selectedPic?.phone) {
      payload.billingRecipientPhone = sphState.selectedPic.phone;
    }
  } else {
    if (sphState.billingAddress.name) {
      payload.billingRecipientName = sphState.billingAddress.name;
    }
    if (sphState.billingAddress.phone) {
      payload.billingRecipientPhone = sphState.billingAddress.phone.toString();
    }
  }

  // }
  if (!sphState.isBillingAddressSame) {
    if (sphState.billingAddress.addressAutoComplete) {
      if (sphState.billingAddress.addressAutoComplete.formattedAddress) {
        payload.billingAddress.line1 =
          sphState.billingAddress.addressAutoComplete.formattedAddress;
      }
      if (sphState.billingAddress.addressAutoComplete.postalId) {
        payload.billingAddress.postalId =
          sphState.billingAddress.addressAutoComplete.postalId;
      }
      if (sphState.billingAddress.addressAutoComplete.lat) {
        payload.billingAddress.lat =
          sphState.billingAddress.addressAutoComplete.lat;
      }
      if (sphState.billingAddress.addressAutoComplete.lon) {
        payload.billingAddress.lon =
          sphState.billingAddress.addressAutoComplete.lon;
      }
      if (sphState.billingAddress.addressAutoComplete.rural) {
        payload.billingAddress.rural =
          sphState.billingAddress.addressAutoComplete.rural;
      }
      if (sphState.billingAddress.addressAutoComplete.district) {
        payload.billingAddress.district =
          sphState.billingAddress.addressAutoComplete.district;
      }
      if (sphState.billingAddress.addressAutoComplete.city) {
        payload.billingAddress.city =
          sphState.billingAddress.addressAutoComplete.city;
      }
    }
    if (sphState.billingAddress.fullAddress) {
      payload.billingAddress.line2 = sphState.billingAddress.fullAddress;
    }
  } else {
    payload.billingAddress = payload.shippingAddress;
  }
  return payload;
}

export default function FifthStep() {
  const dispatch = useDispatch();
  const { isOrderLoading } = useSelector((state: RootState) => state.order);
  const [, stateUpdate, setCurrentPosition] = useContext(SphContext);
  const sphState = useSelector((state: RootState) => state.sph);

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isStepDoneVisible, setIsStepDoneVisible] = useState(false);
  const [madeSphData, setMadeSphData] = useState<postSphResponseType | null>(
    null
  );

  const inputsData: Input[] = [
    {
      label: 'Menggunakan Jalan Tol?',
      isRequire: false,
      type: 'switch',
      onChange: (val: boolean) => {
        dispatch(updateUseHighway(val));
      },
      value: sphState?.useHighway,
      labelStyle: {
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.md,
      },
    },
  ];

  React.useEffect(() => {
    crashlytics().log(SPH + '-Step5');
  }, []);

  function addPicHandler() {
    setIsModalVisible(false);
    bottomSheetRef.current?.expand();
  }

  async function buatSph() {
    try {
      dispatch(
        openPopUp({
          popUpType: 'loading',
          popUpText: 'Menyimpan SPH',
          outsideClickClosePopUp: false,
        })
      );
      const payload = payloadMapper(sphState);
      const photoFiles = Object.values(sphState.paymentRequiredDocuments);
      const isNoPhotoToUpload = photoFiles.every((val) => val === null);
      payload.projectDocs = [];
      const validPhotoCount = countNonNullValues(photoFiles);
      if (
        (sphState.uploadedAndMappedRequiredDocs.length === 0 &&
          !isNoPhotoToUpload) ||
        validPhotoCount > sphState.uploadedAndMappedRequiredDocs.length
      ) {
        const photoResponse = await dispatch(
          postUploadFiles({ files: photoFiles, from: 'sph' })
        ).unwrap();
        const files: { documentId: string; fileId: string }[] = [];
        photoResponse.forEach((photo) => {
          const photoName = `${photo.name}.${photo.type}`;
          const photoNamee = `${photo.name}.jpg`;
          let foundPhoto;
          for (const documentId in sphState.paymentRequiredDocuments) {
            if (
              Object.prototype.hasOwnProperty.call(
                sphState.paymentRequiredDocuments,
                documentId
              )
            ) {
              const photoData = sphState.paymentRequiredDocuments[documentId];
              if (photoData) {
                if (
                  photoData.name === photoName ||
                  photoData.name === photoNamee
                ) {
                  foundPhoto = documentId;
                }
              }
            }
          }
          if (foundPhoto) {
            files.push({
              documentId: foundPhoto,
              fileId: photo.id,
            });
          }
        });
        const isFilePhotoNotNull = files.every((val) => val === null);
        if (!isFilePhotoNotNull) {
          payload.projectDocs = files;
        }
        dispatch(updateUploadedAndMappedRequiredDocs(files));
      } else if (!isNoPhotoToUpload) {
        const isFilePhotoNotNull = sphState.uploadedAndMappedRequiredDocs.every(
          (val) => val === null
        );
        if (!isFilePhotoNotNull) {
          payload.projectDocs = sphState.uploadedAndMappedRequiredDocs;
        }
      }
      const sphResponse = await dispatch(postOrderSph({ payload })).unwrap();
      const { sph } = sphResponse;
      if (!sph) {
        throw sphResponse;
      }
      setMadeSphData(sph);
      dispatch(closePopUp());
      setTimeout(
        () => setIsStepDoneVisible(true),
        Platform.OS === 'ios' ? 500 : 0
      );
    } catch (error) {
      const messageError = error?.message;
      dispatch(closePopUp());
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText: messageError || 'Error Menyimpan SPH',
          outsideClickClosePopUp: true,
        })
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BContainer>
        <StepDone
          isModalVisible={isStepDoneVisible}
          setIsModalVisible={setIsStepDoneVisible}
          sphResponse={madeSphData}
        />
        <ChoosePicModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          openAddPic={addPicHandler}
          selectPic={(pic) => {
            dispatch(updateSelectedPic(pic));
            setIsModalVisible((curr) => !curr);
          }}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, maxHeight: resScale(70) }}>
            <BVisitationCard
              item={{
                name: sphState?.selectedCompany?.name
                  ? sphState?.selectedCompany?.name
                  : '-',
                location: sphState?.selectedCompany?.LocationAddress.line1,
              }}
              isRenderIcon={false}
            />
          </View>
          <View>
            <BSpacer size={'extraSmall'} />
            <View style={style.picLable}>
              <Text style={style.picText}>PIC</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible((curr) => !curr);
                }}
              >
                <Text style={style.gantiPicText}>Ganti PIC</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <BSpacer size={'verySmall'} />
            <BPic
              name={sphState?.selectedPic?.name}
              position={sphState?.selectedPic?.position}
              phone={sphState?.selectedPic?.phone}
              email={sphState?.selectedPic?.email}
            />
          </View>
          <View>
            <BSpacer size={'extraSmall'} />
            <View style={style.produkLabel}>
              <Text style={style.picText}>Produk</Text>
            </View>
            <BSpacer size={'small'} />
          </View>
          <View>
            <FlatList
              data={sphState?.chosenProducts}
              renderItem={(item) => {
                return (
                  <>
                    <BProductCard
                      name={item.item.product.name}
                      pricePerVol={+item.item.sellPrice}
                      volume={+item.item.volume}
                      totalPrice={+item.item.totalPrice}
                    />
                    <BSpacer size={'small'} />
                  </>
                );
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <BSpacer size={'extraSmall'} />
            <BForm inputs={inputsData} />
          </View>
        </View>
        <BBackContinueBtn
          isContinueIcon={false}
          continueText={'Buat SPH'}
          onPressContinue={buatSph}
          onPressBack={() => {
            setCurrentPosition(3);
          }}
        />
        <BSheetAddPic
          ref={bottomSheetRef}
          initialIndex={-1}
          addPic={(pic: any) => {
            if (sphState.selectedCompany) {
              const newList = [
                ...sphState.selectedCompany.Pics,
                { ...pic, isSelected: false },
              ];
              dispatch(
                updateSelectedCompany({
                  ...sphState.selectedCompany,
                  Pics: newList,
                })
              );
            }
          }}
        />
      </BContainer>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picLable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picText: {
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.md,
    color: colors.text.darker,
  },
  gantiPicText: {
    fontFamily: fonts.family.montserrat[300],
    fontSize: fonts.size.sm,
    color: colors.primary,
  },
  produkLabel: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.altGrey,
    paddingBottom: resScale(5),
  },
});
