import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "@/constants";
import resScale from "@/utils/resScale";

function BMarker() {
  return (
    <View style={styles.markerFixed}>
      <Image
        style={{
          width: resScale(40),
          height: resScale(40),
        }}
        source={require("@/assets/icon/ic_marker.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  markerFixed: {
    position: "absolute",
    width: resScale(129),
    height: resScale(129),
    borderRadius: resScale(129),
    backgroundColor: `${colors.primary}40`,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BMarker;
