import BrikApiOrder from '@/brikApi/BrikApiOrder';
import { customRequest } from '@/networking/request';
import { sphOrderPayloadType } from '@/interfaces';
import { customLog } from '@/utils/generalFunc';

export const getTransactionTab = async () => {
  return customRequest(BrikApiOrder.transactionTab(), 'GET', undefined, true);
};

export const getAllVisitationOrders = async (page?: string, size?: string) => {
  return customRequest(
    BrikApiOrder.getAllVisitationOrders(page, size),
    'GET',
    undefined,
    true
  );
};

export const getAllPurchaseOrders = async (page?: string, size?: string) => {
  return customRequest(
    BrikApiOrder.purchaseOrder(page, size),
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

export const getAllDeposits = async (page?: string, size?: string) => {
  return customRequest(
    BrikApiOrder.deposit(page, size),
    'GET',
    undefined,
    true
  );
};

export const getDepositByID = async (id: string) => {
  return customRequest(BrikApiOrder.getDepositByID(id), 'GET', undefined, true);
};

export const getAllSchedules = async (page?: string, size?: string) => {
  return customRequest(
    BrikApiOrder.schedule(page, size),
    'GET',
    undefined,
    true
  );
};

export const getScheduleByID = async (id: string) => {
  return customRequest(
    BrikApiOrder.getScheduleByID(id),
    'GET',
    undefined,
    true
  );
};

export const getAllDeliveryOrders = async (
  status?: string,
  size?: string,
  page?: string
) => {
  return customRequest(
    BrikApiOrder.deliveryOrder(status, page, size),
    'GET',
    undefined,
    true
  );
};

export const getDeliveryOrderByID = async (id: string) => {
  return customRequest(
    BrikApiOrder.getDeliveryOrderByID(id),
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
  return customRequest(BrikApiOrder.purchaseOrder(), 'POST', payload, true);
};

export const postDeposit = async (payload) => {
  return customRequest(BrikApiOrder.deposit(), 'POST', payload, true);
};

export const postSchedule = async (payload) => {
  return customRequest(BrikApiOrder.schedule(), 'POST', payload, true);
};

export const getConfirmedPurchaseOrder = async (
  page: string,
  size: string,
  searchQuery: string,
  productPo = '1'
) => {
  return customRequest(
    BrikApiOrder.getConfirmedPurchaseOrder(page, size, searchQuery, productPo),
    'GET',
    undefined,
    true
  );
};
