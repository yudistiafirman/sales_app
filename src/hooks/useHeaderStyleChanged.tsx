import { colors } from "@/constants";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

type HeaderStyleProps = {
    titleColor?: string;
    bgColor?: string;
    customHeader?: JSX.Element;
};

export default function useHeaderStyleChanged({
    titleColor = colors.text.darker,
    bgColor = colors.white,
    customHeader
}: HeaderStyleProps) {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        if (customHeader) {
            navigation.setOptions({
                headerStyle: {
                    backgroundColor: bgColor
                },
                headerTitle: () => customHeader
            });
        } else {
            navigation.setOptions({
                headerStyle: {
                    backgroundColor: bgColor
                },
                headerTitleStyle: {
                    color: titleColor
                }
            });
        }
    }, [navigation, titleColor, bgColor]);
}
