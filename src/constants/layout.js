import { scaleSize } from '@/utils';

const layout = {
  mainPad: 16,
  spaceBetween: 10,
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 32,
  },
  pad: {
    xs: scaleSize.moderateScale(2),
    sm: scaleSize.moderateScale(4),
    md: scaleSize.moderateScale(8),
    lg: scaleSize.moderateScale(16),
    xl: scaleSize.moderateScale(32),
  },
};

export default layout;
