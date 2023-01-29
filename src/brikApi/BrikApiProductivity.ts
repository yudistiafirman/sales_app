import { production } from '../../app.json';
import Config from 'react-native-config';
const PRODUCTION = production;
const API_URL = PRODUCTION
  ? Config.API_URL_PRODUCTIVITY_PROD
  : Config.API_URL_PRODUCTIVITY_DEV;

type getVisitationsType = {
  month?: number;
  year?: number;
};

export default class BrikApiProductivity {
  static visitations = ({ month, year }: getVisitationsType) => {
    const url = new URL(`${API_URL}/productivity/m/flow/visitation`);
    const params = url.searchParams;

    if (month) {
      params.append('month', month.toString());
    }
    if (year) {
      params.append('year', year.toString());
    }

    return url.toString();
  };
}
