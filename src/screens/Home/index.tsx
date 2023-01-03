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
import BsearchBar from '@/components/molecules/BsearchBar';
import BVisitationCard from '@/components/molecules/BVisitationCard';
import moment from 'moment';
import { TextInput } from 'react-native-paper';

const Beranda = () => {
  const [currentVisit] = useState(5); //temporary setCurrentVisit
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading] = useState(false); // temporary setIsLoading
  const [isRenderDateDaily] = useState(true); //setIsRenderDateDaily

  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetOnchange = (index: number) => {
    if (index === 0) {
      setIsExpanded(true);
    } else if (index === 1) {
      setIsExpanded(false);
    }
  };

  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
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
        percentSnapPoints={['63%', '87%']}
        ref={bottomSheetRef}
        initialSnapIndex={0}
        enableContentPanningGesture={true}
        style={style.BsheetStyle}
      >
        <BsearchBar
          placeholder="Search"
          activeOutlineColor="gray"
          left={<TextInput.Icon icon="magnify" />}
        />
        <DateDaily markedDatesArray={todayMark} isRender={isRenderDateDaily} />

        <BottomSheetFlatList
          data={data}
          keyExtractor={(i) => i}
          renderItem={BVisitationCard}
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
});
export default Beranda;
