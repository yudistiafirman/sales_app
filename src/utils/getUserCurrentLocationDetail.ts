import Geolocation from 'react-native-geolocation-service';
import { getLocationCoordinates } from '../actions/CommonActions';

const getUserCurrentLocationDetail = async () => {
  try {
    const currentCoordinate = await getUserCurrentCoordinate();
    if (currentCoordinate) {
      const { coords } = currentCoordinate;
      const coordinate = coords;
      const coordinateDetails = await getCoordinateDetail({ coordinate });
      return coordinateDetails;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getUserCurrentCoordinate = async () => {
  try {
    const opt = {
      showLocationDialog: true,
      forceRequestLocation: true,
    };
    const position = await new Promise((resolve, error) => {
      return Geolocation.getCurrentPosition(resolve, error, opt);
    });
    return position;
  } catch (error) {
    throw new Error(error);
  }
};

const getCoordinateDetail = async ({
  coordinate,
}: {
  coordinate: { latitude: number; longitude: number };
}) => {
  try {
    const { latitude, longitude } = coordinate;
    const { data } = await getLocationCoordinates(
      // '',
      longitude,
      latitude,
      'BP-LEGOK'
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export default getUserCurrentLocationDetail;
