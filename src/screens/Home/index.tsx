import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button } from 'react-native';
import colors from '@/constants/colors';
import TargetCard from './elements/TargetCard';

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

  return (
    <View style={style.container}>
      <TargetCard
        isExpanded={isExpanded}
        maxVisitation={10}
        currentVisitaion={currentVisit}
        isLoading={isLoading}
      ></TargetCard>
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
