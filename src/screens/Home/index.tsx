import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button } from 'react-native';
import colors from '@/constants/colors';
import TargetCard from '../elements/TargetCard';

const Beranda = () => {
  const [currentVisit, setCurrentVisit] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  function increaseVisit() {
    setCurrentVisit((current) => current + 1);
  }
  function resetVisit() {
    setCurrentVisit(0);
  }

  return (
    <View style={style.container}>
      <TargetCard
        isExpanded={isExpanded}
        maxVisitation={10}
        currentVisitaion={currentVisit}
      ></TargetCard>
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
