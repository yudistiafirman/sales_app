import BrikApiOrder from "@/brikApi/BrikApiOrder";
import { sphOrderPayloadType } from "@/interfaces";
import { UploadSOSigned } from "@/models/SOSigned";
import { UpdateDeliverOrder } from "@/models/updateDeliveryOrder";
import { customRequest } from "@/networking/request";

export const getTransactionTab = async () =>
    customRequest(BrikApiOrder.transactionTab(), "GET", undefined, true);

export const getAllVisitationOrders = async (page?: string, size?: string) =>
    customRequest(
        BrikApiOrder.getAllVisitationOrders(page, size),
        "GET",
        undefined,
        true
    );

export const getAllPurchaseOrders = async (
    page?: string,
    size?: string,
    searchQuery?: string,
    status?: string
) =>
    customRequest(
        BrikApiOrder.purchaseOrder(page, size, searchQuery, status),
        "GET",
        undefined,
        true
    );

export const getPurchaseOrderByID = async (id: string) =>
    customRequest(
        BrikApiOrder.getPurchaseOrderByID(id),
        "GET",
        undefined,
        true
    );

export const getAllDeposits = async (page?: string, size?: string) =>
    customRequest(BrikApiOrder.deposit(page, size), "GET", undefined, true);

export const getDepositByID = async (id: string) =>
    customRequest(BrikApiOrder.getDepositByID(id), "GET", undefined, true);

export const getAllSchedules = async (page?: string, size?: string) =>
    customRequest(BrikApiOrder.schedule(page, size), "GET", undefined, true);

export const getScheduleByID = async (id: string) =>
    customRequest(BrikApiOrder.getScheduleByID(id), "GET", undefined, true);

export const getAllDeliveryOrders = async (
    status?: string | string[],
    size?: string,
    page?: string
) =>
    customRequest(
        BrikApiOrder.deliveryOrder(status, page, size),
        "GET",
        undefined,
        true
    );

export const getDeliveryOrderByID = async (id: string) =>
    customRequest(BrikApiOrder.deliveryOrderByID(id), "GET", undefined, true);

export const getVisitationOrderByID = async (id: string) =>
    customRequest(
        BrikApiOrder.getVisitationOrderByID(id),
        "GET",
        undefined,
        true
    );

export const postSph = async (payload: sphOrderPayloadType) =>
    customRequest(BrikApiOrder.orderSphPost(), "POST", payload, true);

export const getSphByProject = async (
    searchQuery: string,
    customerType: "INDIVIDU" | "COMPANY"
) =>
    customRequest(
        BrikApiOrder.getSphByProject(searchQuery, customerType),
        "GET",
        undefined,
        true
    );

export const getCreatedSphDocuments = async (id: string) =>
    customRequest(BrikApiOrder.getSphDocuments(id), "GET", undefined, true);

export const postPurchaseOrder = async (payload) =>
    customRequest(BrikApiOrder.purchaseOrder(), "POST", payload, true);

export const postDeposit = async (payload) =>
    customRequest(BrikApiOrder.postDeposit(), "POST", payload, true);

export const postSchedule = async (payload) =>
    customRequest(BrikApiOrder.postSchedule(), "POST", payload, true);

export const getConfirmedPurchaseOrder = async (
    page: string,
    size: string,
    searchQuery: string,
    productPo = "1"
) =>
    customRequest(
        BrikApiOrder.getConfirmedPurchaseOrder(
            page,
            size,
            searchQuery,
            productPo
        ),
        "GET",
        undefined,
        true
    );

export const updateDeliveryOrder = async (
    payload: UpdateDeliverOrder,
    deliveryOrderId: string
) =>
    customRequest(
        BrikApiOrder.deliveryOrderByID(deliveryOrderId),
        "PUT",
        payload,
        true
    );

export const uploadSOSignedDocs = async (payload: UploadSOSigned, id: string) =>
    customRequest(BrikApiOrder.uploadSOSignedDocs(id), "PUT", payload, true);

export const updateDeliveryOrderWeight = async (
    payload: UpdateDeliverOrder,
    deliveryOrderId: string
) =>
    customRequest(
        BrikApiOrder.deliveryOrderWeightByID(deliveryOrderId),
        "PUT",
        payload,
        true
    );
