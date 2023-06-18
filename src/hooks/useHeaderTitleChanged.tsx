import * as React from "react";
import { BSelectedBPBadges } from "@/components";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

type UseHeaderTitle = {
    title: string;
};

export default function useHeaderTitleChanged({ title }: UseHeaderTitle) {
    const navigation = useNavigation();

    const selectedBPBadges = (bpName: string, titlePage: string) => (
        <BSelectedBPBadges bpName={bpName} title={titlePage} alignLeft />
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => selectedBPBadges("BP-LEGOK", title)
        });
    }, [navigation, title]);
}
