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
