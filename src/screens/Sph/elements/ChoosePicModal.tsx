import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Modal from 'react-native-modal';
import { BContainer, BForm, BSpacer } from '@/components';
import { resScale } from '@/utils';
import { colors, fonts, layout } from '@/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BButtonPrimary } from '@/components';
import { SphContext } from './context/SphContext';
import { Input } from '@/interfaces';

import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type dummyType = {
  id: string;
  name: string;
  position: string;
  phone: number;
  email: string;
};
const dummyData: dummyType[] = [
  {
    id: 'kwos0299',
    name: 'Agus',
    position: 'Finance',
    phone: 81128869884,
    email: 'agus@gmail.com',
  },
  {
    id: '1233okjs',
    name: 'Joko',
    position: 'Finance',
    phone: 81128869884,
    email: 'Joko@gmail.com',
  },
  {
    id: 'jsncijc828',
    name: 'Johny',
    position: 'Finance',
    phone: 81128869884,
    email: 'Johny@gmail.com',
  },
];
function dummyReq() {
  return new Promise<dummyType[]>((resolve) => {
    setTimeout(() => {
      resolve(dummyData);
    }, 5000);
  });
}

type ChoosePicModalType = {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  openAddPic: () => void;
};

export default function ChoosePicModal({
  isModalVisible,
  setIsModalVisible,
  openAddPic = () => {},
}: ChoosePicModalType) {
  const [isLoading, setIsLoading] = useState(false);
  const [flatListData, setFlatListData] = useState<any[]>([]);
  const [sphState, stateUpdate] = useContext(SphContext);
  const [selectedPic, setSelectedPic] = useState<dummyType | null | undefined>(
    null
  );
  const [scrollOffSet, setScrollOffSet] = useState<number | undefined>(
    undefined
  );

  //   function handleOnScroll(event) {
  //     setScrollOffSet(event.nativeEvent.contentOffset.y);
  //   }
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setFlatListData([]);
      const data = await dummyReq();
      //sphState?.selectedPic?.id
      const findPicById = data.find(
        (item: dummyType) => item.id === sphState?.selectedPic?.id
      );
      if (findPicById) {
        setSelectedPic(findPicById);
      }
      setFlatListData(data);
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputsData: Input[] = useMemo(() => {
    const values = flatListData.map((item) => {
      if (selectedPic && item.id === selectedPic.id) {
        return {
          ...item,
          isSelected: true,
        };
      }
      return {
        ...item,
        isSelected: false,
      };
    });
    return [
      {
        label: 'PIC',
        isRequire: true,
        isError: false,
        type: 'PIC',
        value: values,
        hidePicLabel: true,
        // onChange: () => {
        //   //   openBottomSheet();
        //   openAddPic();
        // },
        onSelect: (index: number) => {
          if (stateUpdate) {
            setSelectedPic(flatListData[index]);
            // stateUpdate('selectedPic')(flatListData[index]);
          }
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flatListData, selectedPic]);

  return (
    <Modal
      hideModalContentWhileAnimating={true}
      backdropOpacity={0.3}
      isVisible={isModalVisible}
      onBackButtonPress={() => {
        setIsModalVisible((curr) => !curr);
      }}
      style={style.modal}
      //   scrollOffset={10}
      scrollOffset={scrollOffSet}
      scrollOffsetMax={resScale(350) - resScale(190)}
      propagateSwipe={true}
      //   swipeDirection={'down'}
      //   onSwipeComplete={() => {
      //     setIsModalVisible((curr) => !curr);
      //   }}
    >
      <View style={style.modalContent}>
        {/* <Text>testing</Text> */}

        <BContainer>
          <View style={style.container}>
            <View>
              <View style={style.modalHeader}>
                <Text style={style.headerText}>Pilih PIC</Text>
                <TouchableOpacity
                  onPress={() => setIsModalVisible((curr) => !curr)}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={30}
                    color="#000000"
                  />
                </TouchableOpacity>
              </View>
              {/* <BSpacer size={'small'} /> */}
              {/* <ScrollView contentContainerStyle={{ height: 150 }}> */}
              <View style={{ height: resScale(250) }}>
                <View style={style.tambahPicContainer}>
                  <TouchableOpacity onPress={openAddPic}>
                    <Text style={style.tambahPicText}>+ Tambah PIC</Text>
                  </TouchableOpacity>
                </View>
                <BSpacer size={'extraSmall'} />
                <ScrollView
                  onScroll={(event) => {
                    setScrollOffSet(event.nativeEvent.contentOffset.y);
                  }}
                >
                  {!isLoading && <BForm inputs={inputsData} />}
                  {isLoading && (
                    <View>
                      <BSpacer size={'extraSmall'} />
                      <ShimmerPlaceHolder style={style.loadingShimmer} />
                      <BSpacer size={'extraSmall'} />
                      <ShimmerPlaceHolder style={style.loadingShimmer} />
                    </View>
                  )}
                </ScrollView>
              </View>

              {/* </ScrollView> */}
              <BButtonPrimary title="Pilih" />
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
    borderTopLeftRadius: layout.radius.sm,
    borderTopRightRadius: layout.radius.sm,
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
  tambahPicContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tambahPicText: {
    color: colors.primary,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
  },
  loadingShimmer: {
    width: resScale(335),
    height: resScale(100),
    borderRadius: layout.radius.md,
  },
});
