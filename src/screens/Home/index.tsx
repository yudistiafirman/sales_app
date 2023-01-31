import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';
import TargetCard from './elements/TargetCard';
import resScale from '@/utils/resScale';
import DateDaily from './elements/DateDaily';
import useHeaderShow from '@/hooks/useHeaderShow';

import BQuickAction from '@/components/organism/BQuickActionMenu';
import { buttonDataType } from '@/interfaces/QuickActionButton.type';
import BottomSheet from '@gorhom/bottom-sheet';
import BVisitationCard from '@/components/molecules/BVisitationCard';
import moment from 'moment';
import { TextInput } from 'react-native-paper';
import BuatKunjungan from './elements/BuatKunjungan';
import { BBottomSheet, BSearchBar, BFlatlistItems } from '@/components';
import { useNavigation } from '@react-navigation/native';

import Modal from 'react-native-modal';

import BTabViewScreen from '@/components/organism/BTabViewScreen';
import { layout } from '@/constants';
import BottomSheetFlatlist from './elements/BottomSheetFlatlist';

const Beranda = () => {
  const [currentVisit] = useState(5); //temporary setCurrentVisit
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading] = useState(false); // setIsLoading temporary  setIsLoading
  // const [isListLoading, setIsListLoading] = useState(false);
  const [isRenderDateDaily, setIsRenderDateDaily] = useState(true); //setIsRenderDateDaily
  const [snapPoints] = useState(['68%', '91%', '100%']); //setSnapPoints
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

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

  const tabData: { [key: string]: any } = useMemo(() => {
    return {
      ['Semua']: Array(8)
        .fill(0)
        .map((_, index) => {
          return {
            name: 'PT. Guna Karya Mandiri' + index,
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
        .map((_, index) => {
          return {
            name: 'PT. Guna Karya Mandiri' + index,
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
        .map((_, index) => {
          return {
            name: 'PT. Guna Karya Mandiri' + index,
            pilNames: [
              'Guna Karya Mandiri',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
            ],
          };
        }),
      ['PIC']: [],
    };
  }, []);

  const tabToRender: { tabTitle: string; totalItems: number }[] =
    useMemo(() => {
      return [
        {
          tabTitle: 'Semua',
          totalItems: 8,
        },
        {
          tabTitle: 'Perusahaan',
          totalItems: 3,
        },
        {
          tabTitle: 'Proyek',
          totalItems: 3,
        },
        {
          tabTitle: 'PIC',
          totalItems: 0,
        },
      ];
    }, []);

  const tabOnEndReached = useCallback(
    async (info: {
      distanceFromEnd?: number;
      key: string;
      currentPage: number;
      query?: string;
    }) => {
      const result = await new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve(tabData[info.key]);
        }, 3000);
      });
      return result;
    },
    [tabData]
  );

  const buttonsData: buttonDataType[] = useMemo(
    () => [
      {
        icon: require('@/assets/icon/QuickActionIcon/ic_sph.png'),
        title: 'Buat SPH',
        action: () => {
          navigation.navigate('SPH');
        },
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
        action: () => {
          navigation.navigate('Appointment');
        },
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
    setSearchQuery(text);
  };

  const kunjunganAction = () => {
    // setIsLoading((curr) => !curr);
    navigation.navigate('CreateVisitation');
  };
  const sceneToRender = useCallback(
    (key: string) => {
      if (searchQuery.length <= 3) {
        return null;
      }
      return (
        <BFlatlistItems
          renderItem={(item) => (
            <BVisitationCard item={item} searchQuery={searchQuery} />
          )}
          searchQuery={searchQuery}
          initialFetch={() => {
            return tabOnEndReached({
              key,
              currentPage: 1,
              query: searchQuery,
            });
          }}
          onEndReached={(info) => {
            return tabOnEndReached({
              ...info,
              key,
              query: searchQuery,
            });
          }}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery]
  );

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
          <BSearchBar
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
            screenToRender={sceneToRender}
            isLoading={isLoading}
            tabToRender={searchQuery ? tabToRender : []}
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
          paddingLeft: resScale(25),
          height: resScale(100),
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
        footerComponent={(props: any) => {
          return BuatKunjungan(props, kunjunganAction);
        }}
      >
        <View style={style.posRelative}>
          <TouchableOpacity style={style.touchable} onPress={toggleModal} />
          <BSearchBar
            placeholder="Search"
            activeOutlineColor="gray"
            left={<TextInput.Icon icon="magnify" />}
            value={searchQuery}
          />
        </View>

        <DateDaily markedDatesArray={todayMark} isRender={isRenderDateDaily} />

        <BottomSheetFlatlist
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
    paddingLeft: layout.pad.lg,
    paddingRight: layout.pad.lg,
  },
  flatListContainer: {},
  flatListLoading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListShimmer: {
    width: resScale(330),
    height: resScale(60),
    borderRadius: layout.radius.md,
  },
  modalContent: {
    flex: 1,
  },
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
});
export default Beranda;
