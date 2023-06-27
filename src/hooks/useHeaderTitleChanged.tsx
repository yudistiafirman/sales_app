import * as React from "react";
import { BSelectedBPBadges } from "@/components";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { BatchingPlant } from "@/models/BatchingPlant";

type UseHeaderTitle = {
    title: string;
    selectedBP: BatchingPlant;
    hideBPBadges?: boolean;
    alignLeft?: boolean;
};

export default function useHeaderTitleChanged({
    title,
    selectedBP,
    hideBPBadges = false,
    alignLeft = true
}: UseHeaderTitle) {
    const navigation = useNavigation();

    const selectedBPBadges = (
        selectedBatchingPlant: BatchingPlant,
        titlePage: string
    ) => (
        <BSelectedBPBadges
            selectedBP={selectedBatchingPlant}
            title={titlePage}
            alignLeft={alignLeft}
        />
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
