import BrikApiProductivity from '@/brikApi/BrikApiProductivity';
import { payloadPostType } from '@/interfaces';
import { customRequest } from '@/networking/request';

type GetVisitationsType = {
  month?: number;
  year?: number;
};
type VisitationPayloadType = {
  payload: payloadPostType;
  visitationId: string;
};

export const getVisitations = async ({ month, year }: GetVisitationsType) =>
  customRequest(BrikApiProductivity.visitations({ month, year }), 'GET', undefined, true);
export const postVisitations = async ({ payload }: VisitationPayloadType) =>
  customRequest(BrikApiProductivity.visitations(), 'POST', payload, true);

export const oneGetVisitation = async ({ visitationId }: { visitationId: string }) =>
  customRequest(BrikApiProductivity.visitationIdPath({ visitationId }), 'GET', undefined, true);

export const putVisitation = async ({ payload, visitationId }: VisitationPayloadType) =>
  customRequest(
    BrikApiProductivity.visitationIdPath({
      visitationId,
    }),
    'PUT',
    payload,
    true
  );

// home screen
interface IGetAll {
  date?: number;
  page?: number;
  search?: string;
  projectId?: string;
}

export const getAllVisitations = async ({ page = 0, date, search = '', projectId }: IGetAll) =>
  customRequest(
    BrikApiProductivity.getAllVisitations({
      page,
      date,
      search,
      projectId,
    }),
    'GET',
    undefined,
    true
  );

export const getVisitationTarget = async () =>
  customRequest(BrikApiProductivity.getTarget(), 'GET', undefined, true);

export const postBookingAppointment = async ({ payload }) =>
  customRequest(BrikApiProductivity.bookingAppointment(), 'POST', payload, true);
