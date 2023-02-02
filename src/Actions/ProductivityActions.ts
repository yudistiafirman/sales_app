import BrikApiProductivity from '@/BrikApi/BrikApiProductivity';
import { getOptions, request } from '@/networking/request';

type getVisitationsType = {
  month?: number;
  year?: number;
};

export const getVisitations = async ({ month, year }: getVisitationsType) => {
  return request(
    BrikApiProductivity.visitations({ month, year }),
    await getOptions('GET', undefined, true)
  );
};
export const postVisitations = async ({ payload }) => {
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
    BrikApiProductivity.visitationGetOne({ visitationId }),
    await getOptions('GET', undefined, true)
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
