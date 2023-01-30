import BrikApiProductivity from '@/brikApi/BrikApiProductivity';
import { getOptions, request } from '@/networking/request';

type getVisitationsType = {
  month?: number;
  year?: number;
};

export const getVisitations = ({ month, year }: getVisitationsType) => {
  return request(
    BrikApiProductivity.visitations({ month, year }),
    getOptions('GET')
  );
};
export const postVisitations = ({ payload }) => {
  return request(
    BrikApiProductivity.visitations({}),
    getOptions('POST', payload)
  );
};

// home screen
interface IGetAll {
  date: number;
  page: number;
  search: string;
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
