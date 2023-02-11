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
import { Input, SphStateInterface } from '@/interfaces';
import { BFlatlistItems } from '@/components';

import ChoosePicModal from '../ChoosePicModal';
import BSheetAddPic from '@/screens/Visitation/elements/second/BottomSheetAddPic';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { SphContext } from '../context/SphContext';
import StepDone from '../StepDoneModal/StepDone';

function payloadMapper(sphState: SphStateInterface) {
  console.log(JSON.stringify(sphState), 'sphState24');
}

export default function FifthStep() {
  const [sphState, stateUpdate] = useContext(SphContext);

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isStepDoneVisible, setIsStepDoneVisible] = useState(false);
  console.log(sphState?.selectedCompany, 'selectedCompany30');

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
      console.log('buatsph52');
      payloadMapper(sphState);
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
