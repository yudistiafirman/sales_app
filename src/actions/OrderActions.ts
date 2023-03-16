import BrikApiOrder from '@/brikApi/BrikApiOrder';
import { customRequest } from '@/networking/request';
import { sphOrderPayloadType } from '@/interfaces';
import { customLog } from '@/utils/generalFunc';

export const getAllVisitationOrders = async (page?: string, size?: string) => {
  return customRequest(
    BrikApiOrder.getAllVisitationOrders(page, size),
    'GET',
    undefined,
    true
  );
};

export const getAllPurchaseOrders = async () => {
  return customRequest(
    BrikApiOrder.getAllPurchaseOrders(),
    'GET',
    undefined,
    true
  );
};

export const getVisitationOrderByID = async (id: string) => {
  return customRequest(
    BrikApiOrder.getVisitationOrderByID(id),
    'GET',
    undefined,
    true
  );
};

export const getPurchaseOrderByID = async (id: string) => {
  return customRequest(
    BrikApiOrder.getPurchaseOrderByID(id),
    'GET',
    undefined,
    true
  );
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

export const postPurchaseOrder = async (payload) => {
  return customRequest(BrikApiOrder.postPurchaseOrder(), 'POST', payload, true);
};

export const postDeposit = async (payload) => {
  return customRequest(BrikApiOrder.postDeposit(), 'POST', payload, true);
};

export const postSchedule = async (payload) => {
  return customRequest(BrikApiOrder.postSchedule(), 'POST', payload, true);
};

export const getConfirmedPurchaseOrder = async (page: string, size: string, searchQuery: string, productPo = '1') => {
  return customRequest(BrikApiOrder.getConfirmedPurchaseOrder(page, size, searchQuery, productPo), 'GET', undefined, true)
}
