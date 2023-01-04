import React, { useState, useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import TargetCard from './elements/TargetCard';
import scaleSize from '@/utils/scale';
import DateDaily from './elements/DateDaily';

import BQuickAction from '@/components/organism/BQuickActionMenu';
import { buttonDataType } from '@/interfaces/QuickActionButton.type';
import { BBottomSheet } from '@/components/atoms/BBottomSheet';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import BsearchBar from '@/components/molecules/BSearchBar';
import BVisitationCard from '@/components/molecules/BVisitationCard';
import moment from 'moment';
import { TextInput } from 'react-native-paper';
import BuatKunjungan from './elements/BuatKunjungan';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const Beranda = () => {
  const [currentVisit] = useState(5); //temporary setCurrentVisit
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // temporary setIsLoading
  const [isRenderDateDaily, setIsRenderDateDaily] = useState(true); //setIsRenderDateDaily
  const [snapPoints, setSnapPoints] = useState(['63%', '87%']); //setSnapPoints
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const bottomSheetOnchange = (index: number) => {
    if (index === 0 || index === 1) {
      setSnapPoints(['63%', '87%']);
    }
    if (index === 0) {
      setIsExpanded(true);
      setIsRenderDateDaily(true);
    } else {
      setIsExpanded(false);
      setIsRenderDateDaily(false);
    }
  };

  const searchOnFocus = () => {
    setSnapPoints(['63%', '87%', '100%']); // when search query is not null and showing search results

    setTimeout(() => {
      console.log(snapPoints, 'setTimeout');
      bottomSheetRef.current?.expand();
    }, 100);
  };

  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_) => {
          return {
            name: 'PT. Guna Karya Mandiri',
            // location: 'Jakarta',
            pilNames: [
              'Guna Karya Mandiri',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
            ],
            // time: `12:${(() => index.toString().padStart(2, '0'))()}`,
            // status: `Visit ke ${index}`,
            // pilStatus: 'Selesai',
          };
        }),
    []
  );

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

  const renderList = () => {
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

  const kunjunganAction = () => {
    setIsLoading((curr) => !curr);
  };

  return (
    <View style={style.container}>
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
        <BsearchBar
          onFocus={searchOnFocus}
          placeholder="Search"
          activeOutlineColor="gray"
          left={<TextInput.Icon icon="magnify" />}
          value={searchQuery}
          onChangeText={onChangeSearch}
        />
        <DateDaily markedDatesArray={todayMark} isRender={isRenderDateDaily} />

        {renderList()}
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
  flatListContainer: {
    marginTop: 10,
  },
  flatListLoading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListShimmer: {
    width: scaleSize.moderateScale(320),
    height: scaleSize.moderateScale(60),
    borderRadius: scaleSize.moderateScale(8),
  },
});
export default Beranda;
