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
import { setSelectedBatchingPlant } from "@/redux/reducers/authReducer";
import { BatchingPlant } from "@/models/BatchingPlant";
import CustomTabBar from "../CustomTabBar";

const Tab = createBottomTabNavigator();

const selectedBPOption = (
    title: string,
    selectedBP: BatchingPlant,
    batchingPlants: BatchingPlant[],
    onSelectBPOption: (item: BatchingPlant) => void
) => (
    <BSelectedBPOptionMenu
        pageTitle={title}
        selectedBatchingPlant={selectedBP}
        batchingPlants={batchingPlants}
        color={colors.text.darker}
        onPressOption={onSelectBPOption}
    />
);

function SecurityTabs() {
    const authState = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const tabBarRender = (props: any) => <CustomTabBar {...props} />;

    const selectBPOption = (item: BatchingPlant) =>
        dispatch(setSelectedBatchingPlant(item));

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
                            SECURITY_TAB_TITLE,
                            authState.selectedBatchingPlant,
                            authState.batchingPlants,
                            selectBPOption
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
                            SECURITY_TAB_TITLE,
                            authState.selectedBatchingPlant,
                            authState.batchingPlants,
                            selectBPOption
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
