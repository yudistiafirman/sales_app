import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, layout } from "@/constants";
import { Menu, MenuItem } from "react-native-material-menu";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BatchingPlant } from "@/models/BatchingPlant";
import BTouchableText from "../atoms/BTouchableText";

const styles = StyleSheet.create({
    text: {
        fontSize: fonts.size.lg,
        textAlign: "center",
        fontFamily: fonts.family.montserrat[600]
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
    color = colors.white,
    onPressOption
}: BSelectedBPOptionMenuProps) {
    const [isVisible, setVisible] = React.useState(false);
    const [bpSelected, setBPSelected] = React.useState(selectedBatchingPlant);

    return (
        <View style={styles.parent}>
            <Text style={[styles.text, { color }]}>{pageTitle}</Text>
            <Menu
                visible={isVisible}
                onRequestClose={() => setVisible(false)}
                anchor={
                    <BTouchableText
                        viewStyle={styles.view}
                        textStyle={{
                            color
                        }}
                        title={bpSelected.name}
                        endIcon={
                            <MaterialIcons
                                name="arrow-drop-down"
                                color={color}
                                size={layout.pad.xl - 6}
                            />
                        }
                        onPress={() => setVisible(true)}
                    />
                }
            >
                {batchingPlants?.map((el, key) => (
                    <MenuItem
                        key={key}
                        onPress={() => {
                            onPressOption(el);
                            setBPSelected(el);
                            setVisible(false);
                        }}
                    >
                        {el.name}
                    </MenuItem>
                ))}
            </Menu>
        </View>
    );
}

export default BSelectedBPOptionMenu;
