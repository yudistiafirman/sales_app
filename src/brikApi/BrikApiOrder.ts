import { production } from '../../app.json';
import Config from 'react-native-config';
import moment from 'moment';
const PRODUCTION = production;
const API_URL = PRODUCTION
  ? Config.API_URL_ORDER_PROD
  : Config.API_URL_ORDER_DEV;

export default class BrikApiOrder {
  static getAllOrders = () => {
    const url = new URL(`${API_URL}/order/m/flow/quotation-letter`);
    return url.toString();
  };

  static getOrderByID = (id: string) => {
    const url = new URL(`${API_URL}/order/m/flow/quotation-letter/${id}`);
    return url.toString();
  };

  static orderSphPost = () => {
    const url = new URL(`${API_URL}/order/m/flow/quotation`);
    return url.toString();
  };
}
