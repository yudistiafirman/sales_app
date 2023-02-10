import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
import { useDispatch } from 'react-redux';

function payloadMapper(sphState: SphStateInterface) {
  console.log(JSON.stringify(sphState), 'sphState24');

  const payload = {
    shippingAddress: {} as shippingAddressType,
    requestedProducts: [] as requestedProductsType[],
    delivery: {} as deliveryAndDistance,
    distance: {} as deliveryAndDistance,
  } as sphOrderPayloadType;
  const { selectedCompany, projectAddress } = sphState;
  const locationAddress = selectedCompany?.locationAddress;
  //harcode m3
  console.log(projectAddress, 'projectAddressdistep5');

  if (sphState.chosenProducts.length > 0) {
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
    const deliveries = [];
    sphState.chosenProducts.forEach((prod) => {
      console.log(prod.additionalData, 'iniaddprices58');

      deliveries.push(prod.additionalData.delivery);
    });
    const highestPrice = deliveries.reduce(function (prev, curr) {
      return prev.price > curr.price ? prev : curr;
    });
    payload.delivery = highestPrice;
  }

  if (locationAddress) {
    console.log(locationAddress, 'locationAddress69');

    if (locationAddress.id) {
      payload.shippingAddress.id = locationAddress.id;
    }
  }
  if (projectAddress && sphState.isBillingAddressSame) {
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
      payload.shippingAddress.postalCode = projectAddress.postalId;
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
  }
  if (typeof sphState.paymentBankGuarantee === 'boolean') {
    payload.isProvideBankGuarantee = sphState.paymentBankGuarantee;
  }
  if (sphState.billingAddress.name) {
    if (sphState.isBillingAddressSame) {
      payload.billingRecipientName = sphState.selectedPic.name;
    } else {
      payload.billingRecipientName = sphState.billingAddress.name;
    }
  }
  if (sphState.billingAddress.phone) {
    if (sphState.isBillingAddressSame) {
      payload.billingRecipientPhone = sphState.selectedPic.phone;
    } else {
      payload.billingRecipientPhone = sphState.billingAddress.phone.toString();
    }
  }
  if (!sphState.isBillingAddressSame) {
    if (sphState.billingAddress.addressAutoComplete) {
      payload.shippingAddress.line1 =
        sphState.billingAddress.addressAutoComplete.title;
      payload.shippingAddress.postalCode =
        sphState.billingAddress.addressAutoComplete.id;
    }
    if (sphState.billingAddress.fullAddress) {
      payload.shippingAddress.line2 = sphState.billingAddress.fullAddress;
    }
  }
  // if (!sphState.isBillingAddressSame) {
  // }
  console.log(JSON.stringify(payload), 'payload1012');

  return payload;
}

export default function FifthStep() {
  const dispatch = useDispatch();
  const [sphState, stateUpdate] = useContext(SphContext);

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isStepDoneVisible, setIsStepDoneVisible] = useState(false);

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
    },
  ];
  function addPicHandler() {
    setIsModalVisible(false);
    bottomSheetRef.current?.expand();
  }

  async function buatSph() {
    try {
      const payload = payloadMapper(sphState);

      const photoFiles = Object.values(sphState.paymentRequiredDocuments);
      console.log(photoFiles, '`photoFiles170`');

      const photoResponse = await dispatch(
        postUploadFiles({ files: photoFiles, from: 'sph' })
      ).unwrap();
      console.log(photoResponse, 'photoResponseuploaded');

      // const files = photoResponse.map((photo) => {
      //   const photoName = `${photo.name}.${photo.type}`;
      //   const photoNamee = `${photo.name}.jpg`;
      //   const foundObject = photoUrls.find(
      //     (obj) => obj.photo.name === photoName || obj.photo.name === photoNamee
      //   );
      //   if (foundObject) {
      //     return {
      //       id: photo.id,
      //       type: foundObject.type,
      //     };
      //   }
      // });
    } catch (error) {
      console.log(error, 'errorbuatSph54');
    }
  }

  return (
    <BContainer>
      <StepDone
        isModalVisible={isStepDoneVisible}
        setIsModalVisible={setIsStepDoneVisible}
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
      <BSpacer size={'extraSmall'} />
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
        continueText={'Buat Sph'}
        onPressContinue={buatSph}
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
    fontSize: fonts.size.md,
    color: colors.primary,
  },
  produkLabel: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.altGrey,
    paddingBottom: resScale(5),
  },
});
