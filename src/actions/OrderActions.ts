import BrikApiOrder from '@/brikApi/BrikApiOrder';
import { customRequest } from '@/networking/request';

export const getAllOrders = async () => {
  return customRequest(BrikApiOrder.getAllOrders(), 'GET', undefined, true);
};

export const getOrderByID = async (id: string) => {
  return customRequest(BrikApiOrder.getOrderByID(id), 'GET', undefined, true);
};
import { sphOrderPayloadType } from '@/interfaces';
import { customLog } from '@/utils/generalFunc';

export const postSph = async (payload: sphOrderPayloadType) => {
  customLog(payload, 'payload sebelum request');

  return customRequest(BrikApiOrder.orderSphPost(), 'POST', payload, true);
};
