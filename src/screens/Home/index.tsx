import React, { useState, useRef, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';
import TargetCard from './elements/TargetCard';
import scaleSize from '@/utils/scale';
import DateDaily from './elements/DateDaily';
import useHeaderShow from '@/hooks/useHeaderShow';

import BQuickAction from '@/components/organism/BQuickActionMenu';
import { buttonDataType } from '@/interfaces/QuickActionButton.type';
import { BBottomSheet } from '@/components/atoms/BBottomSheet';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import BsearchBar from '@/components/molecules/BsearchBar';
import BVisitationCard from '@/components/molecules/BVisitationCard';
import moment from 'moment';
import { TextInput } from 'react-native-paper';
import BuatKunjungan from './elements/BuatKunjungan';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
import Modal from 'react-native-modal';

import BTabViewScreen from '@/components/organism/BTabViewScreen';

type RenderListType = {
  isLoading: boolean;
  data: {
    [key: string]: any;
    name: string;
  }[];
  searchQuery?: string;
};
const RenderList = ({ isLoading, data, searchQuery }: RenderListType) => {
  if (isLoading) {
    return (
      <View style={style.flatListLoading}>
        <ShimmerPlaceHolder style={style.flatListShimmer} />
      </View>
    );
  }

  return (
    <BottomSheetFlatList
      style={style.flatListContainer}
      data={data}
      keyExtractor={(item, index) => `${item.name}-${index}`}
      renderItem={({ item }) => {
        return <BVisitationCard item={item} searchQuery={searchQuery} />;
      }}
    />
  );
};

const Beranda = () => {
  const [currentVisit] = useState(5); //temporary setCurrentVisit
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // temporary setIsLoading
  const [isRenderDateDaily, setIsRenderDateDaily] = useState(true); //setIsRenderDateDaily
  const [snapPoints] = useState(['68%', '91%', '100%']); //setSnapPoints
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalVisible, setModalVisible] = useState(false);
  const [isHeaderShown, setIsHeaderShown] = useState(true);
  useHeaderShow({ isHeaderShown: isHeaderShown });
  const toggleModal = () => {
    setIsHeaderShown(!isHeaderShown);
    setModalVisible(!isModalVisible);
  };
  const bottomSheetOnchange = (index: number) => {
    if (index === 0 || index === 1) {
      //   setSnapPoints(['68%', '91%']);
      setIsRenderDateDaily(true);
    } else {
      setIsRenderDateDaily(false);
    }
    if (index === 0) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  const data = useMemo(
    () =>
      Array(8)
        .fill(0)
        .map((_, index) => {
          return {
            name: 'PT. Guna Karya Mandiri',
            location: 'Jakarta',
            time: `12:${(() => index.toString().padStart(2, '0'))()}`,
            status: `Visit ke ${index}`,
            pilStatus: 'Selesai',
          };
        }),
    []
  );

  const tabData = useMemo(() => {
    return {
      ['Semua']: Array(8)
        .fill(0)
        .map((_) => {
          return {
            name: 'PT. Guna Karya Mandiri',
            pilNames: [
              'Guna Karya Mandiri',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
            ],
          };
        }),
      ['Perusahaan']: Array(3)
        .fill(0)
        .map((_) => {
          return {
            name: 'PT. Guna Karya Mandiri',
            pilNames: [
              'Guna Karya Mandiri',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
            ],
          };
        }),
      ['Proyek']: Array(3)
        .fill(0)
        .map((_) => {
          return {
            name: 'PT. Guna Karya Mandiri',
            pilNames: [
              'Guna Karya Mandiri',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
            ],
          };
        }),
      ['PIC']: Array(2)
        .fill(0)
        .map((_) => {
          return {
            name: 'PT. Guna Karya Mandiri',
            pilNames: [
              'Guna Karya Mandiri',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
            ],
          };
        }),
    };
  }, []);

  const buttonsData: buttonDataType[] = useMemo(
    () => [
      {
        icon: require('@/assets/icon/QuickActionIcon/ic_sph.png'),
        title: 'Buat SPH',
        action: () => {},
      },
      {
        icon: require('@/assets/icon/QuickActionIcon/ic_po.png'),
        title: 'Buat PO',
        action: () => {},
      },
      {
        icon: require('@/assets/icon/QuickActionIcon/ic_depos.png'),
        title: 'Buat Deposit',
        action: () => {},
      },
      {
        icon: require('@/assets/icon/QuickActionIcon/ic_janji.png'),
        title: 'Buat Jadwal',
        action: () => {},
      },
      {
        icon: require('@/assets/icon/QuickActionIcon/ic_temu.png'),
        title: 'Buat Janji Temu',
        action: () => {},
      },
    ],
    []
  );

  const todayMark = useMemo(() => {
    return [
      {
        date: moment(),
        lines: [
          {
            color: colors.primary,
          },
        ],
      },
    ];
  }, []);

  const onChangeSearch = (text: string) => {
    // const alphanumericRegex = /^[0-9a-zA-Z\s]+$/;
    // if (!text) {
    //   setSearchQuery('');
    // }
    // if (alphanumericRegex.test(text)) {
    setSearchQuery(text);
    // }
  };

  const kunjunganAction = () => {
    setIsLoading((curr) => !curr);
  };

  return (
    <View style={style.container}>
      <Modal
        isVisible={isModalVisible}
        backdropOpacity={1}
        backdropColor="white"
        hideModalContentWhileAnimating={true}
        coverScreen={false}
      >
        <View style={style.modalContent}>
          <BsearchBar
            placeholder="Search"
            activeOutlineColor="gray"
            left={
              <TextInput.Icon
                onPress={kunjunganAction}
                forceTextInputFocus={false}
                icon="magnify"
              />
            }
            right={
              <TextInput.Icon
                forceTextInputFocus={false}
                onPress={toggleModal}
                icon="close"
              />
            }
            value={searchQuery}
            onChangeText={onChangeSearch}
          />
          <BTabViewScreen
            dataToRender={tabData}
            renderItem={(item) => (
              <BVisitationCard item={item} searchQuery={searchQuery} />
            )}
            isLoading={isLoading}
          />
        </View>
      </Modal>
      <TargetCard
        isExpanded={isExpanded}
        maxVisitation={10}
        currentVisitaion={currentVisit}
        isLoading={isLoading}
      />
      <BQuickAction
        containerStyle={{
          paddingLeft: scaleSize.moderateScale(25),
          height: scaleSize.moderateScale(100),
        }}
        buttonProps={buttonsData}
      />

      <BBottomSheet
        onChange={bottomSheetOnchange}
        percentSnapPoints={snapPoints}
        ref={bottomSheetRef}
        initialSnapIndex={0}
        enableContentPanningGesture={true}
        style={style.BsheetStyle}
        footerComponent={(props) => {
          return BuatKunjungan(props, kunjunganAction);
        }}
      >
        <View style={style.posRelative}>
          <TouchableOpacity style={style.touchable} onPress={toggleModal} />
          <BsearchBar
            placeholder="Search"
            activeOutlineColor="gray"
            left={<TextInput.Icon icon="magnify" />}
            value={searchQuery}
          />
        </View>

        <DateDaily markedDatesArray={todayMark} isRender={isRenderDateDaily} />

        <RenderList
          isLoading={isLoading}
          data={data}
          searchQuery={searchQuery}
        />
      </BBottomSheet>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.primary,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'blue',
    width: '100%',
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
  BsheetStyle: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  flatListContainer: {},
  flatListLoading: {
    marginTop: scaleSize.moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListShimmer: {
    width: scaleSize.moderateScale(320),
    height: scaleSize.moderateScale(60),
    borderRadius: scaleSize.moderateScale(8),
  },
  modalContent: {
    flex: 1,
  },
  posRelative: {
    position: 'relative',
    marginBottom: scaleSize.moderateScale(10),
  },
  touchable: {
    position: 'absolute',
    width: '100%',
    borderRadius: scaleSize.moderateScale(4),
    height: scaleSize.moderateScale(45),
    zIndex: 2,
  },
});
export default Beranda;
