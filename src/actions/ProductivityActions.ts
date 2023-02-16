import BrikApiProductivity from '@/brikApi/BrikApiProductivity';
import { payloadPostType } from '@/interfaces';
import { getOptions, request } from '@/networking/request';
import { customLog } from '@/utils/generalFunc';

type getVisitationsType = {
  month?: number;
  year?: number;
};
type visitationPayloadType = {
  payload: payloadPostType;
  visitationId: string;
};

export const getVisitations = async ({ month, year }: getVisitationsType) => {
  return request(
    BrikApiProductivity.visitations({ month, year }),
    await getOptions('GET', undefined, true)
  );
};
export const postVisitations = async ({ payload }: visitationPayloadType) => {
  return request(
    BrikApiProductivity.visitations({}),
    await getOptions('POST', payload, true)
  );
};

export const oneGetVisitation = async ({
  visitationId,
}: {
  visitationId: string;
}) => {
  return request(
    BrikApiProductivity.visitationIdPath({ visitationId }),
    await getOptions('GET', undefined, true)
  );
};

export const putVisitation = async ({
  payload,
  visitationId,
}: visitationPayloadType) => {
  customLog(visitationId, 'visitationId42');

  return request(
    BrikApiProductivity.visitationIdPath({
      visitationId,
    }),
    await getOptions('PUT', payload, true)
  );
};

// home screen
interface IGetAll {
  date?: number;
  page: number;
  search?: string;
}

export const getAllVisitations = async ({
  page = 0,
  date,
  search = '',
}: IGetAll) => {
  return request(
    BrikApiProductivity.getAllVisitations({ page, date, search }),
    await getOptions('GET', undefined, true)
  );
};

export const getVisitationTarget = async () => {
  return request(
    BrikApiProductivity.getTarget(),
    await getOptions('GET', undefined, true)
  );
};

export const postBookingAppointment = async ({ payload }) => {
  return request(
    BrikApiProductivity.bookingAppointment(),
    await getOptions('POST', payload, true)
  );
};
