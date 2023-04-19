import BrikApiProductivity from '@/brikApi/BrikApiProductivity';
import { payloadPostType } from '@/interfaces';
import { customRequest } from '@/networking/request';

type getVisitationsType = {
  month?: number;
  year?: number;
};
type visitationPayloadType = {
  payload: payloadPostType;
  visitationId: string;
};

export const getVisitations = async ({ month, year }: getVisitationsType) => {
  return customRequest(
    BrikApiProductivity.visitations({ month, year }),
    'GET',
    undefined,
    true
  );
};
export const postVisitations = async ({ payload }: visitationPayloadType) => {
  return customRequest(
    BrikApiProductivity.visitations(),
    'POST',
    payload,
    true
  );
};

export const oneGetVisitation = async ({
  visitationId,
}: {
  visitationId: string;
}) => {
  return customRequest(
    BrikApiProductivity.visitationIdPath({ visitationId }),
    'GET',
    undefined,
    true
  );
};

export const putVisitation = async ({
  payload,
  visitationId,
}: visitationPayloadType) => {
  return customRequest(
    BrikApiProductivity.visitationIdPath({
      visitationId,
    }),
    'PUT',
    payload,
    true
  );
};

// home screen
interface IGetAll {
  date?: number;
  page?: number;
  search?: string;
  projectId?: string;
}

export const getAllVisitations = async ({
  page = 0,
  date,
  search = '',
  projectId,
}: IGetAll) => {
  return customRequest(
    BrikApiProductivity.getAllVisitations({ page, date, search, projectId }),
    'GET',
    undefined,
    true
  );
};

export const getVisitationTarget = async () => {
  return customRequest(BrikApiProductivity.getTarget(), 'GET', undefined, true);
};

export const postBookingAppointment = async ({ payload }) => {
  return customRequest(
    BrikApiProductivity.bookingAppointment(),
    'POST',
    payload,
    true
  );
};
