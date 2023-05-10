import { Platform } from "react-native";
import moment from "moment";
import Config from "react-native-config";

const API_URL =
  Platform.OS === "android"
    ? Config.API_URL_PRODUCTIVITY
    : __DEV__
    ? Config.API_URL_PRODUCTIVITY
    : Config.API_URL_PRODUCTIVITY_PROD;

type getVisitationsType = {
  month?: number;
  year?: number;
};

interface IGetAll {
  date?: number;
  page: number;
  search?: string;
  projectId?: string;
}

type getOneVisitationType = {
  visitationId: string;
};

export default class BrikApiProductivity {
  static visitations = (props?: getVisitationsType) => {
    const url = new URL(`${API_URL}/productivity/m/flow/visitation`);
    if (props) {
      const params = url.searchParams;
      const { month, year } = props;
      if (month) {
        params.append("month", month.toString());
      }
      if (year) {
        params.append("year", year.toString());
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
  }: IGetAll) => {
    const url = new URL(`${API_URL}/productivity/m/flow/all-visitation`);
    const params = url.searchParams;

    if (date) {
      params.append("date", date.toString());
    }
    if (projectId) {
      params.append("projectId", projectId);
    }
    if (page) {
      params.append("page", page.toString());
    }
    if (search) {
      params.append("search", search);
    }
    params.append("size", "10");

    return url.toString();
  };

  static getTarget = () => {
    const url = new URL(`${API_URL}/productivity/m/flow/completed-visitation`);

    const params = url.searchParams;
    params.append("date", moment().valueOf().toString());

    return url.toString();
  };

  static visitationIdPath = ({ visitationId }: getOneVisitationType) => {
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
