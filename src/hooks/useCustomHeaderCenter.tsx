import * as React from "react";
import { BSelectedBPBadges } from "@/components";
import { BatchingPlant } from "@/models/BatchingPlant";
import { useNavigation } from "@react-navigation/native";
import { ReactElement, useLayoutEffect } from "react";

type HeaderCenterProps = {
    customHeaderCenter: ReactElement<Element>;
    selectedBP: BatchingPlant;
    hideBPBadges?: boolean;
    title?: string;
};

export default function useCustomHeaderCenter({
    customHeaderCenter,
    selectedBP,
    hideBPBadges = false,
    title
}: HeaderCenterProps) {
    const navigation = useNavigation();

    const selectedBPBadges = (
        selectedBatchingPlant: BatchingPlant,
        titlePage: string
    ) => (
        <BSelectedBPBadges
            selectedBP={selectedBatchingPlant}
            title={titlePage}
            alignLeft={false}
        />
    );

    useLayoutEffect(() => {
        if (hideBPBadges) {
            navigation.setOptions({
                headerTitle: () => customHeaderCenter
            });
        } else {
            navigation.setOptions({
                headerTitle: () => selectedBPBadges(selectedBP, title || "")
            });
        }

        navigation.setOptions({
            headerTitle: () => customHeaderCenter
        });
    }, [navigation, customHeaderCenter]);
}
