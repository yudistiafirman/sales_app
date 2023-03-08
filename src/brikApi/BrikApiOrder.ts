import Config from 'react-native-config';
const API_URL = Config.API_URL_ORDER;

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

  static getSphByProject = (searchQuery: string) => {
    const url = new URL(`${API_URL}/order/m/project-sph`);
    const params = url.searchParams;
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    return url.toString();
  };

  static getSphDocuments = (id: string) => {
    const url = new URL(`${API_URL}/order/m/sph/${id}`);
    return url.toString();
  };
}
