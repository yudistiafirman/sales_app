import Config from 'react-native-config';
const production = false;
const PRODUCTION = production;
const API_URL = PRODUCTION
  ? Config.API_URL_ORDER_PROD
  : Config.API_URL_ORDER_DEV;

export default class BrikApiOrder {
  static orderSphPost = () => {
    const url = new URL(`${API_URL}/order/m/flow/quotation`);
    return url.toString();
  };
}
