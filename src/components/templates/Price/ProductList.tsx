import BEmptyState from "@/components/organism/BEmptyState";
import PriceListCard from "@/components/templates/Price/PriceListCard";
import { layout } from "@/constants";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { ListRenderItem } from "react-native";
import { FlashList } from "@shopify/flash-list";
import BSpacer from "@/components/atoms/BSpacer";
import BDivider from "@/components/atoms/BDivider";
import PriceListShimmer from "./PriceListShimmer";

interface ProductsData {
    display_name?: string;
    calcPrice: number;
    properties: {
        fc: string;
        fs: string;
        sc: string;
        slump: number;
    };
    Category: {
        name?: string;
        Parent?: {
            name: string;
        };
    };
}

interface ProductListProps<ArrayOfObject> {
    products: ArrayOfObject[];
    onEndReached?:
        | ((info: { distanceFromEnd: number }) => void)
        | null
        | undefined;
    refreshing?: boolean;
    emptyProductName?: string;
    isLoadMore?: boolean;
    loadProduct?: boolean;
    isError?: boolean;
    errorMessage?: string | unknown;
    onRefresh?: () => void;
    onPress?: (data: any) => void;
    onAction?: () => void;
    disablePressed?: boolean;
}

function ProductList<ArrayOfObject extends ProductsData>({
    products,
    onEndReached,
    refreshing,
    emptyProductName,
    isLoadMore,
    onRefresh,
    loadProduct,
    isError,
    errorMessage,
    onPress,
    onAction,
    disablePressed = false
}: ProductListProps<ArrayOfObject>) {
    const renderItem: ListRenderItem<ProductsData> = useCallback(({ item }) => {
        const fc =
            item?.properties?.fc?.length > 0
                ? ` / FC${item.properties.fc}`
                : "";
        const onPressCheck = onPress || null;
        return (
            <TouchableOpacity
                onPress={() => onPressCheck !== null && onPressCheck(item)}
                disabled={disablePressed}
            >
                <PriceListCard
                    productName={`${item?.display_name}${fc}`}
                    productPrice={item?.calcPrice}
                    categories={item?.Category?.Parent?.name}
                    slump={item?.properties?.slump}
                />
                <BSpacer size="extraSmall" />
                <BDivider />
            </TouchableOpacity>
        );
    }, []);
    return (
        <FlashList
            estimatedItemSize={10}
            onEndReachedThreshold={0.5}
            data={products}
            removeClippedSubviews={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            onRefresh={onRefresh}
            contentContainerStyle={{ paddingHorizontal: layout.pad.lg }}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={onEndReached}
            refreshing={refreshing}
            ListFooterComponent={isLoadMore ? <PriceListShimmer /> : null}
            ListEmptyComponent={
                loadProduct ? (
                    <PriceListShimmer />
                ) : (
                    <BEmptyState
                        isError={isError}
                        errorMessage={errorMessage}
                        onAction={onAction}
                        emptyText={`${emptyProductName} tidak ditemukan!`}
                    />
                )
            }
            renderItem={renderItem}
        />
    );
}

export default ProductList;
