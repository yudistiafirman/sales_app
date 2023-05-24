import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PriceList from "@/screens/Price";
import Profile from "@/screens/Customer";
import Home from "@/screens/Home";
import { colors, fonts } from "@/constants";
import Transaction from "@/screens/Transaction";
import {
    LIST_CUSTOMER,
    TAB_CUSTOMER,
    TAB_CUSTOMER_TITLE,
    TAB_HOME,
    TAB_HOME_TITLE,
    TAB_PRICE_LIST,
    TAB_PRICE_LIST_TITLE,
    TAB_PROFILE,
    TAB_PROFILE_TITLE,
    TAB_TRANSACTION,
    TAB_TRANSACTION_TITLE
} from "@/navigation/ScreenNames";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import SalesHeaderRight from "@/navigation/Sales/HeaderRight";
import Customer from "@/screens/Customer";
import CustomTabBar from "../CustomTabBar";

const Tab = createBottomTabNavigator();

function SalesTabs() {
    /* eslint-disable @typescript-eslint/naming-convention */
    const {
        enable_transaction_menu,
        enable_price_menu,
        enable_profile_menu,
        enable_customer_menu
    } = useSelector((state: RootState) => state.auth.remoteConfigData);
    /* eslint-enable @typescript-eslint/naming-convention */

    const tabBarRender = (props: any) => {
        return <CustomTabBar {...props} />;
    };

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                tabBarHideOnKeyboard: true,
                headerTitleAlign: "center",
                headerShadowVisible: false,
                headerTitleStyle: {
                    color: colors.text.darker,
                    fontSize: fonts.size.lg,
                    fontFamily: fonts.family.montserrat[600]
                }
            }}
            tabBar={tabBarRender}
        >
            <Tab.Screen
                key={TAB_HOME}
                name={TAB_HOME_TITLE}
                options={{
                    headerTitle: TAB_HOME_TITLE,
                    headerRight: () => SalesHeaderRight()
                }}
                component={Home}
            />
            {enable_transaction_menu && (
                <Tab.Screen
                    key={TAB_TRANSACTION}
                    name={TAB_TRANSACTION_TITLE}
                    options={{ headerTitle: TAB_TRANSACTION_TITLE }}
                    component={Transaction}
                />
            )}
            {enable_profile_menu && (
                <Tab.Screen
                    key={TAB_PROFILE}
                    name={TAB_PROFILE_TITLE}
                    options={{ headerTitle: TAB_PROFILE_TITLE }}
                    component={Profile}
                />
            )}

            {enable_price_menu && (
                <Tab.Screen
                    key={TAB_PRICE_LIST}
                    name={TAB_PRICE_LIST_TITLE}
                    options={{ headerTitle: TAB_PRICE_LIST_TITLE }}
                    component={PriceList}
                />
            )}
            {enable_customer_menu && (
                <Tab.Screen
                    key={TAB_CUSTOMER}
                    name={TAB_CUSTOMER_TITLE}
                    options={{
                        headerTitle: LIST_CUSTOMER,
                        headerRight: () => SalesHeaderRight(colors.text.darker)
                    }}
                    component={Customer}
                />
            )}
        </Tab.Navigator>
    );
}

export default SalesTabs;
