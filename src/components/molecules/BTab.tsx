import { TabView } from 'react-native-tab-view';
import * as React from 'react';

interface Btab {
    onIndexChange: (index: number) => void,
    navigationState:{index:number,routes: any[]};
    renderScene: (props: any & { route: any }) => React.ReactNode,
    renderTabBar?: (props: any) => React.ReactNode

}

const BTab = ({onIndexChange,navigationState,renderScene,renderTabBar}:Btab)  =>   {
  return (
    <TabView
    navigationState={navigationState}
    renderScene={renderScene}
    renderTabBar={renderTabBar}
    onIndexChange={onIndexChange}
  />
  )
}

export default BTab