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

export const postSph = async (payload: sphOrderPayloadType) => {
  console.log(payload, 'payload sebelum request');

  return request(
    // 'http://192.168.18.23:3004/order/m/flow/quotation',
    BrikApiOrder.orderSphPost(),
    await getOptions('POST', payload, true)
  );
};
