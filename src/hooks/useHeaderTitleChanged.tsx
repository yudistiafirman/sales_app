import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

type UseHeaderTitle = {
    title: string;
};

export default function useHeaderTitleChanged({ title }: UseHeaderTitle) {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: title
        });
    }, [navigation, title]);
}
