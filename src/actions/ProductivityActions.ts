import BrikApiProductivity from "@/brikApi/BrikApiProductivity";
import { payloadPostType } from "@/interfaces";
import { customRequest } from "@/networking/request";

type GetVisitationsType = {
    month?: number;
    year?: number;
    batchingPlantId?: string;
};
type VisitationPayloadType = {
    payload: payloadPostType;
    visitationId: string;
};

export const getVisitations = async ({
    month,
    year,
    batchingPlantId
}: GetVisitationsType) =>
    customRequest(
        BrikApiProductivity.visitations({ month, year, batchingPlantId }),
        "GET",
        undefined,
        true
    );
export const postVisitations = async ({ payload }: VisitationPayloadType) =>
    customRequest(BrikApiProductivity.visitations(), "POST", payload, true);

export const oneGetVisitation = async ({
    visitationId
}: {
    visitationId: string;
}) =>
    customRequest(
        BrikApiProductivity.visitationIdPath({ visitationId }),
        "GET",
        undefined,
        true
    );

export const putVisitation = async ({
    payload,
    visitationId
}: VisitationPayloadType) =>
    customRequest(
        BrikApiProductivity.visitationIdPath({
            visitationId
        }),
        "PUT",
        payload,
        true
    );

// home screen
interface IGetAll {
    date?: number;
    page?: number;
    search?: string;
    projectId?: string;
    batchingPlantId?: string;
}

export const getAllVisitations = async ({
    page = 0,
    date,
    search = "",
    projectId,
    batchingPlantId
}: IGetAll) =>
    customRequest(
        BrikApiProductivity.getAllVisitations({
            page,
            date,
            search,
            projectId,
            batchingPlantId
        }),
        "GET",
        undefined,
        true
    );

export const getVisitationTarget = async (batchingPlantId?: string) =>
    customRequest(
        BrikApiProductivity.getTarget(batchingPlantId),
        "GET",
        undefined,
        true
    );

export const postBookingAppointment = async ({ payload }) =>
    customRequest(
        BrikApiProductivity.bookingAppointment(),
        "POST",
        payload,
        true
    );
