import moment from "moment";
import { Platform } from "react-native";
import Config from "react-native-config";

const API_URL =
    Platform.OS === "android"
        ? Config.API_URL_PRODUCTIVITY
        : __DEV__
        ? Config.API_URL_PRODUCTIVITY
        : Config.API_URL_PRODUCTIVITY_PROD;

type GetVisitationsType = {
    month?: number;
    year?: number;
    batchingPlantId?: string;
};

interface IGetAll {
    date?: number;
    page: number;
    search?: string;
    projectId?: string;
    batchingPlantId?: string;
}

type GetOneVisitationType = {
    visitationId: string;
};

export default class BrikApiProductivity {
    static visitations = (props?: GetVisitationsType) => {
        const url = new URL(`${API_URL}/productivity/m/flow/visitation`);
        if (props) {
            const params = url.searchParams;
            const { month, year, batchingPlantId } = props;
            if (month) {
                params.append("month", month.toString());
            }
            if (year) {
                params.append("year", year.toString());
            }
            if (batchingPlantId) {
                params.append("batchingPlantId", batchingPlantId?.toString());
            }
        }

        return url.toString();
    };

    // homescreen
    static getAllVisitations = ({
        date,
        page = 1,
        search = "",
        projectId,
        batchingPlantId
    }: IGetAll) => {
        const url = new URL(`${API_URL}/productivity/m/flow/all-visitation`);
        const params = url.searchParams;

        if (date) {
            params.append("date", date?.toString());
        }
        if (projectId) {
            params.append("projectId", projectId);
        }
        if (page) {
            params.append("page", page?.toString());
        }
        if (search) {
            params.append("search", search);
        }
        if (batchingPlantId) {
            params.append("batchingPlantId", batchingPlantId);
        }
        params.append("size", "10");

        return url.toString();
    };

    static getTarget = (batchingPlantId?: string) => {
        const url = new URL(
            `${API_URL}/productivity/m/flow/completed-visitation`
        );

        const params = url.searchParams;
        if (batchingPlantId) {
            params.append("batchingPlantId", batchingPlantId.toString());
        }
        params.append("date", moment().valueOf().toString());

        return url.toString();
    };

    static visitationIdPath = ({ visitationId }: GetOneVisitationType) => {
        const url = new URL(
            `${API_URL}/productivity/m/flow/visitation/${visitationId}`
        );

        return url.toString();
    };

    static bookingAppointment = () => {
        const url = new URL(`${API_URL}/productivity/m/flow/visitation-book`);
        return url.toString();
    };
}
