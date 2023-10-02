import { layout } from "@/constants";
import { openSnackbar } from "@/redux/reducers/snackbarReducer";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { createThumbnail } from "react-native-create-thumbnail";
import { useDispatch } from "react-redux";

const style = StyleSheet.create({
    imageStyle: {
        borderRadius: layout.radius.md,
        width: "100%",
        height: "100%"
    }
});

export default function BThumnail({ videoUri }: { videoUri: string }) {
    const [thumbnailUri, setThumbnailUri] = useState<null | string>(null);

    const dispatch = useDispatch();

    const createThumbnailFromVideo = () => {
        createThumbnail({
            url: videoUri,
            timeStamp: 10000
        })
            .then((response) => {
                setThumbnailUri(response.path);
            })
            .catch((err) => {
                dispatch(
                    openSnackbar({
                        snackBarText: `error: BThumbnail message:${err.message}`,
                        isSuccess: false
                    })
                );
            });
    };

    useEffect(() => {
        createThumbnailFromVideo();
    }, [videoUri]);

    if (thumbnailUri === null) {
        return <View />;
    }

    return (
        <Image
            source={{
                uri: thumbnailUri
            }}
            style={[
                style.imageStyle,
                {
                    resizeMode: "cover"
                }
            ]}
        />
    );
}
