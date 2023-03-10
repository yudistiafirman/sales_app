import BrikApiOrder from '@/brikApi/BrikApiOrder';
import { customRequest } from '@/networking/request';
import { sphOrderPayloadType } from '@/interfaces';
import { customLog } from '@/utils/generalFunc';

export const getAllVisitationOrders = async () => {
  return customRequest(BrikApiOrder.getAllVisitationOrders(), 'GET', undefined, true);
};

export const getAllPOOrders = async () => {
  return customRequest(BrikApiOrder.getAllPOOrders(), 'GET', undefined, true);
};

export const getVisitationOrderByID = async (id: string) => {
  return customRequest(BrikApiOrder.getVisitationOrderByID(id), 'GET', undefined, true);
};

export const getPOOrderByID = async (id: string) => {
  return customRequest(BrikApiOrder.getPOOrderByID(id), 'GET', undefined, true);
};

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
