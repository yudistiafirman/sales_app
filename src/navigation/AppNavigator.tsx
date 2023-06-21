import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { useDispatch } from "react-redux";
import { BHttpLogger, BSelectedBPOptionMenu } from "@/components";
import { colors, fonts } from "@/constants";
import { useAsyncConfigSetup } from "@/hooks";
import EntryType from "@/models/EnumModel";
import UserModel from "@/models/User";
import {
    setSelectedBatchingPlant,
    setShowButtonNetwork,
    setVisibleNetworkLogger
} from "@/redux/reducers/authReducer";
import { AppDispatch } from "@/redux/store";
import BlankScreen from "@/screens/BlankScreen";
import HunterAndFarmers from "@/screens/HunterAndFarmers";
import Login from "@/screens/Login";
import Operation from "@/screens/Operation";
import Splash from "@/screens/Splash";
import Verification from "@/screens/Verification";
import { BatchingPlant } from "@/models/BatchingPlant";
import SecurityTabs from "./tabs/SecurityTabs";
import SalesTabs from "./tabs/SalesTabs";
import {
    LOGIN,
    LOGIN_TITLE,
    OPSMANAGER,
    OPSMANAGER_TITLE,
    TAB_ROOT,
    VERIFICATION,
    VERIFICATION_TITLE,
    BATCHER,
    DRIVER,
    BATCHER_TITLE,
    DRIVER_TITLE,
    BLANK_SCREEN
} from "./ScreenNames";
import SalesStack from "./Sales/Stack";
import SalesHeaderRight from "./Sales/HeaderRight";
import OperationStack from "./Operation/Stack";

const Stack = createNativeStackNavigator();

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

function RootScreen(
    userData: UserModel.DataSuccessLogin | null,
    isSignout: boolean,
    selectedBatchingPlant: BatchingPlant,
    batchingPlants: BatchingPlant[],
    onSelectBPOption: (item: BatchingPlant) => void
) {
    if (userData !== null) {
        const { type, roles } = userData;
        const mappingRoles: string[] = [];
        roles.forEach((item) => {
            mappingRoles.push(item.toLowerCase());
        });
        switch (type.toLowerCase()) {
            case EntryType.OPSMANAGER.toLowerCase() ||
                mappingRoles.includes(EntryType.OPSMANAGER.toLowerCase()):
                return (
                    <>
                        <Stack.Screen
                            name={OPSMANAGER}
                            key={OPSMANAGER}
                            component={Operation}
                            options={{
                                headerTitleAlign: "center",
                                headerTitle: OPSMANAGER_TITLE,
                                headerRight: () =>
                                    SalesHeaderRight(colors.text.darker),
                                headerShown: true
                            }}
                        />
                        {OperationStack(selectedBatchingPlant, Stack)}
                    </>
                );
            case EntryType.BATCHER.toLowerCase() ||
                mappingRoles.includes(EntryType.BATCHER.toLowerCase()):
                return (
                    <>
                        <Stack.Screen
                            name={BATCHER}
                            key={BATCHER}
                            component={Operation}
                            options={{
                                headerTitleAlign: "center",
                                headerTitle: BATCHER_TITLE,
                                headerRight: () =>
                                    SalesHeaderRight(colors.text.darker),
                                headerShown: true
                            }}
                        />
                        {OperationStack(selectedBatchingPlant, Stack)}
                    </>
                );
            case EntryType.DRIVER.toLowerCase() ||
                mappingRoles.includes(EntryType.DRIVER.toLowerCase()):
                return (
                    <>
                        <Stack.Screen
                            name={DRIVER}
                            key={DRIVER}
                            component={Operation}
                            options={{
                                headerTitleAlign: "center",
                                headerTitle: () =>
                                    selectedBPOption(
                                        DRIVER_TITLE,
                                        selectedBatchingPlant,
                                        batchingPlants,
                                        onSelectBPOption
                                    ),
                                headerRight: () =>
                                    SalesHeaderRight(colors.text.darker),
                                headerShown: true
                            }}
                        />
                        {OperationStack(selectedBatchingPlant, Stack)}
                    </>
                );
            case EntryType.SECURITY.toLowerCase() ||
                mappingRoles.includes(EntryType.SECURITY.toLowerCase()):
                return (
                    <>
                        <Stack.Screen
                            name={TAB_ROOT}
                            key={TAB_ROOT}
                            component={SecurityTabs}
                            options={{
                                headerShown: false
                            }}
                        />
                        {OperationStack(selectedBatchingPlant, Stack)}
                    </>
                );
            case EntryType.WB.toLowerCase() ||
                mappingRoles.includes(EntryType.WB.toLowerCase()):
                return (
                    <>
                        <Stack.Screen
                            name={TAB_ROOT}
                            key={TAB_ROOT}
                            component={SecurityTabs}
                            options={{
                                headerShown: false
                            }}
                        />
                        {OperationStack(selectedBatchingPlant, Stack)}
                    </>
                );
            case EntryType.SALES.toLowerCase() ||
                mappingRoles.includes(EntryType.SALES.toLowerCase()):
                return (
                    <>
                        <Stack.Screen
                            name={TAB_ROOT}
                            key={TAB_ROOT}
                            component={SalesTabs}
                            options={{
                                headerShown: false
                            }}
                        />
                        {SalesStack(selectedBatchingPlant, Stack)}
                    </>
                );
            case EntryType.ADMIN.toLowerCase() ||
                mappingRoles.includes(EntryType.ADMIN.toLowerCase()):
                return (
                    <>
                        <Stack.Screen
                            name={TAB_ROOT}
                            key={TAB_ROOT}
                            component={SalesTabs}
                            options={{
                                headerShown: false
                            }}
                        />
                        {SalesStack(selectedBatchingPlant, Stack)}
                    </>
                );
            default:
                return (
                    <Stack.Screen
                        name={BLANK_SCREEN}
                        key={BLANK_SCREEN}
                        component={BlankScreen}
                        options={{
                            headerTitle: ""
                        }}
                    />
                );
        }
    } else {
        return (
            <>
                <Stack.Screen
                    name={LOGIN}
                    key={LOGIN}
                    component={Login}
                    options={{
                        headerTitleAlign: "center",
                        headerTitle: LOGIN_TITLE,
                        animationTypeForReplace: isSignout ? "pop" : "push"
                    }}
                />
                <Stack.Screen
                    name={VERIFICATION}
                    key={VERIFICATION}
                    component={Verification}
                    options={{
                        headerTitle: VERIFICATION_TITLE,
                        headerTitleAlign: "center",
                        headerTitleStyle: {
                            fontFamily: fonts.family.montserrat[600],
                            fontSize: fonts.size.lg,
                            color: colors.text.inactive
                        }
                    }}
                />
            </>
        );
    }
}

function AppNavigator() {
    const {
        isLoading,
        userData,
        isSignout,
        isNetworkLoggerVisible,
        isShowButtonNetwork,
        selectedBatchingPlant,
        batchingPlants
    } = useAsyncConfigSetup();
    const dispatch = useDispatch<AppDispatch>();
    if (isLoading) {
        return <Splash />;
    }
    return (
        <>
            <HunterAndFarmers />
            <Stack.Navigator
                screenOptions={{
                    headerTitleAlign: "left",
                    headerShadowVisible: false,
                    headerShown: true,
                    headerTitleStyle: {
                        color: colors.text.darker,
                        fontSize: fonts.size.lg,
                        fontFamily: fonts.family.montserrat[600]
                    }
                }}
            >
                {RootScreen(
                    userData,
                    isSignout,
                    selectedBatchingPlant,
                    batchingPlants,
                    (item) => dispatch(setSelectedBatchingPlant(item))
                )}
            </Stack.Navigator>
            <BHttpLogger
                isShowButtonNetwork={isShowButtonNetwork}
                isNetworkLoggerVisible={isNetworkLoggerVisible}
                setShowButtonNetwork={() =>
                    dispatch(setShowButtonNetwork(!isShowButtonNetwork))
                }
                setVisibleNetworkLogger={() =>
                    dispatch(setVisibleNetworkLogger(!isNetworkLoggerVisible))
                }
            />
        </>
    );
}

export default AppNavigator;
