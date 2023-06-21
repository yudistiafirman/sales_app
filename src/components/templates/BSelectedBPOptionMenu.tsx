import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, layout } from "@/constants";
import { Menu, MenuDivider, MenuItem } from "react-native-material-menu";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BatchingPlant } from "@/models/BatchingPlant";
import BTouchableText from "../atoms/BTouchableText";

const styles = StyleSheet.create({
    text: {
        fontSize: fonts.size.lg,
        textAlign: "center",
        fontFamily: fonts.family.montserrat[600]
    },
    textMenu: {
        fontSize: fonts.size.sm,
        textAlign: "center",
        fontFamily: fonts.family.montserrat[500]
    },
    view: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginStart: layout.pad.md,
        marginTop: -layout.pad.md
    },
    parent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    }
});

interface BSelectedBPOptionMenuProps {
    batchingPlants: BatchingPlant[];
    pageTitle: string;
    selectedBatchingPlant: BatchingPlant;
    color?: string;
    onPressOption: (item: BatchingPlant) => void;
}

function BSelectedBPOptionMenu({
    batchingPlants,
    pageTitle,
    selectedBatchingPlant,
    color = colors.text.darker,
    onPressOption
}: BSelectedBPOptionMenuProps) {
    const [isVisible, setVisible] = React.useState(false);

    return (
        <View style={styles.parent}>
            <Text style={[styles.text, { color }]}>{pageTitle}</Text>
            <Menu
                visible={isVisible}
                onRequestClose={() => setVisible(false)}
                anchor={
                    <BTouchableText
                        viewStyle={styles.view}
                        textStyle={[
                            styles.textMenu,
                            {
                                color
                            }
                        ]}
                        title={selectedBatchingPlant?.name}
                        endIcon={
                            batchingPlants && batchingPlants.length > 0 ? (
                                <MaterialIcons
                                    name="arrow-drop-down"
                                    color={color}
                                    size={layout.pad.xl - 6}
                                />
                            ) : undefined
                        }
                        onPress={
                            batchingPlants && batchingPlants.length > 0
                                ? () => setVisible(true)
                                : undefined
                        }
                    />
                }
            >
                {batchingPlants?.map((el, key) => (
                    <React.Fragment key={key}>
                        <MenuItem
                            textStyle={[
                                styles.textMenu,
                                { color: colors.text.darker }
                            ]}
                            onPress={() => {
                                onPressOption(el);
                                setVisible(false);
                            }}
                        >
                            {el.name}
                        </MenuItem>
                        <MenuDivider />
                    </React.Fragment>
                ))}
            </Menu>
        </View>
    );
}

export default BSelectedBPOptionMenu;
