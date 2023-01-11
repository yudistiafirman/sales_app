import { TabView } from 'react-native-tab-view';
import * as React from 'react';
import colors from '@/constants/colors';
import { ViewStyle } from 'react-native';

interface Btab {
  onIndexChange: (index: number) => void;
  navigationState: { index: number; routes: any[] };
  renderScene: (props: any & { route: any }) => React.ReactNode;
  renderTabBar?: (props: any) => React.ReactNode;
  sceneContainerStyle?: ViewStyle | undefined;
}

const defaultSceneContainerStyle: ViewStyle = {
  borderTopWidth: 1,
  borderTopColor: colors.border.tab,
};

const BTab = ({
  onIndexChange,
  navigationState,
  renderScene,
  renderTabBar,
  sceneContainerStyle,
}: Btab & typeof defaultSceneContainerStyle) => {
  return (
    <TabView
      sceneContainerStyle={sceneContainerStyle}
      navigationState={navigationState}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={onIndexChange}
      lazy
      keyboardDismissMode="none"
    />
  );
};

BTab.defaultProps = defaultSceneContainerStyle;

export default BTab;
