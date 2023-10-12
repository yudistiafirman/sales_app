import { ICustomerListData } from "@/models/Customer";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors, layout } from "@/constants";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome5";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import {
    COMPANY,
    DEFAULT_ESTIMATED_LIST_SIZE,
    DEFAULT_ON_END_REACHED_THREHOLD,
    INDIVIDU,
    PERUSAHAAN
} from "@/constants/general";
import { FlatList } from "react-native-gesture-handler";
import BShimmerAvatarList from "./BShimmerAvatarList";
import BEmptyState from "../organism/BEmptyState";
import BCard from "../molecules/BCard";
import BTabSections from "../organism/TabSections";
import BSpacer from "../atoms/BSpacer";
import BSearchBar from "../molecules/BSearchBar";

const styles = StyleSheet.create({
    container: {
        marginHorizontal: layout.pad.lg
    },
    tabIndicator: {
        backgroundColor: colors.primary
        // marginLeft: layout.pad.lg - layout.pad.sm
    },
    tabStyle: {
        // width: "auto",
        flex: 1
        // paddingRight: layout.pad.md
    },
    tabBarStyle: {
        backgroundColor: colors.white
        // paddingHorizontal: layout.pad.ml
    }
});

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

interface IBList {
    data?: ICustomerListData[];
    onEndReached?:
        | ((info: { distanceFromEnd: number }) => void)
        | null
        | undefined;
    refreshing?: boolean;
    emptyPOName?: string;
    isLoadMore?: boolean;
    loadList?: boolean;
    onRefresh?: () => void;
    onPressCard?: (data: any) => void;
    onChangeText: (text: string) => void;
    onClearValue?: () => void;
    onPressMagnify?: () => void;
    searchQuery?: string;
    onTabPress?: (tabroutes: any) => any;
    onIndexChange: (index: number) => void;
    itemIndex: number;
    routes: any[];
    errorMessage?: any;
    isError?: boolean;
    placeholder?: string;
    onRetry?: () => void;
    emptyText?: string;
    searchBarOutlineStyle?: ViewStyle;
    searchBarInputStyle?: ViewStyle;
    searchBarBgColor?: string;
    tabStyle?: ViewStyle;
    tabBarStyle?: ViewStyle;
    tabTextFocusedColor?: string;
    tabIndicatorStyle?: ViewStyle;
    isLoadingSearchBar?: boolean;
}

function BList({
    data,
    onEndReached,
    refreshing,
    emptyPOName,
    isLoadMore,
    loadList,
    onRefresh,
    onPressCard,
    onChangeText,
    onClearValue,
    onPressMagnify,
    searchQuery,
    onTabPress,
    onIndexChange,
    itemIndex,
    routes,
    errorMessage,
    isError,
    placeholder,
    onRetry,
    emptyText,
    searchBarOutlineStyle,
    searchBarBgColor,
    searchBarInputStyle,
    tabStyle,
    tabBarStyle,
    tabTextFocusedColor = colors.blueSail,
    tabIndicatorStyle,
    isLoadingSearchBar
}: IBList) {
    const renderItem: ListRenderItem<ICustomerListData> = React.useCallback(
        ({ item, index }) => {
            const avatarText = item?.name[0];
            const title = item?.displayName;
            const chipTitle = item?.type === COMPANY ? PERUSAHAAN : item?.type;
            const paymentType = () => {
                let defaultText = "-";
                if (item?.paymentType !== undefined) {
                    if (
                        item?.paymentType === "CBD" ||
                        item?.paymentType === null
                    ) {
                        defaultText = "Cash";
                    } else {
                        defaultText = "Credit";
                    }
                }
                return defaultText;
            };
            const listTextData = [`Payment Type: ${paymentType()}`];
            const availableDebit = item?.pendingBalance;
            const availableCredit = item?.creditPendingBalance;
            const chipBgColor =
                item?.type === INDIVIDU
                    ? colors.status.lightYellow
                    : colors.status.lightBlue;
            const onPressCardCheck = onPressCard || null;
            return (
                <BCard
                    avatarText={avatarText?.toUpperCase()}
                    title={title}
                    chipStartIcon={
                        <Icon
                            name={item?.type === COMPANY ? "building" : "user"}
                            style={{
                                fontWeight: "600",
                                marginRight: layout.pad.sm,
                                color: colors.text.darker
                            }}
                            size={layout.pad.md}
                        />
                    }
                    cardBgColor={index % 2 ? colors.veryLightShadeGray : ""}
                    onPressCard={() =>
                        onPressCardCheck !== null && onPressCardCheck(item)
                    }
                    searchQuery={searchQuery}
                    chipTitle={chipTitle}
                    availableDebit={availableDebit}
                    availableCredit={availableCredit}
                    listTextData={listTextData}
                    chipBgColor={chipBgColor}
                />
            );
        },
        []
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                {isLoadingSearchBar ? (
                    <ShimmerPlaceholder
                        style={{
                            marginHorizontal: layout.pad.lg,
                            height: layout.pad.xl,
                            width: "92%"
                        }}
                    />
                ) : (
                    <BSearchBar
                        outlineStyle={searchBarOutlineStyle}
                        placeholder={placeholder}
                        value={searchQuery}
                        onChangeText={onChangeText}
                        bgColor={searchBarBgColor}
                        textInputStyle={searchBarInputStyle}
                        left={
                            <TextInput.Icon
                                style={{ marginBottom: 24 }}
                                size={layout.pad.xl}
                                disabled
                                icon="magnify"
                            />
                        }
                        right={
                            searchQuery &&
                            searchQuery?.length > 2 && (
                                <TextInput.Icon
                                    style={{ marginBottom: 24 }}
                                    onPress={onClearValue}
                                    size={layout.pad.lg}
                                    icon="close-circle"
                                />
                            )
                        }
                    />
                )}
            </View>

            <BSpacer size="extraSmall" />
            {routes && routes?.length > 0 && (
                <BTabSections
                    swipeEnabled={false}
                    navigationState={{ index: itemIndex, routes }}
                    renderScene={() => (
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            onEndReachedThreshold={
                                DEFAULT_ON_END_REACHED_THREHOLD
                            }
                            refreshing={refreshing}
                            contentContainerStyle={{
                                paddingTop: layout.pad.lg
                            }}
                            onRefresh={onRefresh}
                            keyExtractor={(item, index) => index?.toString()}
                            onEndReached={onEndReached}
                            ListFooterComponent={
                                isLoadMore ? <BShimmerAvatarList /> : null
                            }
                            ListEmptyComponent={
                                loadList ? (
                                    <BShimmerAvatarList />
                                ) : (
                                    <BEmptyState
                                        errorMessage={errorMessage}
                                        isError={isError}
                                        onAction={onRetry}
                                        emptyText={emptyText}
                                    />
                                )
                            }
                        />
                    )}
                    onTabPress={onTabPress}
                    onIndexChange={onIndexChange}
                    tabStyle={[styles.tabStyle, { ...tabStyle }]}
                    tabBarStyle={[styles.tabBarStyle, { ...tabBarStyle }]}
                    // tabTextFocusedColor={tabTextFocusedColor}
                    indicatorStyle={[
                        styles.tabIndicator,
                        { ...tabIndicatorStyle }
                    ]}
                />
            )}
        </View>
    );
}

export default BList;
