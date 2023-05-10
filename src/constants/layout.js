import { resScale } from '@/utils';

const layout = {
  mainPad: resScale(16),
  spaceBetween: resScale(10),
  radius: {
    xs: resScale(2),
    sm: resScale(4),
    md: resScale(8),
    lg: resScale(16),
    xl: resScale(32),
  },
  pad: {
    zero: resScale(0),
    xs: resScale(2),
    sm: resScale(4),
    md: resScale(8),
    ml: resScale(12),
    lg: resScale(16),
    xl: resScale(32),
    xxl: resScale(48),
  },
};

export default layout;
