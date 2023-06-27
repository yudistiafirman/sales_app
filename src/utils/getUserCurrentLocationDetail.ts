import Geolocation from "react-native-geolocation-service";
import { GenericAbortSignal } from "axios";
import { BatchingPlant } from "@/models/BatchingPlant";
import { getLocationCoordinates } from "../actions/CommonActions";

const getUserCurrentCoordinate = async () => {
    try {
        const opt = {
            showLocationDialog: true,
            forceRequestLocation: true
        };
        const position = await new Promise((resolve, error) =>
            Geolocation.getCurrentPosition(resolve, error, opt)
        );
        return position;
    } catch (error) {
        throw new Error(error);
    }
};

const getCoordinateDetail = async ({
    coordinate,
    signal,
    selectedBatchingPlant
}: {
    coordinate: { latitude: number; longitude: number };
    signal: GenericAbortSignal;
    selectedBatchingPlant: BatchingPlant;
}) => {
    try {
        const { latitude, longitude } = coordinate;
        const { data } = await getLocationCoordinates(
            // '',
            longitude,
            latitude,
            selectedBatchingPlant?.name,
            signal
        );
        return data;
    } catch (error) {
        throw new Error(error);
    }
};

const getUserCurrentLocationDetail = async (
    signal: GenericAbortSignal,
    selectedBatchingPlant: BatchingPlant
) => {
    try {
        const currentCoordinate = await getUserCurrentCoordinate();
        if (currentCoordinate) {
            const { coords } = currentCoordinate;
            const coordinate = coords;
            const coordinateDetails = await getCoordinateDetail({
                coordinate,
                signal,
                selectedBatchingPlant
            });
            return coordinateDetails;
        }
        return undefined;
    } catch (error) {
        throw new Error(error);
    }
};

export default getUserCurrentLocationDetail;
