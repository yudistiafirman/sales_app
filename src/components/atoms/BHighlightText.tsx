import { Text, StyleSheet } from "react-native";
import React from "react";
import font from "@/constants/fonts";
import respFS from "@/utils/resFontSize";
import colors from "@/constants/colors";
import { resScale } from "@/utils";
import { fonts } from "@/constants";

const style = StyleSheet.create({
    normalText: {
        fontFamily: font.family.montserrat[500],
        color: colors.textInput.input,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
        // maxWidth: resScale(200)
    },
    boldText: {
        fontFamily: fonts.family.montserrat[800]
    }
});

type HiglightTextType = {
    searchQuery?: string;
    name: string;
    fontSize?: number;
    numberOfLines?: number;
};

export default function HighlightText({
    searchQuery,
    name,
    fontSize,
    numberOfLines = 1
}: HiglightTextType) {
    function escapeRegExp(text: string) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    if (!searchQuery) {
        return (
            <Text
                style={[
                    style.normalText,
                    fontSize
                        ? { fontSize: respFS(fontSize) }
                        : { fontSize: font.size.md }
                ]}
                numberOfLines={numberOfLines}
            >
                {name}
            </Text>
        );
    }

    const regexStr = `(${searchQuery
        .trim()
        .toLowerCase()
        ?.split(/\s+/)
        ?.map(escapeRegExp)
        ?.join("|")})`;
    const regex = new RegExp(regexStr, "gi");
    const parts = name?.split(regex);

    return (
        <Text
            style={[
                style.normalText,
                fontSize
                    ? { fontSize: respFS(fontSize) }
                    : { fontSize: font.size.md }
            ]}
            numberOfLines={numberOfLines}
        >
            {parts &&
                parts.length > 0 &&
                parts
                    ?.filter((part) => part)
                    ?.map((part, i) =>
                        regex.test(part) ? (
                            <Text
                                key={part + i}
                                style={[
                                    style.normalText,
                                    style.boldText,
                                    fontSize
                                        ? { fontSize: respFS(fontSize) }
                                        : { fontSize: font.size.md }
                                ]}
                            >
                                {part}
                            </Text>
                        ) : (
                            part
                        )
                    )}
        </Text>
    );
}
