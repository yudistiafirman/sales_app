import BrikApiOrder from '@/brikApi/BrikApiOrder';
import { getOptions, request } from '@/networking/request';

export const getAllOrders = async () => {
  return request(
    BrikApiOrder.getAllOrders(),
    await getOptions('GET', undefined, true)
  );
};

export const getOrderByID = async (id: string) => {
  return request(
    BrikApiOrder.getOrderByID(id),
    await getOptions('GET', undefined, true)
  );
};
import { sphOrderPayloadType } from '@/interfaces';
import { customLog } from '@/utils/generalFunc';

export const postSph = async (payload: sphOrderPayloadType) => {
  customLog(payload, 'payload sebelum request');

  return request(
    // 'https://fe83-182-253-87-113.ap.ngrok.io/order/m/flow/quotation',
    BrikApiOrder.orderSphPost(),
    await getOptions('POST', payload, true)
  );
};
