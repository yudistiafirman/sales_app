import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Platform,
    UIManager,
    LayoutAnimation,
    TouchableOpacity,
    ViewStyle
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BLocationText, BPic, BSpacer, BText } from "@/components";
import { colors, layout } from "@/constants";
import { customerDataInterface } from "@/interfaces";

const styles = StyleSheet.create({
    customerCard: {
        backgroundColor: colors.tertiary,
        padding: layout.pad.md,
        borderRadius: layout.radius.md
    },
    topCard: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
    },
    bottomCard: {
        overflow: "hidden"
    }
});

export default function ExpandableCustomerCard({
    item
}: {
    item: customerDataInterface;
}) {
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        if (Platform.OS === "android") {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    function changeLayout() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded((curr) => !curr);
    }

    function bottomCardHeight(): ViewStyle | null {
        return expanded ? null : { height: 0 };
    }

    return (
        <View style={styles.customerCard}>
            <View style={styles.topCard}>
                <BText bold="500" color="darker">
                    {item.display_name ? item.display_name : item.picName}
                </BText>
                <TouchableOpacity
                    onPress={changeLayout}
                    style={{
                        transform: [
                            expanded ? { rotate: "180deg" } : { rotate: "0deg" }
                        ]
                    }}
                >
                    <Icon
                        name="chevron-down"
                        size={25}
                        color={colors.icon.darkGrey}
                    />
                </TouchableOpacity>
            </View>
            <View style={[bottomCardHeight(), styles.bottomCard]}>
                <BText bold="300" color="darker">
                    {item.name}
                </BText>
                <BSpacer size="verySmall" />
                <BLocationText location={item.location} />
                <BSpacer size="extraSmall" />
                <BPic
                    name={item.picName}
                    email={item.email ? item.email : "-"}
                    phone={item.phone}
                    position={item.position}
                    border={false}
                />
            </View>
        </View>
    );
}
