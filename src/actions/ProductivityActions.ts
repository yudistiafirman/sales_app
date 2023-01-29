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
