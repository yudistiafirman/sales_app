import {
    StackActions,
    useNavigation,
    useRoute
} from "@react-navigation/native";
import * as React from "react";
import { DeviceEventEmitter, SafeAreaView, View } from "react-native";
import { BButtonPrimary, BLocation, BMarker, BSpacer } from "@/components";
import { useMachine } from "@xstate/react";
import locationMachine from "@/machine/locationMachine";
import { Region } from "react-native-maps";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import {
    PROJECT_DETAIL,
    LOCATION,
    LOCATION_TITLE,
    SEARCH_AREA,
    SPH,
    TAB_DISPATCH_TITLE,
    TAB_HOME_TITLE,
    TAB_RETURN_TITLE,
    TAB_PRICE_LIST_TITLE,
    TAB_PROFILE_TITLE,
    TAB_ROOT,
    TAB_TRANSACTION_TITLE
} from "@/navigation/ScreenNames";
import useHeaderTitleChanged from "@/hooks/useHeaderTitleChanged";
import { resScale } from "@/utils";
import crashlytics from "@react-native-firebase/crashlytics";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import CoordinatesDetail from "./elements/CoordinatesDetail";
import LocationStyles from "./styles";

function Location() {
    const navigation = useNavigation();
    const route = useRoute<RootStackScreenProps>();
    const [searchedAddress, setSearchedAddress] = React.useState("");
    const [useSearchedAddress, setUseSearchedAddress] = React.useState(false);
    const [state, send] = useMachine(locationMachine);
    const authState = useSelector((rootState: RootState) => rootState.auth);
    const isReadOnly = route?.params.isReadOnly;
    const abortControllerRef = React.useRef<AbortController>(
        new AbortController()
    );

    useHeaderTitleChanged({
        title: isReadOnly === true ? "Lihat Area Proyek" : LOCATION_TITLE,
        selectedBP: authState.selectedBatchingPlant,
        hideBPBadges: true
    });

    React.useEffect(() => {
        crashlytics().log(LOCATION);
        if (route?.params) {
            const { params } = route;
            const { latitude, longitude, formattedAddress } = params.coordinate;
            if (formattedAddress) {
                setSearchedAddress(formattedAddress);
            }

            setUseSearchedAddress(true);
            send("sendingCoorParams", {
                value: { latitude, longitude },
                selectedBP: authState.selectedBatchingPlant
            });
        }
    }, [route?.params]);

    const onRegionChangeComplete = (coordinate: Region) => {
        const { latitude, longitude, latitudeDelta, longitudeDelta } =
            coordinate;
        if (isReadOnly === false) {
            abortControllerRef.current.abort();
            if (abortControllerRef.current.signal.aborted)
                abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;
            send("onChangeRegion", {
                value: {
                    latitude,
                    longitude,
                    latitudeDelta,
                    longitudeDelta,
                    signal
                },
                selectedBP: authState.selectedBatchingPlant
            });
        }
    };
    const { region, locationDetail, loadingLocation } = state.context;
    const onSaveLocation = () => {
        const { lon, lat, formattedAddress, postalId } = locationDetail;
        const from = route?.params?.from;
        const eventKey = route?.params?.eventKey;
        const sourceType = route?.params?.sourceType;
        const coordinate = {
            longitude: Number(lon),
            latitude: Number(lat),
            formattedAddress: route?.params?.coordinate?.formattedAddress
                ? route?.params?.coordinate?.formattedAddress
                : formattedAddress,
            postalId
        };

        if (
            from === TAB_PRICE_LIST_TITLE ||
            from === TAB_TRANSACTION_TITLE ||
            from === TAB_PROFILE_TITLE ||
            from === TAB_HOME_TITLE ||
            from === TAB_RETURN_TITLE ||
            from === TAB_DISPATCH_TITLE ||
            from === SPH ||
            from === PROJECT_DETAIL
        ) {
            if (eventKey) {
                if (sourceType) {
                    DeviceEventEmitter.emit(eventKey, {
                        coordinate,
                        sourceType
                    });
                } else {
                    DeviceEventEmitter.emit(eventKey, {
                        coordinate
                    });
                }
                navigation.dispatch(StackActions.pop(2));
            } else {
                navigation.navigate(TAB_ROOT, {
                    screen: from,
                    params: { coordinate }
                });
            }
        } else {
            navigation?.setParams({
                coordinate,
                isReadOnly: route?.params?.isReadOnly,
                from
            });
            navigation.goBack();
        }
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BLocation
                onRegionChangeComplete={onRegionChangeComplete}
                onRegionChange={() => setUseSearchedAddress(false)}
                region={region}
                scrollEnabled={isReadOnly !== true}
                CustomMarker={<BMarker />}
            />
            <View
                style={[
                    LocationStyles.bottomSheetContainer,
                    isReadOnly === true && { minHeight: resScale(80) }
                ]}
            >
                <CoordinatesDetail
                    loadingLocation={loadingLocation}
                    address={
                        useSearchedAddress && searchedAddress.length > 0
                            ? searchedAddress
                            : locationDetail?.formattedAddress
                            ? locationDetail?.formattedAddress
                            : ""
                    }
                    onPress={() =>
                        navigation.navigate(SEARCH_AREA, {
                            from: route?.params?.from
                        })
                    }
                    disable={isReadOnly === true}
                />

                {isReadOnly === false && (
                    <>
                        <BButtonPrimary
                            buttonStyle={LocationStyles.buttonStyles}
                            onPress={onSaveLocation}
                            title="Simpan"
                        />
                        <BSpacer size="extraSmall" />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

export default Location;
