import { FlashList } from "@shopify/flash-list";
import React, { useCallback } from "react";
import { StyleSheet, View, ListRenderItem } from "react-native";
import { BLabel, BSpacer } from "@/components";
import { layout } from "@/constants";
import font from "@/constants/fonts";
import { Products } from "@/machine/visitHistoryMachine";
import ProductChip from "@/screens/Visitation/elements/third/ProductChip";
import { resScale } from "@/utils";
import { DEFAULT_ESTIMATED_LIST_SIZE } from "@/constants/general";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: layout.pad.lg
    }
});

function Product({ products }: { products: Products }) {
    const renderItem: ListRenderItem<Products> = useCallback(
        ({ item }) => (
            <View style={{ height: resScale(37) }}>
                <ProductChip
                    category={{ name: item?.Product?.category?.displayName }}
                    name={item?.Product?.displayName}
                />
            </View>
        ),
        []
    );
    return (
        <View style={styles.container}>
            <BLabel bold="600" sizeInNumber={font.size.md} label="Produk" />
            <BSpacer size="extraSmall" />
            <FlashList
                estimatedItemSize={DEFAULT_ESTIMATED_LIST_SIZE}
                data={products}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderItem}
                horizontal
            />
        </View>
    );
}

export default Product;
