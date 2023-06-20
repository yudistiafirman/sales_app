import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { useSelector } from "react-redux";
import { colors } from "@/constants";
import EntryType from "@/models/EnumModel";
import SalesHeaderRight from "@/navigation/Sales/HeaderRight";
import {
    SECURITY_TAB_TITLE,
    TAB_DISPATCH,
    TAB_DISPATCH_TITLE,
    TAB_RETURN,
    TAB_RETURN_TITLE,
    TAB_WB_IN,
    TAB_WB_IN_TITLE,
    TAB_WB_OUT,
    TAB_WB_OUT_TITLE
} from "@/navigation/ScreenNames";
import { RootState } from "@/redux/store";
import Dispatch from "@/screens/Operation/Dispatch";
import Return from "@/screens/Operation/Return";
import CustomTabBar from "../CustomTabBar";

const Tab = createBottomTabNavigator();

function SecurityTabs() {
    const authState = useSelector((state: RootState) => state.auth);
    const tabBarRender = (props: any) => <CustomTabBar {...props} />;

    return (
        <Tab.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                tabBarHideOnKeyboard: true,
                headerShown: false
            }}
            tabBar={tabBarRender}
        >
            <Tab.Screen
                key={
                    authState.userData?.type === EntryType.SECURITY
                        ? TAB_DISPATCH
                        : TAB_WB_OUT
                }
                name={
                    authState.userData?.type === EntryType.SECURITY
                        ? TAB_DISPATCH_TITLE
                        : TAB_WB_OUT_TITLE
                }
                options={{
                    headerTitle: SECURITY_TAB_TITLE,
                    headerRight: () => SalesHeaderRight(colors.text.darker),
                    headerShown: true
                }}
                component={Dispatch}
            />
            <Tab.Screen
                key={
                    authState.userData?.type === EntryType.SECURITY
                        ? TAB_RETURN
                        : TAB_WB_IN
                }
                name={
                    authState.userData?.type === EntryType.SECURITY
                        ? TAB_RETURN_TITLE
                        : TAB_WB_IN_TITLE
                }
                options={{
                    headerTitle: SECURITY_TAB_TITLE,
                    headerRight: () => SalesHeaderRight(colors.text.darker),
                    headerShown: true
                }}
                component={Return}
            />
        </Tab.Navigator>
    );
}

export default SecurityTabs;
