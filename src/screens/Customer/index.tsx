import { colors, layout } from "@/constants";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { resScale } from "@/utils";
import BList from "@/components/templates/BList";
import { useMachine } from "@xstate/react";
import customerListMachine from "@/machine/customerListMachine";
import { CUSTOMER_DETAIL_V2, TAB_CUSTOMER } from "@/navigation/ScreenNames";
import crashlytics from "@react-native-firebase/crashlytics";
import { useDispatch } from "react-redux";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";

const styles = StyleSheet.create({
    container: {
        marginHorizontal: layout.pad.lg
    },
    outlineSearchBar: {
        borderWidth: 0,
        borderRadius: layout.radius.md
    }
});

function Customer() {
    const [state, send] = useMachine(customerListMachine);
    const navigation = useNavigation();
    const [searchValue, setSearchValue] = React.useState("");
    const [index, setIndex] = React.useState(0);
    const dispatch = useDispatch();

    const {
        data,
        refreshing,
        routes,
        isLoading,
        errorMessage,
        isLoadDataCount
    } = state.context;

    React.useEffect(() => {
        crashlytics().log(TAB_CUSTOMER);
        send("fetchData");
    }, []);

    React.useEffect(() => {
        if (state.matches("errorGettingCountData")) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        errorMessage || "Gagal Mendapatkan Data List Pelanggan",
                    outsideClickClosePopUp: false,
                    primaryBtnTitle: "Coba Lagi",
                    outlineBtnTitle: "Kembali",
                    isRenderActions: true,
                    primaryBtnAction: () => {
                        dispatch(closePopUp());
                        send("retryGettingCountData");
                    },
                    outlineBtnAction: () => {
                        dispatch(closePopUp());
                        navigation.goBack();
                    }
                })
            );
        }
    }, [state, send]);

    const goToCustomerDetail = (item: ICustomerListData) => {
        navigation.navigate(CUSTOMER_DETAIL_V2, { id: item.id });
    };

    const onTabPress = (event: any) => {
        setSearchValue("");
        send("onChangeTab", { value: event.route.key });
    };

    const onSearchCustomer = (e) => {
        setSearchValue(e);
        if (e.length > 2) {
            send("searching", { value: e });
        }
    };

    const onClearValue = () => {
        setSearchValue("");
        send("searching", { value: "" });
    };

    return (
        <View style={{ flex: 1 }}>
            <BList
                searchBarOutlineStyle={styles.outlineSearchBar}
                placeholder="Cari Pelanggan"
                onChangeText={onSearchCustomer}
                searchBarBgColor={colors.lightCyanBlue}
                searchBarInputStyle={{ minHeight: resScale(42) }}
                data={data}
                onClearValue={onClearValue}
                index={index}
                isError={state.matches("errorGettingData")}
                routes={routes}
                onRetry={() => send("retry")}
                errorMessage={errorMessage}
                onIndexChange={setIndex}
                refreshing={refreshing}
                isLoadingSearchBar={isLoadDataCount}
                loadList={isLoading}
                onPressCard={goToCustomerDetail}
                searchQuery={searchValue}
                onEndReached={() => send("onEndReached")}
                onRefresh={() => send("onRefresh")}
                onTabPress={onTabPress}
            />
        </View>
    );
}

export default Customer;
