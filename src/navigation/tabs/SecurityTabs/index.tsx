import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { AppDispatch, RootState } from "@/redux/store";
import Dispatch from "@/screens/Operation/Dispatch";
import Return from "@/screens/Operation/Return";
import { BSelectedBPOptionMenu } from "@/components";
import { setSelectedBP } from "@/redux/reducers/authReducer";
import CustomTabBar from "../CustomTabBar";

const Tab = createBottomTabNavigator();

const selectedBPOption = (
    bpName: string,
    title: string,
    onSelectBPOption1: () => void,
    onSelectBPOption2: () => void
) => (
    <BSelectedBPOptionMenu
        pageTitle={title}
        selectedBP={bpName}
        color={colors.text.darker}
        onPressOption1={onSelectBPOption1}
        onPressOption2={onSelectBPOption2}
    />
);

function SecurityTabs() {
    const authState = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const tabBarRender = (props: any) => <CustomTabBar {...props} />;

    const selectBPOption1 = () => dispatch(setSelectedBP("BP-Legok"));
    const selectBPOption2 = () => dispatch(setSelectedBP("BP-Balaraja"));

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
                    headerTitle: () =>
                        selectedBPOption(
                            authState.selectedBP,
                            SECURITY_TAB_TITLE,
                            selectBPOption1,
                            selectBPOption2
                        ),
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
                    headerTitle: () =>
                        selectedBPOption(
                            authState.selectedBP,
                            SECURITY_TAB_TITLE,
                            selectBPOption1,
                            selectBPOption2
                        ),
                    headerRight: () => SalesHeaderRight(colors.text.darker),
                    headerShown: true
                }}
                component={Return}
            />
        </Tab.Navigator>
    );
}

export default SecurityTabs;
