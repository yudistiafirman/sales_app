import { TabView } from "react-native-tab-view";
import * as React from "react";
import { Text, View, ViewStyle } from "react-native";
import colors from "@/constants/colors";

interface Btab {
  onIndexChange: (index: number) => void;
  navigationState: { index: number; routes: any[] };
  renderScene: (props: any & { route: any }) => React.ReactNode;
  renderTabBar?: (props: any) => React.ReactNode;
  sceneContainerStyle?: ViewStyle | undefined;
  swipeEnabled?: boolean;
}

const defaultSceneContainerStyle: ViewStyle = {
  borderTopWidth: 1,
  borderTopColor: colors.border.tab,
};

function BTab({
  onIndexChange,
  navigationState,
  renderScene,
  renderTabBar,
  sceneContainerStyle,
  swipeEnabled,
}: Btab & typeof defaultSceneContainerStyle) {
  return (
    <TabView
      swipeEnabled={swipeEnabled}
      sceneContainerStyle={sceneContainerStyle}
      navigationState={navigationState}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      lazy
      onIndexChange={onIndexChange}
      keyboardDismissMode="none"
    />
  );
}

BTab.defaultProps = defaultSceneContainerStyle;

export default BTab;
