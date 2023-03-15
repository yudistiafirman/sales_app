import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as React from 'react';
import Modal from 'react-native-modal';
import {
  BContainer,
  BNestedProductCard,
  BSpacer,
  BVisitationCard,
} from '@/components';
import { resScale } from '@/utils';
import { colors, fonts, layout } from '@/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BButtonPrimary } from '@/components';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { openPopUp } from '@/redux/reducers/modalReducer';

type PoModalData = {
  companyName: string;
  locationName?: string;
  sphs: any;
};

type SelectedPOModalType = {
  isModalVisible: boolean;
  onCloseModal: () => void;
  data: PoModalData;
  onPressCompleted: (data: any) => void;
  modalTitle: string;
  isDeposit?:boolean
};

export default function SelectedPOModal({
  isModalVisible,
  onCloseModal,
  data,
  onPressCompleted,
  modalTitle,
  isDeposit
}: SelectedPOModalType) {
  const [sphData, setSphData] = React.useState<any[]>([]);
  const [expandData,setExpandData]= React.useState<any[]>([])
  const dispatch = useDispatch<AppDispatch>();
  const [scrollOffSet, setScrollOffSet] = React.useState<number | undefined>(
    undefined
  );

  React.useEffect(() => {
    setSphData(data?.sphs);
  }, [data?.sphs]);

  const onSelectButton = (idx: number) => {
    const newSphData = [...sphData];
    const selectedSphData: any[] = newSphData.map((v, i) => {
      return {
        ...v,
        isSelected: idx === i,
      };
    });
    setSphData(selectedSphData);
  };

  const onExpand = (index:number,data:any)=> {
    let newExpandData;
    const isExisted =sphData[0]?.QuotationLetter?.id ? expandData?.findIndex(
      (val) => val?.QuotationLetter?.id === data?.QuotationLetter?.id
    ):  expandData?.findIndex(
      (val) => val?.id === data?.id)
    if (isExisted === -1) {
      newExpandData = [...expandData, data];
    } else {
      newExpandData = sphData[0]?.QuotationLetter?.id? expandData.filter(
        (val) => val?.QuotationLetter?.id !== data?.QuotationLetter?.id
      ) : expandData.filter(
        (val) => val?.id !== data?.id)
    }
    setExpandData(newExpandData);
  }

  const onCloseSelectedPoModal =()=> {
    setSphData([...sphData])
    setExpandData([])
    onCloseModal()
  }

  const onSaveSelectedPo = () => {
    if (sphData.length === 1) {
      onPressCompleted(sphData);
      onCloseSelectedPoModal()
    } else {
      const selectedSphData = sphData.filter((v) => v.isSelected);
      if (selectedSphData.length > 0) {
        onPressCompleted(selectedSphData);
        onCloseSelectedPoModal()
      } else {
        dispatch(
          openPopUp({
            popUpType: 'error',
            outsideClickClosePopUp: true,
            popUpText: 'Salah Satu SPH harus di pilih',
          })
        );
      }
    }
  };

  return (
    <Modal
      hideModalContentWhileAnimating={true}
      backdropOpacity={0.3}
      isVisible={isModalVisible}
      onBackButtonPress={onCloseModal}
      style={style.modal}
      scrollOffset={scrollOffSet}
      scrollOffsetMax={resScale(350) - resScale(190)}
      propagateSwipe={true}
    >
      <View style={style.modalContent}>
        <BContainer>
          <View style={style.container}>
            <View>
              <View style={style.modalHeader}>
                <Text style={style.headerText}>{modalTitle}</Text>
                <TouchableOpacity onPress={onCloseSelectedPoModal}>
                  <MaterialCommunityIcons
                    name="close"
                    size={25}
                    color="#000000"
                  />
                </TouchableOpacity>
              </View>
              <BSpacer size={'extraSmall'} />
              <View style={{ height: resScale(250) }}>
                <ScrollView
                  onScroll={(event) => {
                    setScrollOffSet(event.nativeEvent.contentOffset.y);
                  }}
                >
                  <BVisitationCard
                    item={{
                      name: data?.companyName,
                      location: data?.locationName,
                    }}
                    isRenderIcon={false}
                  />
                  <BSpacer size={'extraSmall'} />
                  {data?.sphs && data?.sphs.length > 0 && (
                    <BNestedProductCard
                      isOption={data?.sphs.length > 1}
                      withoutHeader={false}
                      data={sphData}
                      isDeposit={isDeposit}
                      expandData={expandData}
                      onSelect={onSelectButton}
                      onExpand={onExpand}
                    />
                  )}
                </ScrollView>
              </View>

              <BButtonPrimary title="Simpan" onPress={onSaveSelectedPo} />
            </View>
          </View>
        </BContainer>
      </View>
    </Modal>
  );
}

const style = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: {
    justifyContent: 'space-between',
    height: resScale(300),
  },
  modalContent: {
    backgroundColor: 'white',
    height: resScale(350),
    borderTopLeftRadius: layout.radius.lg,
    borderTopRightRadius: layout.radius.lg,
  },
  modalHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[700],
    fontSize: fonts.size.lg,
  },
});
