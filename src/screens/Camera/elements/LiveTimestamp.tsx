import { BSpacer } from "@/components";
import { colors, fonts } from "@/constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    videoDetail: {
        // maxWidth: 200,
        position: "absolute",
        bottom: 160,
        right: 20,
        alignItems: "flex-end"
    },
    videoDetailText: {
        fontFamily: "Roboto-Regular",
        color: colors.white,
        fontSize: fonts.size.sm,
        textAlign: "right"
    }
});

interface ILiveTimeStamp {
    currentTimestamp: string;
    currentLocation: string;
    latlong: string;
}

function LiveTimeStamp({
    currentTimestamp,
    currentLocation,
    latlong
}: ILiveTimeStamp) {
    return (
        <View style={styles.videoDetail}>
            <Text style={[styles.videoDetailText]}>{currentTimestamp}</Text>
            <BSpacer size="verySmall" />
            <Text style={[styles.videoDetailText]}>{currentLocation}</Text>
            <BSpacer size="verySmall" />
            <Text style={[styles.videoDetailText]}>{latlong}</Text>
        </View>
    );
}

export default LiveTimeStamp;
