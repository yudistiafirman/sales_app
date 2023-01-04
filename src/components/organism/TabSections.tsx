import BTab from '@/components/molecules/BTab';
import { ViewStyle } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import * as React from 'react';
import colors from '@/constants/colors';
import BTabLabels from '@/components/molecules/BTabLabels';
interface BTabSectionProps {
  onIndexChange: (index: number) => void;
  navigationState: { index: number; routes: any[] };
  renderScene: (props: any & { route: any }) => React.ReactNode;
  tabStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
}

const BTabSections = ({
  onIndexChange,
  navigationState,
  renderScene,
  tabStyle,
  indicatorStyle,
}: BTabSectionProps) => {
  return (
    <BTab
      onIndexChange={onIndexChange}
      navigationState={navigationState}
      renderScene={renderScene}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={indicatorStyle}
          tabStyle={tabStyle}
          style={{ backgroundColor: colors.white }}
          renderLabel={BTabLabels}
        />
      )}
    />
  );
};

export default BTabSections;
