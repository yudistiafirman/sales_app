import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import {
    BText,
    BHeaderIcon,
    BButtonPrimary,
    BVisitationCard
} from "@/components";
import BProjectRBtnList from "@/components/organism/BProjectRBtnList";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import { DataCompany } from "@/redux/reducers/appointmentReducer";

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
    modalContainer: { margin: 0, justifyContent: "flex-end" },
    contentOuterContainer: {
        backgroundColor: colors.white,
        borderTopStartRadius: layout.radius.lg,
        borderTopEndRadius: layout.radius.lg
    },
    contentInnerContainer: { flex: 1, marginHorizontal: layout.pad.lg },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 0.15
    },
    headerTitle: {
        fontFamily: font.family.montserrat[700],
        fontSize: font.size.lg
    },
    addProjectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    companyDetailsCardWrapper: { flex: 0.25 },
    projectNameListContainer: { flex: 0.3, paddingTop: layout.pad.lg },
    notFoundProjectText: {
        fontFamily: font.family.montserrat[400],
        fontSize: font.size.md,
        color: colors.text.medium
    },
    addProjectButton: { borderRadius: layout.radius.sm },
    addProjectBtnText: { fontFamily: font.family.montserrat[400] },
    chooseBtn: {
        position: "absolute",
        width: "100%",
        top: layout.pad.xl + layout.pad.lg
    }
});

interface BSheetCompanyProps {
    isVisible: boolean;
    dataCompany: DataCompany | null;
    onChoose: (data?: DataCompany) => void;
    onChooseProject: (data?: DataCompany) => void;
    onCloseModal: () => void;
    onSelect: (index: number) => void;
}

function BottomSheetCompany({
    onChoose,
    isVisible,
    onChooseProject,
    dataCompany,
    onCloseModal,
    onSelect
}: BSheetCompanyProps) {
    const onChooseProjectCheck = onChooseProject || null;
    const onChooseCheck = onChoose || null;
    return (
        <Modal
            deviceHeight={height}
            isVisible={isVisible}
            style={styles.modalContainer}
        >
            <View
                style={[styles.contentOuterContainer, { height: height / 1.6 }]}
            >
                <View style={styles.contentInnerContainer}>
                    <View style={styles.headerContainer}>
                        <BText style={styles.headerTitle}>Pilih Proyek</BText>
                        <BHeaderIcon
                            onBack={onCloseModal}
                            size={layout.pad.lg}
                            marginRight={0}
                            iconName="x"
                        />
                    </View>
                    <View style={styles.companyDetailsCardWrapper}>
                        <BVisitationCard
                            item={{
                                name: dataCompany?.name,
                                location: dataCompany?.location
                            }}
                            isRenderIcon={false}
                        />
                    </View>
                    <View style={styles.projectNameListContainer}>
                        <BProjectRBtnList
                            onSelect={onSelect}
                            isOption={
                                dataCompany?.project &&
                                dataCompany?.project?.length > 1
                            }
                            data={dataCompany?.project}
                        />
                    </View>
                    <View style={styles.addProjectContainer}>
                        <BText style={styles.notFoundProjectText}>
                            Tidak Menemukan Proyek?
                        </BText>
                        <BButtonPrimary
                            onPress={() =>
                                onChooseProjectCheck !== null &&
                                onChooseProjectCheck()
                            }
                            buttonStyle={styles.addProjectButton}
                            titleStyle={styles.addProjectBtnText}
                            isOutline
                            title="Tambah Proyek"
                        />
                    </View>
                    <BButtonPrimary
                        buttonStyle={styles.chooseBtn}
                        onPress={() =>
                            onChooseCheck !== null && onChooseCheck()
                        }
                        title="Pilih"
                    />
                </View>
            </View>
        </Modal>
    );
}

export default BottomSheetCompany;
