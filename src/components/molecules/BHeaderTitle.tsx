import { BText } from '@/components';
import { colors } from '@/constants';
import { Styles } from '@/interfaces';

const BHeaderTitle = (title: string, type: string, color: string) => {
  const styles: Styles = {
    container: {
      color:
        type === 'home' && color === 'primary'
          ? colors.text.light
          : colors.text.dark,
    },
  };

  return (
    <BText type="header" style={styles.container}>
      {title}
    </BText>
  );
};

export default BHeaderTitle;
