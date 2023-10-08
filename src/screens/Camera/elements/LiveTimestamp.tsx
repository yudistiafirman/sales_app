import { BSpacer } from "@/components";
import { colors, fonts } from "@/constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    videoDetail: {
        position: "absolute",
        right: 20
    },
    videoDetailText: {
        fontFamily: fonts.family.montserrat["500"],
        color: colors.white,
        fontSize: fonts.size.sm
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
            <BSpacer size="extraSmall" />
            <Text style={styles.videoDetailText}>{currentTimestamp}</Text>
            <BSpacer size="extraSmall" />
            <Text style={styles.videoDetailText}>{currentLocation}</Text>
            <BSpacer size="extraSmall" />
            <Text style={styles.videoDetailText}>{latlong}</Text>
        </View>
    );
}

export default LiveTimeStamp;
