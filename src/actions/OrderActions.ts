import BrikApiOrder from '@/brikApi/BrikApiOrder';
import { customRequest } from '@/networking/request';
import { sphOrderPayloadType } from '@/interfaces';
import { customLog } from '@/utils/generalFunc';

export const getTransactionTab = async () => {
  return customRequest(BrikApiOrder.transactionTab(), 'GET', undefined, true);
};

export const getAllVisitationOrders = async () => {
  return customRequest(
    BrikApiOrder.getAllVisitationOrders(),
    'GET',
    undefined,
    true
  );
};

export const getAllPurchaseOrders = async () => {
  return customRequest(BrikApiOrder.purchaseOrder(), 'GET', undefined, true);
};

export const getPurchaseOrderByID = async (id: string) => {
  return customRequest(
    BrikApiOrder.getPurchaseOrderByID(id),
    'GET',
    undefined,
    true
  );
};

export const getAllDeposits = async () => {
  return customRequest(BrikApiOrder.deposit(), 'GET', undefined, true);
};

export const getDepositByID = async (id: string) => {
  return customRequest(BrikApiOrder.getDepositByID(id), 'GET', undefined, true);
};

export const getAllSchedules = async () => {
  return customRequest(BrikApiOrder.schedule(), 'GET', undefined, true);
};

export const getScheduleByID = async (id: string) => {
  return customRequest(
    BrikApiOrder.getScheduleByID(id),
    'GET',
    undefined,
    true
  );
};

export const getAllFinishedDeliveryOrders = async () => {
  return customRequest(
    BrikApiOrder.deliveryOrder('FINISHED'),
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
