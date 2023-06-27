import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, layout } from "@/constants";
import { Menu, MenuDivider, MenuItem } from "react-native-material-menu";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BatchingPlant } from "@/models/BatchingPlant";
import { getBatchingPlants } from "@/actions/CommonActions";
import { setSelectedBatchingPlant } from "@/redux/reducers/authReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { openPopUp } from "@/redux/reducers/modalReducer";
import BSpacer from "../atoms/BSpacer";
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
    const dispatch = useDispatch<AppDispatch>();
    const [isVisible, setVisible] = React.useState(false);
    const [updatedBatchingPlants, setUpdatedBatchingPlants] =
        React.useState(batchingPlants);

    async function checkUndefinedBatchingPlants() {
        const batchingPlantsResponse = await getBatchingPlants();
        if (batchingPlantsResponse?.data?.data?.data) {
            const newData = batchingPlantsResponse?.data?.data?.data;
            setSelectedBatchingPlant(newData);
            setUpdatedBatchingPlants(newData);
            setVisible(true);
        } else {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        "Terjadi error dalam pengambilan data batching plant",
                    outsideClickClosePopUp: true
                })
            );
        }
    }

    return (
        <View style={styles.parent}>
            <Text style={[styles.text, { color }]}>{pageTitle}</Text>
            {!updatedBatchingPlants ||
                (updatedBatchingPlants.length <= 0 && (
                    <BSpacer size="extraSmall" />
                ))}
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
                            <MaterialIcons
                                name="arrow-drop-down"
                                color={color}
                                size={layout.pad.xl - 6}
                            />
                        }
                        onPress={
                            updatedBatchingPlants &&
                            updatedBatchingPlants.length > 0
                                ? () => setVisible(true)
                                : () => checkUndefinedBatchingPlants()
                        }
                    />
                }
            >
                {updatedBatchingPlants?.map((el, key) => (
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
