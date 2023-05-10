import React from "react";
import { Image, StyleSheet, TextStyle, View } from "react-native";
import Modal from "react-native-modal";
import colors from "@/constants/colors";
import font from "@/constants/fonts";
import resScale from "@/utils/resScale";
import BButtonPrimary from "../atoms/BButtonPrimary";
import BText from "../atoms/BText";
import { fonts, layout } from "@/constants";

interface BAlertProps {
  isVisible: boolean;
  content: string;
  type: "warning" | "success";
  contentStyle?: TextStyle;
  onClose?: () => void;
}

const BAlertDefaultContentStyle: TextStyle = {
  fontFamily: font.family.montserrat[600],
  fontSize: fonts.size.lg,
  textAlign: "center",
  marginBottom: layout.pad.xl + layout.pad.xs,
};

const BalertDefaultProps = {
  type: "warning",
  content:
    "Pengiriman tidak dapat dilakukan karena jarak Batching Plant dengan lokasi Anda lebih dari 40km.",
  contentStyle: BAlertDefaultContentStyle,
};

function BAlert({
  isVisible,
  content,
  type,
  contentStyle,
  onClose,
}: BAlertProps & typeof BalertDefaultProps) {
  const warningIcon = require("@/assets/icon/ic_warning.png");
  const successIcon = require("@/assets/icon/ic_success.png");

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.alertOuterContainer}>
          <View style={styles.alertContainer}>
            <Image
              source={type === "warning" ? warningIcon : successIcon}
              style={styles.image}
            />
            <BText style={contentStyle}>{content}</BText>
            {type === "warning" && (
              <BButtonPrimary
                onPress={onClose}
                isOutline
                buttonStyle={{ padding: layout.pad.md + layout.pad.ml }}
                title="Saya Mengerti"
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

BAlert.defaultProps = BalertDefaultProps;

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: "center",
    flex: 1,
  },
  alertOuterContainer: {
    flex: 1,
    justifyContent: "center",
  },
  alertContainer: {
    paddingVertical: layout.pad.sm + layout.pad.lg,
    paddingHorizontal: layout.pad.lg,
    alignItems: "center",
    minHeight: resScale(160),
    borderRadius: layout.radius.md,
    backgroundColor: colors.white,
  },
  image: {
    width: resScale(66),
    height: resScale(66),
    marginBottom: layout.pad.xl,
  },
  content: {},
});

export default BAlert;
