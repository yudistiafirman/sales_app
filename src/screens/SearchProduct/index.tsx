import * as React from "react";
import { SafeAreaView, View, DeviceEventEmitter, Platform } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import {
    BEmptyState,
    BHeaderIcon,
    BSpacer,
    BTabSections,
    ProductList
} from "@/components";
import { layout } from "@/constants";
import { useMachine } from "@xstate/react";
import searchProductMachine from "@/machine/searchProductMachine";
import useCustomHeaderCenter from "@/hooks/useCustomHeaderCenter";
import crashlytics from "@react-native-firebase/crashlytics";
import { SEARCH_PRODUCT } from "@/navigation/ScreenNames";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SearchProductStyles from "./styles";
import SearchProductNavbar from "./element/SearchProductNavbar";

function SearchProduct() {
    const routePage = useRoute<RouteProp<Record<string, object>, string>>();
    let isGoback = false;
    if (routePage.params) {
        const { isGobackAfterPress } = routePage.params as {
            isGobackAfterPress: boolean;
            distance: number;
        };
        isGoback = isGobackAfterPress;
    }

    const [index, setIndex] = React.useState(0);
    const [searchValue, setSearchValue] = React.useState<string>("");
    const navigation = useNavigation();
    const [state, send] = useMachine(searchProductMachine);
    const disablePressed = routePage?.params?.disablePressed;
    const { routes, productsData, loadProduct, errorMessage } = state.context;
    const { selectedBatchingPlant } = useSelector(
        (globalState: RootState) => globalState.auth
    );

    const renderHeaderLeft = React.useCallback(
        () => (
            <BHeaderIcon
                size={layout.pad.xl}
                iconName="chevron-left"
                marginRight={layout.pad.xs}
                marginLeft={layout.pad.sm}
                onBack={() => {
                    navigation.goBack();
                }}
            />
        ),
        [navigation]
    );

    React.useEffect(() => {
        crashlytics().log(SEARCH_PRODUCT);

        if (routePage?.params) {
            const distance = routePage?.params?.distance;
            send("sendingParams", {
                value: distance,
                selectedBP: selectedBatchingPlant
            });
        }
    }, [routePage?.params]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerBackVisible: false,
            headerLeft: () => renderHeaderLeft()
        });
    }, [navigation, renderHeaderLeft]);

    const onChangeText = (text: string) => {
        setSearchValue(text);

        if (!text || text?.length === 0) {
            send("clearInput");
        } else {
            send("searchingProducts", { value: text });
        }
    };

    const onClearValue = () => {
        setSearchValue("");
        send("clearInput");
    };

    useCustomHeaderCenter(
        {
            customHeaderCenter: (
                <View
                    style={[
                        {
                            width: "98%",
                            justifyContent: "space-between",
                            alignItems: "flex-start"
                        },
                        Platform.OS !== "android" && { height: "80%" }
                    ]}
                >
                    <SearchProductNavbar
                        customStyle={[
                            {
                                width: "75%",
                                justifyContent: "center"
                            },
                            Platform.OS !== "android" && { height: "80%" }
                        ]}
                        autoFocus
                        value={searchValue}
                        onChangeText={onChangeText}
                        onClearValue={onClearValue}
                    />
                </View>
            )
        },
        [searchValue]
    );

    const onTabPress = ({ route }) => {
        const tabIndex = index === 0 ? 1 : 0;
        if (route?.key !== routes[index]?.key) {
            send("onChangeTab", {
                value: tabIndex,
                selectedBP: selectedBatchingPlant
            });
        }
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BSpacer size="small" />
            {state.matches("errorGettingCategories") && (
                <BEmptyState
                    isError
                    errorMessage={errorMessage}
                    onAction={() => send("retryGettingCategories")}
                />
            )}
            {routes.length > 0 ? (
                <BTabSections
                    tabStyle={SearchProductStyles.tabStyle}
                    indicatorStyle={SearchProductStyles.tabIndicator}
                    navigationState={{ index, routes }}
                    onTabPress={onTabPress}
                    renderScene={() => (
                        <ProductList
                            products={productsData}
                            loadProduct={loadProduct}
                            emptyProductName={searchValue}
                            isError={state.matches("errorGettingProductsData")}
                            errorMessage={errorMessage}
                            onAction={() => send("retryGettingProductsData")}
                            onPress={(data) => {
                                DeviceEventEmitter.emit("event.testEvent", {
                                    data
                                });
                                if (isGoback) {
                                    navigation.goBack();
                                }
                            }}
                            disablePressed={disablePressed || false}
                        />
                    )}
                    onIndexChange={setIndex}
                    tabBarStyle={SearchProductStyles.tabBarStyle}
                />
            ) : (
                <BEmptyState emptyText="Minimal 3 huruf!" />
            )}
        </SafeAreaView>
    );
}

export default SearchProduct;
