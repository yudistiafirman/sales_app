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

export const getSphByProject = async (searchQuery: string) => {
  return customRequest(
    BrikApiOrder.getSphByProject(searchQuery),
    'GET',
    undefined,
    true
  );
};

export const getCreatedSphDocuments = async (id: string) => {
  return customRequest(
    BrikApiOrder.getSphDocuments(id),
    'GET',
    undefined,
    true
  );
};

export const postPurchaseOrder = async (payload) => {
  return customRequest(BrikApiOrder.postPurchaseOrder(), 'POST',payload, true);
};
