import React, { useState, useRef, useCallback } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import colors from '@/constants/colors';
import TargetCard from './elements/TargetCard';
import scaleSize from '@/utils/scale';
import DateDaily from './elements/DateDaily';

import BQuickAction from '@/components/molecules/BQuickAction';
import { buttonDataType } from '@/interfaces/QuickActionButton.type';
import { BBottomSheet } from '@/components/atoms/BBottomSheet';
import BottomSheet, { BottomSheetFooter } from '@gorhom/bottom-sheet';
import BsearchBar from '@/components/molecules/BsearchBar';

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
        percentSnapPoints={['63%', '87%', `100%`]}
        ref={bottomSheetRef}
        initialSnapIndex={0}
      >
        <View style={style.contentContainer}>
          <View style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
            <BsearchBar activeOutlineColor="gray"></BsearchBar>
          </View>
          <DateDaily isRender={true}></DateDaily>
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
        </View>
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
  },
});
export default Beranda;
