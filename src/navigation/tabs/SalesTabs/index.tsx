import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PriceList from "@/screens/Price";
import Profile from "@/screens/Profile";
import Home from "@/screens/Home";
import { colors, fonts } from "@/constants";
import Transaction from "@/screens/Transaction";
import {
    LIST_CUSTOMER_TITLE,
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
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import SalesHeaderRight from "@/navigation/Sales/HeaderRight";
import Customer from "@/screens/Customer";
import { BSelectedBPBadges, BSelectedBPOptionMenu } from "@/components";
import { BatchingPlant } from "@/models/BatchingPlant";
import { setSelectedBatchingPlant } from "@/redux/reducers/authReducer";
import CustomTabBar from "../CustomTabBar";

const Tab = createBottomTabNavigator();

const selectedBPBadges = (selectedBP: BatchingPlant, title: string) => (
    <BSelectedBPBadges
        selectedBP={selectedBP}
        title={title}
        alignLeft={false}
    />
);

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
        color={colors.white}
        onPressOption={onSelectBPOption}
    />
);

function SalesTabs() {
    const { remoteConfigData, batchingPlants, selectedBatchingPlant } =
        useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    /* eslint-disable @typescript-eslint/naming-convention */
    const {
        enable_transaction_menu,
        enable_price_menu,
        enable_profile_menu,
        enable_customer_menu
    } = remoteConfigData;
    /* eslint-enable @typescript-eslint/naming-convention */
    const tabBarRender = (props: any) => <CustomTabBar {...props} />;
    const selectBPOption = (item: BatchingPlant) =>
        dispatch(setSelectedBatchingPlant(item));
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
                    headerStyle: {
                        backgroundColor: colors.primary
                    },
                    headerTitle: () =>
                        selectedBPOption(
                            TAB_HOME_TITLE,
                            selectedBatchingPlant,
                            batchingPlants,
                            selectBPOption
                        ),
                    headerRight: () => SalesHeaderRight()
                }}
                component={Home}
            />
            {enable_transaction_menu && (
                <Tab.Screen
                    key={TAB_TRANSACTION}
                    name={TAB_TRANSACTION_TITLE}
                    options={{
                        headerTitle: () =>
                            selectedBPBadges(
                                selectedBatchingPlant,
                                TAB_TRANSACTION_TITLE
                            )
                    }}
                    component={Transaction}
                />
            )}
            {enable_profile_menu && (
                <Tab.Screen
                    key={TAB_PROFILE}
                    name={TAB_PROFILE_TITLE}
                    options={{
                        headerTitle: () =>
                            selectedBPBadges(
                                selectedBatchingPlant,
                                TAB_PROFILE_TITLE
                            )
                    }}
                    component={Profile}
                />
            )}

            {enable_price_menu && (
                <Tab.Screen
                    key={TAB_PRICE_LIST}
                    name={TAB_PRICE_LIST_TITLE}
                    options={{
                        headerTitle: () =>
                            selectedBPBadges(
                                selectedBatchingPlant,
                                TAB_PRICE_LIST_TITLE
                            )
                    }}
                    component={PriceList}
                />
            )}
            {enable_customer_menu && (
                <Tab.Screen
                    key={TAB_CUSTOMER}
                    name={TAB_CUSTOMER_TITLE}
                    options={{
                        headerTitle: LIST_CUSTOMER_TITLE,
                        headerRight: () => SalesHeaderRight(colors.text.darker)
                    }}
                    component={Customer}
                />
            )}
        </Tab.Navigator>
    );
}

export default SalesTabs;
