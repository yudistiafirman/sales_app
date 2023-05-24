import React from "react";
import { ScrollView, TextStyle, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { colors, fonts, layout } from "@/constants";
import { PIC, Styles } from "@/interfaces";
import { resScale } from "@/utils";
import BText from "../atoms/BText";
import BSpacer from "../atoms/BSpacer";

interface IProps extends PIC {
    isOption?: boolean;
    onSelect?: (index: number) => void;
    index?: number;
    border?: boolean;
    isCompetitor?: boolean;
}

const styles: Styles = {
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.offWhite,
        borderRadius: layout.radius.md
    }
};

const titleStyles: TextStyle = {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.xs,
    color: colors.text.secondary
};

const makeStyle = ({ isOption, border }: IProps) => {
    let style: Styles = styles;

    if (border) {
        style = {
            container: {
                ...(style.container as Record<string, never>),
                borderWidth: resScale(2),
                borderColor: colors.border.default,
                paddingHorizontal: layout.pad.md + layout.pad.ml,
                paddingVertical: layout.pad.md + layout.pad.xs
            }
        };
    }
    if (isOption) {
        style = {
            container: {
                ...(style.container as Record<string, never>),
                paddingHorizontal: resScale(10)
            }
        };
    }

    return style;
};

function BPic({
    isOption,
    email,
    name,
    phone,
    position,
    exclusive,
    mou,
    isSelected,
    onSelect,
    index,
    border = true,
    isCompetitor = false
}: IProps): JSX.Element {
    const checkActionButton = onSelect || null;
    return (
        <View
            style={
                makeStyle({
                    isOption,
                    index,
                    onSelect,
                    border
                }).container
            }
        >
            {isOption && (
                <>
                    <RadioButton
                        value={phone!}
                        status={isSelected ? "checked" : "unchecked"}
                        color={colors.primary}
                        uncheckedColor={colors.border.altGrey}
                        onPress={() =>
                            checkActionButton !== null &&
                            checkActionButton(index!)
                        }
                    />
                    <BSpacer size="extraSmall" />
                </>
            )}
            <View style={{ flex: 1, paddingEnd: layout.pad.xs }}>
                <BText style={titleStyles}>Nama</BText>
                <View>
                    <ScrollView horizontal>
                        <BText
                            numberOfLines={1}
                            sizeInNumber={fonts.size.sm}
                            bold="500"
                        >
                            {name || "-"}
                        </BText>
                    </ScrollView>
                </View>
                <BSpacer size="extraSmall" />
                <BText style={titleStyles}>
                    {isCompetitor ? "Apakah PKS-nya ekslusif?" : "No. Telepon"}
                </BText>
                <View>
                    <ScrollView horizontal>
                        <BText sizeInNumber={fonts.size.sm} bold="500">
                            {isCompetitor
                                ? exclusive
                                : phone
                                ? `+62${phone}`
                                : "-"}
                        </BText>
                    </ScrollView>
                </View>
            </View>
            <BSpacer size="extraSmall" />
            <View style={{ flex: 1, paddingEnd: layout.pad.sm }}>
                <BText style={titleStyles}>
                    {isCompetitor ? "Apakah memiliki PKS?" : "Jabatan"}
                </BText>
                <View>
                    <ScrollView horizontal>
                        <BText
                            numberOfLines={1}
                            sizeInNumber={fonts.size.sm}
                            bold="500"
                        >
                            {isCompetitor ? mou : position || "-"}
                        </BText>
                    </ScrollView>
                </View>
                <BSpacer size="extraSmall" />
                <BText style={titleStyles}>
                    {isCompetitor ? " " : "Email"}
                </BText>
                <View>
                    <ScrollView horizontal>
                        <BText
                            numberOfLines={1}
                            sizeInNumber={fonts.size.sm}
                            bold="500"
                        >
                            {isCompetitor ? " " : email || "-"}
                        </BText>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

export default BPic;
