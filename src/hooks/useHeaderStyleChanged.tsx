import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

type HeaderStyleProps = {
    titleColor?: string;
    bgColor?: string;
    customHeader?: JSX.Element;
};

export default function useHeaderStyleChanged({
    titleColor,
    bgColor,
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
