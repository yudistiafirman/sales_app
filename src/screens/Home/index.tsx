import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button } from 'react-native';
import colors from '@/constants/colors';
import TargetCard from './elements/TargetCard';
import scaleSize from '@/utils/scale';

import BQuickAction from '@/components/organism/BQuickActionMenu';
import { buttonDataType } from '@/interfaces/QuickActionButton.type';

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

  const buttonsData: buttonDataType[] = useMemo(
    () => [
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
    ],
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
          paddingLeft: scaleSize.moderateScale(25),
          height: scaleSize.moderateScale(100),
        }}
        buttonProps={buttonsData}
      ></BQuickAction>
      <Button title="increase" onPress={increaseVisit}></Button>
      <Button title="reset" onPress={resetVisit}></Button>
      <Button
        title="toggle loading"
        onPress={() => {
          setIsLoading((cur) => !cur);
        }}
      ></Button>
      <Button
        title="toggle expand"
        onPress={() => {
          setIsExpanded((cur) => !cur);
        }}
      ></Button>
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
