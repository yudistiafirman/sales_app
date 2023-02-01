import { production } from '../../app.json';
import Config from 'react-native-config';
import moment from 'moment';
const PRODUCTION = production;
const API_URL = PRODUCTION
  ? Config.API_URL_PRODUCTIVITY_PROD
  : Config.API_URL_PRODUCTIVITY_DEV;

type getVisitationsType = {
  month?: number;
  year?: number;
};

interface IGetAll {
  date?: number;
  page: number;
  search?: string;
}

export default class BrikApiProductivity {
  static visitations = (props?: getVisitationsType) => {
    const url = new URL(`${API_URL}/productivity/m/flow/visitation`);
    if (props) {
      const params = url.searchParams;
      const { month, year } = props;
      if (month) {
        params.append('month', month.toString());
      }
      if (year) {
        params.append('year', year.toString());
      }
    }

    return url.toString();
  };

  // homescreen
  static getAllVisitations = ({ date, page = 0, search = '' }: IGetAll) => {
    const url = new URL(`${API_URL}/productivity/m/flow/all-visitation`);
    const params = url.searchParams;

    if (date) {
      params.append('date', date.toString());
    }

    params.append('page', page.toString());
    params.append('search', search);
    params.append('size', '10');

    return url.toString();
  };

  static getTarget = () => {
    const url = new URL(`${API_URL}/productivity/m/flow/completed-visitation`);

    const params = url.searchParams;
    params.append('date', moment().valueOf().toString());

    return url.toString();
  };
}
