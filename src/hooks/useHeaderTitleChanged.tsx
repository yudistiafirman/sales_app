import * as React from "react";
import { BSelectedBPBadges } from "@/components";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

type UseHeaderTitle = {
    title: string;
    selectedBP: string;
    hideBPBadges?: boolean;
};

export default function useHeaderTitleChanged({
    title,
    selectedBP,
    hideBPBadges = false
}: UseHeaderTitle) {
    const navigation = useNavigation();

    const selectedBPBadges = (bpName: string, titlePage: string) => (
        <BSelectedBPBadges bpName={bpName} title={titlePage} alignLeft />
    );

    useLayoutEffect(() => {
        if (hideBPBadges) {
            navigation.setOptions({
                headerTitle: title
            });
        } else {
            navigation.setOptions({
                headerTitle: () => selectedBPBadges(selectedBP, title)
            });
        }
    }, [navigation, title]);
}
