import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, layout } from "@/constants";
import { Menu, MenuItem } from "react-native-material-menu";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
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
    pageTitle: string;
    selectedBP: string;
    color?: string;
    onPressOption1: () => void;
    onPressOption2: () => void;
}

function BSelectedBPOptionMenu({
    pageTitle,
    selectedBP,
    color = colors.white,
    onPressOption1,
    onPressOption2
}: BSelectedBPOptionMenuProps) {
    const [isVisible, setVisible] = React.useState(false);
    const [bpSelected, setBPSelected] = React.useState(selectedBP);

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
                        title={bpSelected}
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
                <MenuItem
                    onPress={() => {
                        onPressOption1();
                        setVisible(false);
                        setBPSelected("BP-Legok");
                    }}
                >
                    BP-Legok
                </MenuItem>
                <MenuItem
                    onPress={() => {
                        onPressOption2();
                        setVisible(false);
                        setBPSelected("BP-Balaraja");
                    }}
                >
                    BP-Balaraja
                </MenuItem>
            </Menu>
        </View>
    );
}

export default BSelectedBPOptionMenu;
