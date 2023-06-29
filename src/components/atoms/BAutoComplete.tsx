import React from "react";
import { ListRenderItem, Text, TextInput, View } from "react-native";
import {
    AutocompleteDropdown,
    TAutocompleteDropdownItem
} from "react-native-autocomplete-dropdown";
import { colors, fonts, layout } from "@/constants";
import { resScale } from "@/utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ItemSet } from "@/interfaces";
import Icon from "react-native-vector-icons/AntDesign";
import BSpacer from "./BSpacer";
import BCommonListShimmer from "../templates/BCommonListShimmer";
import BChip from "./BChip";

const styles: Styles = {
    inputContainer: {
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.md,
        lineHeight: resScale(14),
        color: "blue",
        backgroundColor: colors.white,
        borderRadius: layout.radius.sm,
        borderColor: colors.textInput.inActive,
        borderWidth: 1
    },
    dropdownContainer: {
        zIndex: 10,
        borderRadius: layout.radius.sm,
        borderColor: colors.textInput.inActive,
        borderWidth: 1,
        color: "blue"
    },
    title: {
        fontFamily: fonts.family.montserrat[600],
        color: colors.text.darker,
        fontSize: fonts.size.sm
    },
    text: {
        color: colors.textInput.input,
        fontFamily: fonts.family.montserrat[300],
        fontSize: fonts.size.sm
    },
    separator: {
        backgroundColor: colors.border.default,
        paddingHorizontal: layout.pad.xs + layout.pad.sm,
        width: "95%",
        alignSelf: "center"
    },
    emptyStateContainer: {
        padding: layout.pad.md + layout.pad.xs,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderColor: colors.textInput.inActive,
        borderWidth: 1,
        borderRadius: layout.radius.sm
    },
    emptyStateText: {
        fontSize: fonts.size.md,
        fontFamily: fonts.family.montserrat[500],
        textAlign: "center"
    },
    error: {
        borderColor: colors.primary
    }
};

interface IProps {
    itemSet?: ItemSet[];
    value?: string;
    placeholder?: string;
    isError?: boolean;
    errorMessage?: string;
    onChange?: (e: string) => void;
    onSelect?: (item: TAutocompleteDropdownItem) => void;
    loading?: boolean;
    showChevron?: boolean;
    showClear?: boolean;
    onClear?: () => void;
    chipBgColor?: string;
}

function BAutoComplete({
    value,
    itemSet,
    onChange,
    onSelect,
    loading,
    placeholder,
    showChevron = true,
    showClear = true,
    chipBgColor = colors.status.lightBlue,
    onClear
}: IProps) {
    let isShowChevron = showChevron;
    if (itemSet?.length === 0) {
        isShowChevron = false;
    }

    const renderItemAutoComp: ListRenderItem<ItemSet> = ({ item, index }) => (
        <TouchableOpacity
            onPress={() => onSelect(item)}
            style={{
                paddingVertical: layout.pad.md,
                backgroundColor: index % 2 ? colors.veryLightShadeGray : ""
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <Text style={styles.title}>{item.title}</Text>
                {item.chipTitle && (
                    <BChip
                        titleWeight="700"
                        type="header"
                        backgroundColor={chipBgColor}
                    >
                        {item.chipTitle}
                    </BChip>
                )}
            </View>
            {item.subtitle && (
                <>
                    <BSpacer size="extraSmall" />
                    <Text style={styles.text}>{item.subtitle} </Text>
                </>
            )}
        </TouchableOpacity>
    );

    const renderEmptyComponent = () => (
        <View style={styles.emptyStateContainer}>
            <Icon name="search1" size={layout.pad.lg} />
            <BSpacer size="extraSmall" />

            <Text style={styles.emptyStateText}>Minimal 3 huruf</Text>
        </View>
    );

    const renderLoading = () => <BCommonListShimmer />;

    return (
        <AutocompleteDropdown
            showChevron={showChevron}
            showClear={showClear}
            closeOnBlur={false}
            onClear={onClear}
            inputContainerStyle={styles.inputContainer}
            flatListProps={{
                data: itemSet,
                renderItem:
                    itemSet && itemSet.length > 0 ? renderItemAutoComp : null,
                keyExtractor(item, index) {
                    return item.id;
                },
                ListEmptyComponent: loading
                    ? renderLoading
                    : renderEmptyComponent
            }}
            dataSet={itemSet}
            useFilter={false}
            textInputProps={{
                placeholder,
                value,
                onChangeText: onChange
            }}
        />
    );
}

export default BAutoComplete;
