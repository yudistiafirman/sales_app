import * as React from "react";
import { AppState, DeviceEventEmitter, SafeAreaView, View } from "react-native";
import BTabSections from "@/components/organism/TabSections";
import {
    useFocusEffect,
    useNavigation,
    useRoute
} from "@react-navigation/native";
import Tnc from "@/screens/Price/element/Tnc";
import ProductList from "@/components/templates/Price/ProductList";
import { BEmptyState, BSpacer, BTouchableText } from "@/components";
import { useMachine } from "@xstate/react";
import { priceMachine } from "@/machine/priceMachine";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import { layout } from "@/constants";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import {
    CREATE_VISITATION,
    LOCATION,
    SEARCH_PRODUCT,
    TAB_PRICE_LIST,
    TAB_PRICE_LIST_TITLE
} from "@/navigation/ScreenNames";
import crashlytics from "@react-native-firebase/crashlytics";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import PriceSearchBar from "./element/PriceSearchBar";
import PriceStyle from "./PriceStyle";
import CurrentLocation from "./element/CurrentLocation";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
function PriceList() {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const route = useRoute<RootStackScreenProps>();
    const [index, setIndex] = React.useState(0);
    const [visibleTnc, setVisibleTnc] = React.useState(false);
    const appState = React.useRef(AppState.currentState);
    const [state, send] = useMachine(priceMachine);
    const [fromVisitation, setFromVisitation] = React.useState(false);
    const [searchFormattedAddress, setSearchFormattedAddress] =
        React.useState("");
    const { selectedBatchingPlant } = useSelector(
        (globalState: RootState) => globalState.auth
    );
    const {
        locationDetail,
        routes,
        productsData,
        loadProduct,
        isLoadMore,
        refreshing,
        loadLocation,
        errorMessage,
        page,
        totalPage,
        selectedCategories
    } = state.context;

    useFocusEffect(
        React.useCallback(() => {
            send("assignSelectedBatchingPlant", {
                selectedBP: selectedBatchingPlant
            });
            send("backToGetProducts", {
                selectedBP: selectedBatchingPlant
            });
        }, [send, selectedBatchingPlant])
    );

    React.useEffect(() => {
        crashlytics().log(TAB_PRICE_LIST);
        if (route?.params) {
            const { params } = route;
            const { latitude, longitude, formattedAddress } = params.coordinate;
            setSearchFormattedAddress(formattedAddress);
            const { from } = params;
            if (from === CREATE_VISITATION) {
                setFromVisitation(true);
            }
            // send("backToIdle");
            send("onAskPermission", {
                value: {
                    latitude,
                    longitude
                },
                selectedBP: selectedBatchingPlant
            });
            // setIndex(0);
        } else {
            send("onAskPermission", { selectedBP: selectedBatchingPlant });
        }

        if (state.matches("denied")) {
            const subscription = AppState.addEventListener(
                "change",
                (nextAppState) => {
                    if (
                        appState.current.match(/inactive|background/) &&
                        nextAppState === "active"
                    ) {
                        send("appComeForegroundState");
                    } else {
                        send("appComeBackgroundState");
                    }
                    appState.current = nextAppState;
                }
            );
            return () => {
                subscription.remove();
            };
        }
        if (state.matches("errorGettingCurrentLocation")) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText: state.context.errorMessage,
                    primaryBtnTitle: "Retry",
                    outlineBtnTitle: "Back",
                    isRenderActions: true,
                    primaryBtnAction: () => {
                        dispatch(closePopUp());
                        send("retryGettingCurrentLocation");
                    },
                    outlineBtnAction: () => {
                        dispatch(closePopUp());
                        navigation.goBack();
                    }
                })
            );
        } else if (state.matches("errorFetchLocationDetail")) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText: state.context.errorMessage,
                    primaryBtnTitle: "Retry",
                    outlineBtnTitle: "Back",
                    isRenderActions: true,
                    primaryBtnAction: () => {
                        dispatch(closePopUp());
                        send("retryFetchLocationDetail");
                    },
                    outlineBtnAction: () => {
                        dispatch(closePopUp());
                        navigation.goBack();
                    }
                })
            );
        }

        return undefined;
    }, [route, route?.params, dispatch, navigation, send, state]);

    const renderHeaderRight = React.useCallback(() => {
        if (fromVisitation) {
            return <View />;
        }
        return (
            <View
                style={{
                    flex: 1,
                    marginEnd: layout.pad.md,
                    justifyContent: "center"
                }}
            >
                <BTouchableText
                    viewStyle={{ width: "100%" }}
                    textStyle={{ width: "100%" }}
                    onPress={() => setVisibleTnc(true)}
                    title="Ketentuan"
                />
            </View>
        );
    }, [fromVisitation]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: renderHeaderRight
        });
    }, [navigation, renderHeaderRight]);

    const onTabPress = () => {
        const tabIndex = index === 0 ? 1 : 0;
        if (route.key !== routes[index].key) {
            send("onChangeCategories", {
                payload: tabIndex,
                selectedBP: selectedBatchingPlant
            });
        }
    };

    const onPressProduct = (data) => {
        if (fromVisitation) {
            DeviceEventEmitter.emit("event.testEvent", { data });
            navigation.goBack();
        }
    };

    const onPressSearchBar = () => {
        if (!fromVisitation) {
            navigation.navigate(SEARCH_PRODUCT, {
                distance: locationDetail?.distance?.value,
                disablePressed: !fromVisitation
            });
        } else {
            navigation.goBack();
        }
    };

    const goToLocation = () => {
        if (!fromVisitation) {
            const { lon, lat } = locationDetail;
            const coordinate = {
                longitude: Number(lon),
                latitude: Number(lat),
                formattedAddress:
                    searchFormattedAddress.length > 0
                        ? searchFormattedAddress
                        : ""
            };

            navigation.navigate(LOCATION, {
                coordinate,
                isReadOnly: false,
                from: TAB_PRICE_LIST_TITLE
            });
        }
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BSpacer size="small" />

            {!loadLocation ? (
                <CurrentLocation
                    onPress={goToLocation}
                    location={
                        searchFormattedAddress?.length > 0
                            ? searchFormattedAddress
                            : locationDetail?.formattedAddress
                    }
                />
            ) : (
                <ShimmerPlaceholder
                    style={{
                        marginHorizontal: layout.pad.lg,
                        height: layout.pad.lg,
                        width: "92%"
                    }}
                />
            )}
            <BSpacer size="extraSmall" />
            {!loadLocation ? (
                <PriceSearchBar onPress={onPressSearchBar} />
            ) : (
                <ShimmerPlaceholder
                    style={{
                        marginHorizontal: layout.pad.lg,
                        height: layout.pad.xl,
                        width: "92%"
                    }}
                />
            )}

            <BSpacer size="extraSmall" />
            {state.matches("getProduct.errorGettingCategories") && (
                <BEmptyState
                    isError
                    errorMessage={errorMessage}
                    onAction={() => send("retryGettingCategories")}
                />
            )}
            {routes.length > 0 && (
                <BTabSections
                    swipeEnabled={false}
                    navigationState={{ index, routes }}
                    // minTabHeaderWidth={layout.pad.xl}
                    renderScene={() => (
                        <ProductList
                            onEndReached={() =>
                                page !== totalPage && send("onEndReached")
                            }
                            products={productsData}
                            onPress={onPressProduct}
                            isLoadMore={isLoadMore}
                            loadProduct={loadProduct}
                            refreshing={refreshing}
                            isError={state.matches(
                                "getProduct.categoriesLoaded.errorGettingProducts"
                            )}
                            onAction={() => send("retryGettingProducts")}
                            errorMessage={errorMessage}
                            onRefresh={() =>
                                send("refreshingList", {
                                    selectedBP: selectedBatchingPlant
                                })
                            }
                            disablePressed={!fromVisitation}
                        />
                    )}
                    onTabPress={onTabPress}
                    onIndexChange={setIndex}
                    tabStyle={PriceStyle.tabStyle}
                    tabBarStyle={PriceStyle.tabBarStyle}
                    indicatorStyle={PriceStyle.tabIndicator}
                />
            )}

            <Tnc
                isVisible={visibleTnc}
                onCloseTnc={() => setVisibleTnc(false)}
            />
            {/* <BAlert
        isVisible={state.matches('unreachable')}
        type="warning"
        onClose={() => send('hideWarning')}
      /> */}
        </SafeAreaView>
    );
}

export default PriceList;
