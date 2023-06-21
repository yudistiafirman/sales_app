import crashlytics from "@react-native-firebase/crashlytics";
import { useNavigation } from "@react-navigation/native";
import debounce from "lodash.debounce";
import * as React from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MapView from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import {
    BBottomSheet,
    BContainer,
    BForm,
    BLabel,
    BLocation,
    BLocationDetail,
    BMarker,
    BSpacer
} from "@/components";
import { layout } from "@/constants";
import { Region, Input } from "@/interfaces";
import { CREATE_VISITATION, SEARCH_AREA } from "@/navigation/ScreenNames";
import {
    setSearchedAddress,
    setUseSearchedAddress,
    updateDataVisitation
} from "@/redux/reducers/VisitationReducer";
import { updateRegion } from "@/redux/reducers/locationReducer";
import { openPopUp } from "@/redux/reducers/modalReducer";
import { AppDispatch, RootState } from "@/redux/store";
import { resScale } from "@/utils";
import { hasLocationPermission } from "@/utils/permissions";
import {
    getCoordinateDetails,
    getUserCurrentLocation
} from "@/redux/async-thunks/commonThunks";

const styles = StyleSheet.create({
    container: { flex: 1, marginHorizontal: -(layout.pad.md + layout.pad.ml) },
    map: {
        flex: 1,
        width: "100%"
    },
    titleShimmer: {
        width: resScale(108),
        height: resScale(17),
        marginBottom: layout.pad.sm
    },
    secondaryTextShimmer: { width: resScale(296), height: resScale(15) }
});

function FirstStep() {
    const { region, loading } = useSelector(
        (state: RootState) => state.location
    );

    const [grantedLocationPermission, setGrantedLocationPermission] =
        React.useState(false);
    const visitationData = useSelector((state: RootState) => state.visitation);
    const { selectedBatchingPlant } = useSelector(
        (state: RootState) => state.auth
    );
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();

    const inputs: Input[] = [
        {
            label: "Detail Alamat",
            type: "area",
            isRequire: false,
            onChange: (e: string) => {
                const newLocation = { ...visitationData.locationAddress };
                newLocation.line2 = e;
                dispatch(
                    updateDataVisitation({
                        type: "locationAddress",
                        value: newLocation
                    })
                );
                dispatch(updateRegion({ ...region, line1: e }));
            },
            value: visitationData.locationAddress?.line2,
            placeholder: "contoh: Jalan Kusumadinata no 5"
        }
    ];

    // map function
    const mapRef = React.useRef<MapView>(null);

    const askingPermission = async () => {
        const granted = await hasLocationPermission();
        if (granted) {
            setGrantedLocationPermission(granted);
        }
    };

    const onMapReady = async () => {
        try {
            if (grantedLocationPermission) {
                dispatch(getUserCurrentLocation(selectedBatchingPlant.name));
            } else {
                askingPermission();
            }
        } catch (error) {
            if (error?.message !== "canceled")
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText: error?.message,
                        outsideClickClosePopUp: true
                    })
                );
        }
    };

    const onChangeRegion = async (coordinate: Region) => {
        try {
            dispatch(setUseSearchedAddress({ value: false }));
            dispatch(
                getCoordinateDetails({
                    coordinate,
                    selectedBatchingPlant: selectedBatchingPlant.name
                })
            );
        } catch (error) {
            if (error?.message !== "canceled")
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText:
                            error?.message ||
                            "Terjadi error pengambilan data saat perpindahan region",
                        outsideClickClosePopUp: true
                    })
                );
        }
    };

    const debounceResult = React.useMemo(
        () => debounce(onChangeRegion, 500),
        []
    );
    React.useEffect(() => {
        askingPermission();
        return () => {
            debounceResult.cancel();
        };
    }, []);

    React.useEffect(() => {
        crashlytics().log(`${CREATE_VISITATION}-Step1`);

        const locationAddress = {
            ...visitationData.locationAddress,
            ...region
        };

        if (visitationData.useSearchedAddress) {
            locationAddress.formattedAddress = visitationData.searchedAddress;
        }
        dispatch(
            updateDataVisitation({
                type: "locationAddress",
                value: locationAddress
            })
        );
    }, [
        region.formattedAddress,
        visitationData.createdLocation?.formattedAddress
    ]);

    React.useEffect(() => {
        onMapReady();
    }, [grantedLocationPermission]);

    React.useEffect(() => {
        DeviceEventEmitter.addListener("visitationSearchCoordinate", (data) => {
            dispatch(setUseSearchedAddress({ value: true }));
            dispatch(
                setSearchedAddress({ value: data.coordinate.formattedAddress })
            );
            onChangeRegion(data.coordinate);
        });
        return () => {
            DeviceEventEmitter.removeAllListeners("visitationSearchCoordinate");
        };
    }, [onChangeRegion]);

    const nameAddress = React.useMemo(() => {
        const address = visitationData.useSearchedAddress
            ? visitationData.searchedAddress
            : region.formattedAddress;
        const idx = address?.split(",");
        if (idx && idx?.length > 1) {
            return idx?.[0];
        }

        return "Nama Alamat";
    }, [region.formattedAddress]);

    React.useEffect(() => {
        const isExist =
            !visitationData.createdLocation?.lat ||
            visitationData.createdLocation?.lon === 0;

        if (isExist) {
            onMapReady();
        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <BLocation
                    ref={mapRef}
                    region={region}
                    onMapReady={onMapReady}
                    onRegionChangeComplete={debounceResult}
                    CustomMarker={<BMarker />}
                    mapStyle={styles.map}
                />
            </View>
            <View style={{ flex: 1 }}>
                <BBottomSheet
                    handleIndicatorStyle={{ display: "none" }}
                    backgroundStyle={{
                        borderTopEndRadius: layout.radius.lg,
                        borderTopStartRadius: layout.radius.lg
                    }}
                    percentSnapPoints={["100%"]}
                >
                    <ScrollView>
                        <BContainer
                            paddingHorizontal={layout.pad.lg}
                            paddingVertical={layout.pad.zero}
                        >
                            <BLabel
                                bold="500"
                                label="Alamat Proyek"
                                isRequired
                            />
                            <BSpacer size="verySmall" />
                            <BLocationDetail
                                nameAddress={nameAddress}
                                isLoading={loading === "pending"}
                                formattedAddress={
                                    visitationData.useSearchedAddress
                                        ? visitationData.searchedAddress
                                        : region.formattedAddress
                                }
                                onPress={() =>
                                    navigation.navigate(SEARCH_AREA, {
                                        from: CREATE_VISITATION,
                                        eventKey: "visitationSearchCoordinate"
                                    })
                                }
                            />
                            <BSpacer size="medium" />
                            <BForm titleBold="500" inputs={inputs} />
                        </BContainer>
                    </ScrollView>
                </BBottomSheet>
            </View>
        </View>
    );
}

export default FirstStep;
