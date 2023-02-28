import { BSpinner, BTabSections } from '@/components';
import { colors, layout } from '@/constants';
import useCustomHeaderCenter from '@/hooks/useCustomHeaderCenter';
import visitHistoryMachine from '@/machine/visitHistoryMachine';
import { RootStackParamList } from '@/navigation/CustomStateComponent';
import { resScale } from '@/utils';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useMachine } from '@xstate/react';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import HistoryDetails from './elements/HistoryDetails';
import HistoryHeader from './elements/HistoryHeader';
import LocationText from './elements/LocationText';

type VisitHistoryRoute = RouteProp<RootStackParamList, 'VISIT_HISTORY'>;

const VisitHistory = () => {
  const route = useRoute<VisitHistoryRoute>();
  const { projectName } = route.params;
  const [state, send] = useMachine(visitHistoryMachine);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (route.params) {
      const { projectId } = route.params;
      send('assignParams', { value: projectId });
    }
  }, [route.params, send]);

  useCustomHeaderCenter({
    customHeaderCenter: <HistoryHeader projectName={projectName} />,
  });

  const onTabPress = (tabroute: any) => {
    const tabIndex = state.context.routes.findIndex(
      (v) => v.key === tabroute.route.key
    );
    send('onChangeVisitationIdx', { value: tabIndex });
  };

  const { selectedVisitationByIdx, loading, routes } = state.context;

  const renderVisitHistory = useCallback(() => {
    return (
      <HistoryDetails
        details={selectedVisitationByIdx && selectedVisitationByIdx}
      />
    );
  }, [selectedVisitationByIdx]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <BSpinner size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LocationText
        locationAddress={
          selectedVisitationByIdx?.project?.locationAddress?.line1
        }
      />
      <BTabSections
        swipeEnabled={false}
        navigationState={{ index, routes }}
        renderScene={() => (
          <FlatList
            data={null}
            renderItem={null}
            ListHeaderComponent={renderVisitHistory}
          />
        )}
        onTabPress={onTabPress}
        onIndexChange={setIndex}
        tabStyle={styles.tabStyle}
        tabBarStyle={styles.tabBarStyle}
        indicatorStyle={styles.tabIndicator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIndicator: {
    backgroundColor: colors.primary,
    marginLeft: resScale(15.5),
  },
  tabStyle: {
    width: 'auto',
    paddingHorizontal: layout.pad.lg,
  },
  tabBarStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: layout.pad.lg,
  },
});

export default VisitHistory;
