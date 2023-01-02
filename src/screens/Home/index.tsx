import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import colors from '@/constants/colors';
import TargetCard from './elements/TargetCard';
import scaleSize from '@/utils/scale';
import DateDaily from './elements/DateDaily';

import BQuickAction from '@/components/molecules/BQuickAction';
import { buttonDataType } from '@/interfaces/QuickActionButton.type';
import { BBottomSheet } from '@/components/atoms/BBottomSheet';
import BottomSheet, {
  BottomSheetFooter,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import BsearchBar from '@/components/molecules/BsearchBar';
import BVisitationCard from '@/components/molecules/BVisitationCard';
import { Searchbar } from 'react-native-paper';

const buttonsData: buttonDataType[] = [
  {
    icon: require('@/assets/icon/QuickActionIcon/ic_sph.png'),
    title: `Buat SPH`,
    action: () => {},
  },
  {
    icon: require('@/assets/icon/QuickActionIcon/ic_po.png'),
    title: `Buat PO`,
    action: () => {},
  },
  {
    icon: require('@/assets/icon/QuickActionIcon/ic_depos.png'),
    title: `Buat Deposit`,
    action: () => {},
  },
  {
    icon: require('@/assets/icon/QuickActionIcon/ic_janji.png'),
    title: `Buat Jadwal`,
    action: () => {},
  },
  {
    icon: require('@/assets/icon/QuickActionIcon/ic_temu.png'),
    title: `Buat Janji Temu`,
    action: () => {},
  },
];

const Beranda = () => {
  const [currentVisit, setCurrentVisit] = useState(5); //temporary
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // temporary
  function increaseVisit() {
    // temporary
    setCurrentVisit((current) => current + 1);
  }
  function resetVisit() {
    // temporary
    setCurrentVisit(0);
  }

  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetOnchange = (index: number) => {
    if (index == 0) {
      setIsExpanded(true);
    } else if (index == 1) {
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

  const renderFooter = useCallback(
    (props: any) => (
      <BottomSheetFooter {...props} bottomInset={24}>
        <View>
          <Text>Footer</Text>
        </View>
      </BottomSheetFooter>
    ),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <View style={style.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    []
  );

  return (
    <View style={style.container}>
      <TargetCard
        isExpanded={isExpanded}
        maxVisitation={10}
        currentVisitaion={currentVisit}
        isLoading={isLoading}
      ></TargetCard>
      <BQuickAction
        containerStyle={{
          paddingLeft: scaleSize.moderateScale(27),
          height: scaleSize.moderateScale(100),
        }}
        buttonProps={buttonsData}
      ></BQuickAction>

      <BBottomSheet
        onChange={bottomSheetOnchange}
        percentSnapPoints={['63%', '87%']}
        ref={bottomSheetRef}
        initialSnapIndex={0}
        enableContentPanningGesture={true}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ width: '100%' }}>
          <BsearchBar
            placeholder="Search"
            activeOutlineColor="gray"
          ></BsearchBar>
          {/* <Searchbar placeholder="Search" value=""></Searchbar> */}
        </View>
        {/* <DateDaily isRender={true}></DateDaily> */}

        {/* <Button title="increase" onPress={increaseVisit} />
        <Button title="reset" onPress={resetVisit} />
        <Button
          title="toggle loading"
          onPress={() => {
            setIsLoading((cur) => !cur);
          }}
        />
        <Button
          title="toggle expand"
          onPress={() => {
            setIsExpanded((cur) => !cur);
          }}
        />
        <Button
          title="test ref "
          onPress={() => {
            bottomSheetRef.current?.snapToIndex(0);
          }}
        /> */}
        {/* <BottomSheetFlatList
          data={data}
          keyExtractor={(i) => i}
          renderItem={BVisitationCard}
        /> */}
      </BBottomSheet>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: `flex-start`,
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
});
export default Beranda;
