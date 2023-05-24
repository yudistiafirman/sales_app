import crashlytics from "@react-native-firebase/crashlytics";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    DeviceEventEmitter,
    Dimensions
} from "react-native";
import { TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
    BBackContinueBtn,
    BContainer,
    BDivider,
    BProductCard,
    BSearchBar,
    BSpacer
} from "@/components";
import { colors, fonts, layout } from "@/constants";
import { chosenProductType, ProductDataInterface } from "@/interfaces";
import { SEARCH_PRODUCT, SPH } from "@/navigation/ScreenNames";
import {
    setStepperFocused,
    updateChosenProducts
} from "@/redux/reducers/SphReducer";
import { RootState } from "@/redux/store";
import { resScale } from "@/utils";
import { SphContext } from "../context/SphContext";
import ProductCartModal from "../ProductOrderDetailModal";

const { width } = Dimensions.get("window");

const style = StyleSheet.create({
    posRelative: {
        position: "relative",
        marginBottom: layout.pad.xs + layout.pad.md
    },
    touchable: {
        position: "absolute",
        width: "100%",
        borderRadius: layout.radius.sm,
        height: resScale(45),
        zIndex: 2
    },
    productText: {
        fontFamily: fonts.family.montserrat[600],
        fontSize: fonts.size.md,
        color: colors.text.darker
    },
    searchModeContainer: {
        flex: 1,
        justifyContent: "space-between"
    },
    backContinueWrapper: {
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        width: width - layout.pad.xl
    }
});

interface RenderModalType {
    selectedProduct: ProductDataInterface | null;
    isModalVisible: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedProduct: React.Dispatch<
        React.SetStateAction<ProductDataInterface | null>
    >;
    setChosenProducts: React.Dispatch<React.SetStateAction<any[]>>;
    chosenProducts: chosenProductType[];
    distance: number | null;
}

function RenderModal({
    selectedProduct,
    isModalVisible,
    setIsModalVisible,
    setSelectedProduct,
    setChosenProducts,
    chosenProducts,
    distance
}: RenderModalType) {
    if (!selectedProduct) {
        return null;
    }
    const prevData = { volume: "", sellPrice: "", pouringMethod: "" };
    const existingDataIndex = chosenProducts.findIndex(
        (data) => data.product.id === selectedProduct.id
    );

    if (existingDataIndex !== -1) {
        prevData.sellPrice = chosenProducts[existingDataIndex].sellPrice;
        prevData.volume = chosenProducts[existingDataIndex].volume;
        prevData.pouringMethod =
            chosenProducts[existingDataIndex].pouringMethod;
        // productDataProp = chosenProducts[existingDataIndex].product;
    }

    return (
        <ProductCartModal
            productData={selectedProduct}
            isVisible={isModalVisible}
            setIsVisible={setIsModalVisible}
            resetSelectedProduct={() => {
                setSelectedProduct(null);
                // backToChosenProducst();
            }}
            choseProduct={setChosenProducts}
            prevData={prevData}
            distance={distance}
        />
    );
}

function renderSeparator() {
    return <BSpacer size="small" />;
}

export default function FourthStep() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [, stateUpdate, setCurrentPosition] = useContext(SphContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] =
        useState<ProductDataInterface | null>(null);
    const [chosenProducts, setChosenProducts] = useState<chosenProductType[]>(
        []
    );
    const { chosenProducts: productsRedux, distanceFromLegok } = useSelector(
        (state: RootState) => state.sph
    );

    const getProduct = useCallback(
        ({ data }: { data: ProductDataInterface }) => {
            setSelectedProduct(data);
            setIsModalVisible(true);
        },
        []
    );

    const deleteSelectedProduct = useCallback((index: number) => {
        setChosenProducts((curr) => {
            let currentProducts: any[] = [];
            if (curr && curr.length > 0) currentProducts = [...curr];
            currentProducts.splice(index, 1);
            return [...currentProducts];
        });
    }, []);

    useEffect(() => {
        crashlytics().log(`${SPH}-Step4`);

        if (productsRedux.length > 0) {
            setChosenProducts(productsRedux);
        }
        DeviceEventEmitter.addListener("event.testEvent", getProduct);
        return () => {
            DeviceEventEmitter.removeAllListeners("event.testEvent");
        };
    }, []);

    useEffect(() => {
        dispatch(updateChosenProducts(chosenProducts));
    }, [chosenProducts]);

    return (
        <BContainer>
            <RenderModal
                setChosenProducts={setChosenProducts}
                setSelectedProduct={setSelectedProduct}
                setIsModalVisible={setIsModalVisible}
                isModalVisible={isModalVisible}
                chosenProducts={chosenProducts}
                selectedProduct={selectedProduct}
                distance={distanceFromLegok}
            />
            <View style={style.searchModeContainer}>
                <View>
                    <Text style={style.productText}>Produk</Text>
                    <View>
                        <BSpacer size="verySmall" />
                        <BDivider />
                    </View>
                    <BSpacer size="extraSmall" />
                    <View style={style.posRelative}>
                        <TouchableOpacity
                            style={style.touchable}
                            onPress={() => {
                                navigation.navigate(SEARCH_PRODUCT, {
                                    isGobackAfterPress: true,
                                    distance: distanceFromLegok || 0
                                });
                            }}
                        />
                        <BSearchBar
                            disabled
                            placeholder="Cari Produk"
                            activeOutlineColor="gray"
                            left={
                                <TextInput.Icon
                                    forceTextInputFocus={false}
                                    icon="magnify"
                                />
                            }
                        />
                    </View>
                    <BSpacer size="verySmall" />
                    {/* <Text>Tidak ada produk yang terpilih</Text> */}
                    <View style={{ flexGrow: 1, flexDirection: "row" }}>
                        <FlashList
                            estimatedItemSize={10}
                            data={chosenProducts}
                            keyExtractor={(item) => item.product.id}
                            ListFooterComponent={
                                <View
                                    style={{
                                        width: resScale(160),
                                        height: resScale(160)
                                    }}
                                />
                            }
                            renderItem={({ item, index }) => (
                                <BProductCard
                                    name={item.product.name}
                                    volume={+item.volume}
                                    pricePerVol={+item.sellPrice}
                                    totalPrice={+item.totalPrice}
                                    onPressEdit={() => {
                                        setSelectedProduct(item.product);
                                        setIsModalVisible(true);
                                    }}
                                    onPressDelete={() => {
                                        deleteSelectedProduct(index);
                                    }}
                                />
                            )}
                            ItemSeparatorComponent={renderSeparator}
                        />
                    </View>
                </View>
                <View style={style.backContinueWrapper}>
                    <BBackContinueBtn
                        onPressBack={() => {
                            if (setCurrentPosition) {
                                setCurrentPosition(2);
                            }
                        }}
                        onPressContinue={() => {
                            if (setCurrentPosition) {
                                dispatch(setStepperFocused(4));
                                setCurrentPosition(4);
                            }
                        }}
                        disableContinue={productsRedux.length === 0}
                    />
                </View>
            </View>

            {/* <Text>ini step 4</Text> */}
        </BContainer>
    );
}
