import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BText } from "@/components";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import { resScale } from "@/utils";

function UpdatedAddressWrapper({
  address,
  onPress,
}: {
  address: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.filledAddressContainer}>
      <View style={styles.filledAddressInnerContainer}>
        <BText numberOfLines={1} style={styles.mainAddress}>
          {address.split(",")[0]}
        </BText>
        <BText numberOfLines={1} style={styles.secondAddress}>
          {address}
        </BText>
        <TouchableOpacity onPress={onPress} style={styles.changeAddressBtn}>
          <BText style={styles.changeAddressText}>Ubah Alamat</BText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filledAddressContainer: {
    height: resScale(93),
    backgroundColor: colors.tertiary,
    borderRadius: layout.radius.md,
    width: "100%",
  },
  filledAddressInnerContainer: {
    flex: 1,
    marginVertical: layout.pad.ml,
    marginLeft: layout.pad.lg,
  },
  mainAddress: {
    fontFamily: font.family.montserrat[500],
    fontSize: font.size.md,
    color: colors.text.darker,
    marginBottom: layout.pad.sm,
  },
  secondAddress: {
    fontFamily: font.family.montserrat[300],
    fontSize: font.size.xs,
    color: colors.text.darker,
    marginBottom: layout.pad.md,
  },
  changeAddressBtn: {
    width: resScale(104),
    height: resScale(24),
    borderWidth: 1,
    borderColor: colors.textInput.placeHolder,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: layout.radius.sm,
  },
  changeAddressText: {
    fontFamily: font.family.montserrat[400],
    fontSize: font.size.sm,
    color: colors.text.medium,
  },
});

export default UpdatedAddressWrapper;
