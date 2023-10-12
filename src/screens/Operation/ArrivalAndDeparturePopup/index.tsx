import crashlytics from "@react-native-firebase/crashlytics";
import * as React from "react";
import {
    Image,
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions
} from "react-native";
import Modal from "react-native-modal";

import { BSpacer, BText } from "@/components";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import EntryType from "@/models/EnumModel";
import { ARRIVAL_AND_DEPARTURE } from "@/navigation/ScreenNames";
import { resScale } from "@/utils";
import BrikLogo from "@/assets/logo/brik_logo.png";
import IcArrival from "@/assets/icon/ic_arrival.png";
import IcDeparture from "@/assets/icon/ic_departure.png";
import AntDesignIcon from "react-native-vector-icons/AntDesign";

const { height } = Dimensions.get("screen");
const styles = StyleSheet.create({
    modalContainer: { margin: 0, backgroundColor: colors.white },
    imageLogo: {
        width: resScale(70),
        height: resScale(33)
    },
    title: {
        fontFamily: font.family.montserrat[700],
        fontSize: font.size.md,
        color: "#000000"
    },
    container: {
        marginHorizontal: layout.pad.xl,
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontFamily: font.family.montserrat[400],
        fontSize: font.size.md,
        color: "#000000"
    },
    svgGroup: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between"
    },
    image: {
        width: resScale(80),
        height: resScale(80)
    },
    imageWrapper: {
        justifyContent: "center",
        alignItems: "center",
        width: 110,
        height: 110,
        borderRadius: 100,
        borderWidth: 5,
        borderColor: colors.status.yellow
    },
    imageBtnWrapper: {
        justifyContent: "center",
        alignItems: "center"
    },
    closeBtn: {
        justifyContent: "flex-end",
        marginHorizontal: layout.pad.xl,
        marginTop: layout.pad.ml,
        flexDirection: "row",
        alignItems: "center"
    }
});

interface IPressArrivalAndDeparture {
    type: EntryType.DISPATCH | EntryType.RETURN;
}

interface IArriveAndDepartPopUp {
    isVisible: boolean;
    onPressArrival: (entry: IPressArrivalAndDeparture) => void;
    onPressDeparture: (entry: IPressArrivalAndDeparture) => void;
    onClose: () => void;
}

function ArriveAndDepartPopUp({
    isVisible,
    onPressArrival,
    onPressDeparture,
    onClose
}: IArriveAndDepartPopUp) {
    const onClickDeparture = () => {
        onPressDeparture({ type: EntryType.DISPATCH });
    };
    const onClickArrival = () => {
        onPressArrival({ type: EntryType.RETURN });
    };
    React.useEffect(() => {
        crashlytics().log(ARRIVAL_AND_DEPARTURE);
    }, []);
    return (
        <Modal
            isVisible={isVisible}
            style={styles.modalContainer}
            deviceHeight={height}
        >
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <AntDesignIcon
                    name="close"
                    size={layout.pad.lg + layout.pad.sm}
                    color={colors.black}
                />
            </TouchableOpacity>
            <SafeAreaView style={styles.container}>
                <View>
                    <BText style={styles.title}>
                        Silahkan pilih tipe DO yang diinginkan
                    </BText>
                </View>

                <BSpacer size="small" />
                <View style={styles.svgGroup}>
                    <View style={styles.imageBtnWrapper}>
                        <TouchableOpacity
                            onPress={onClickDeparture}
                            style={styles.imageWrapper}
                        >
                            <Image style={styles.image} source={IcDeparture} />
                        </TouchableOpacity>
                        <BText style={styles.text}>Keberangkatan</BText>
                    </View>

                    <View style={styles.imageBtnWrapper}>
                        <TouchableOpacity
                            onPress={onClickArrival}
                            style={styles.imageWrapper}
                        >
                            <Image style={styles.image} source={IcArrival} />
                        </TouchableOpacity>
                        <BText style={styles.text}>Kedatangan</BText>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}
export default ArriveAndDepartPopUp;
