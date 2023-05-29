import useHeaderTitleChanged from "@/hooks/useHeaderTitleChanged";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import { useRoute } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";

function InvoiceDetail() {
    const route = useRoute<RootStackScreenProps>();

    useHeaderTitleChanged({
        title: route?.params?.invoiceNo ? route?.params?.invoiceNo : "-"
    });
    return <View />;
}

export default InvoiceDetail;
