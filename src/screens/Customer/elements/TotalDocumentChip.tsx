import { BChip, BSvg } from "@/components";
import SvgNames from "@/components/atoms/BSvg/svgName";
import { colors, fonts, layout } from "@/constants";
import { CustomerDocs, CustomerDocsPayType } from "@/models/Customer";
import { showWarningDocument } from "@/utils/generalFunc";
import React, { useMemo } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

type ITotalDocumentChip = {
    documents?: CustomerDocs;
    customerType: "INDIVIDU" | "COMPANY";
    chipText?: TextStyle;
    iconSize?: number;
};

function TotalDocumentChip({
    documents,
    customerType,
    chipText,
    iconSize
}: ITotalDocumentChip) {
    const totalDocuments = useMemo(() => {
        if (!documents || !customerType) return 0;
        const totalUploadedDocument = [
            ...documents?.cbd,
            ...documents?.credit
        ].filter((v) => v.File !== null);
        return totalUploadedDocument.length;
    }, [documents]);

    if (!documents || !customerType) {
        return null;
    }
    return (
        <BChip
            endIcon={
                <BSvg
                    svgName={
                        showWarningDocument(documents?.cbd, customerType)
                            ? SvgNames.IC_EXCLA_CERT
                            : SvgNames.IC_CHECK_CERT
                    }
                    width={iconSize || layout.pad.ml}
                    style={{ marginLeft: layout.pad.sm }}
                    height={iconSize || layout.pad.ml}
                    type="fill"
                    color={colors.white}
                />
            }
            backgroundColor={
                showWarningDocument(documents?.cbd, customerType)
                    ? colors.danger
                    : colors.greenLantern
            }
        >
            <Text style={{ ...styles.chipText, ...chipText }}>
                {totalDocuments}/1
            </Text>
        </BChip>
    );
}

const styles = StyleSheet.create({
    chipText: {
        fontSize: fonts.size.vs,
        color: colors.offWhite,
        fontFamily: fonts.family.montserrat[400]
    }
});

export default TotalDocumentChip;
