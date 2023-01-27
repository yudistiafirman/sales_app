import { BText } from '@/components';
import { colors } from '@/constants';

export const renderHeaderTitle = (
  title: string,
  type: string,
  color: string
) => (
  <BText
    type="header"
    style={{
      color:
        type === 'home' && color === 'primary'
          ? colors.text.light
          : colors.text.dark,
    }}
  >
    {title}
  </BText>
);
