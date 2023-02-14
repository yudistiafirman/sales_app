import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
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
import { BFlatlistItems } from '@/components';

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
  console.log(JSON.stringify(sphState), 'sphState24');

  const payload = {
    shippingAddress: {} as shippingAddressType,
    requestedProducts: [] as requestedProductsType[],
    delivery: {} as deliveryAndDistance,
    distance: {} as deliveryAndDistance,
    billingAddress: {},
  } as sphOrderPayloadType;
  const { selectedCompany, projectAddress } = sphState;
  const locationAddress = selectedCompany?.locationAddress;

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

    payload.distance = sphState.chosenProducts[0].additionalData.distance;
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

  if (locationAddress) {
    if (locationAddress.id) {
      payload.shippingAddress.id = locationAddress.id;
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
    payload.picArr = selectedCompany.PIC;
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
    console.log(sphState.billingAddress.addressAutoComplete, 'testing9292');
  } else {
    payload.billingAddress = payload.shippingAddress;
  }

  // if (!sphState.isBillingAddressSame) {
  // }
  console.log(JSON.stringify(payload), 'payload1012');

  return payload;
}

export default function FifthStep() {
  const dispatch = useDispatch();
  const { isOrderLoading } = useSelector((state: RootState) => state.order);
  const [sphState, stateUpdate, setCurrentPosition] = useContext(SphContext);

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
        if (stateUpdate) {
          stateUpdate('useHighway')(val);
        }
      },
      value: sphState?.useHighway,
      labelStyle: {
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.md,
      },
    },
  ];
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
      console.log(validPhotoCount, 'validPhotoCount241');

      if (
        (sphState.uploadedAndMappedRequiredDocs.length === 0 &&
          !isNoPhotoToUpload) ||
        validPhotoCount > sphState.uploadedAndMappedRequiredDocs.length
      ) {
        console.log('ini mau upload foto', photoFiles);
        const photoResponse = await dispatch(
          postUploadFiles({ files: photoFiles, from: 'sph' })
        ).unwrap();
        console.log('upload kelar');

        const files: { documentId: string; fileId: string }[] = [];
        photoResponse.forEach((photo) => {
          const photoName = `${photo.name}.${photo.type}`;
          const photoNamee = `${photo.name}.jpg`;
          Object.keys(sphState.paymentRequiredDocuments);
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
                  // return {
                  // documentId: documentId,
                  // fileId: photo.id,
                  // };
                  foundPhoto = documentId;
                }
              }
            }
          }
          if (foundPhoto) {
            // return {
            //   documentId: foundPhoto,
            //   fileId: photo.id,
            // };
            files.push({
              documentId: foundPhoto,
              fileId: photo.id,
            });
          }
        });
        console.log(files, 'filesmapped');

        const isFilePhotoNotNull = files.every((val) => val === null);
        if (!isFilePhotoNotNull) {
          payload.projectDocs = files;
        }
        stateUpdate('uploadedAndMappedRequiredDocs')(files);
      } else if (!isNoPhotoToUpload) {
        const isFilePhotoNotNull = sphState.uploadedAndMappedRequiredDocs.every(
          (val) => val === null
        );
        if (!isFilePhotoNotNull) {
          payload.projectDocs = sphState.uploadedAndMappedRequiredDocs;
        }
      }
      console.log(JSON.stringify(payload), 'payloadfinal');

      const sphResponse = await dispatch(postOrderSph({ payload })).unwrap();
      const { sph } = sphResponse;
      if (!sph) {
        throw sphResponse;
      }
      setMadeSphData(sph);
      dispatch(closePopUp());
      setIsStepDoneVisible(true);
    } catch (error) {
      const messageError = error?.message;
      console.log(error, 'errorbuatSph54', messageError);
      dispatch(closePopUp());
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText: 'Error Menyimpan SPH',
          outsideClickClosePopUp: true,
        })
      );
    }
  }

  return (
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
          // setIsStepDoneVisible((curr) => !curr);
          stateUpdate('selectedPic')(pic);
          setIsModalVisible((curr) => !curr);
        }}
      />
      <View style={{ minHeight: resScale(80) }}>
        <BVisitationCard
          item={{
            name: sphState?.selectedCompany?.name
              ? sphState?.selectedCompany?.name
              : '-',
            location: sphState?.selectedCompany?.locationAddress.line1,
          }}
          isRenderIcon={false}
        />
      </View>
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
      <BSpacer size={'verySmall'} />
      <BPic
        name={sphState?.selectedPic?.name}
        position={sphState?.selectedPic?.position}
        phone={sphState?.selectedPic?.phone}
        email={sphState?.selectedPic?.email}
      />
      <BSpacer size={'extraSmall'} />
      <View style={style.produkLabel}>
        <Text style={style.picText}>Produk</Text>
      </View>

      <BFlatlistItems
        renderItem={(item) => {
          return (
            <BProductCard
              name={item.product.name}
              pricePerVol={+item.sellPrice}
              volume={+item.volume}
              totalPrice={+item.totalPrice}
            />
          );
        }}
        data={sphState?.chosenProducts}
        emptyText={'Produk tidak ada yang terpilih'}
      />
      <BSpacer size={'extraSmall'} />
      <BForm inputs={inputsData} />
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
              ...sphState.selectedCompany.PIC,
              { ...pic, isSelected: false },
            ];

            stateUpdate('selectedCompany')({
              ...sphState.selectedCompany,
              PIC: newList,
            });
            // stateUpdate('picList')(newList);
          }
        }}
      />
    </BContainer>
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
