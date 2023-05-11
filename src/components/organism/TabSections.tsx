import BTab from '@/components/molecules/BTab';
import { ViewStyle } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import * as React from 'react';
import colors from '@/constants/colors';
import BTabLabels from '@/components/molecules/BTabLabels';
import { Scene, Route } from 'react-native-tab-view/lib/typescript/src/types';

interface BTabSectionProps {
  onIndexChange: (index: number) => void;
  navigationState: { index: number; routes: any[] };
  renderScene: (props: any & { route: any }) => React.ReactNode;
  tabStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
  tabBarStyle?: ViewStyle;
  onTabPress?: ((scene: Scene<Route> & Event) => void) | undefined;
  swipeEnabled?: boolean;
  minTabHeaderWidth?: number | undefined;
  tabTextFocusedColor?: string;
}

const BTabSections = ({
  onIndexChange,
  navigationState,
  renderScene,
  tabStyle,
  indicatorStyle,
  tabBarStyle,
  onTabPress,
  swipeEnabled,
  minTabHeaderWidth,
  tabTextFocusedColor,
}: BTabSectionProps) => {
  return (
    <BTab
      onIndexChange={onIndexChange}
      navigationState={navigationState}
      renderScene={renderScene}
      swipeEnabled={swipeEnabled}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          onTabPress={onTabPress}
          indicatorStyle={indicatorStyle}
          tabStyle={tabStyle}
          style={[tabBarStyle, { backgroundColor: colors.white }]}
          renderLabel={({ route, focused }) => (
            <BTabLabels
              route={route}
              tabTextfocusedColor={tabTextFocusedColor}
              focused={focused}
              minWidth={minTabHeaderWidth}
            />
          )}
          scrollEnabled={true}
        />
      )}
    />
  );
};

export default BTabSections;
