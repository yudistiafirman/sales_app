import BText from '@/components/atoms/BText';
import colors from '@/constants/colors';
import { TypedNavigator } from '@react-navigation/native';
import * as React from 'react';

/**
 * @deprecated The method should not be used
 */
const BTabScreen = ({
  Tab,
  name,
  type = 'default',
  title,
  color,
  component,
  headerShown = true,
}: {
  Tab: TypedNavigator<any, any, any, any, any>;
  type?: 'default' | 'home' | 'sub';
  name: string;
  title?: string;
  color?: 'primary' | 'white' | undefined;
  component: any;
  headerShown?: boolean;
}) => {
  const styles = React.useMemo(() => {
    return {
      headerTitleAlign: type === 'home' || type === 'sub' ? 'center' : 'left',
      headerStyle: {
        backgroundColor:
          type === 'home' && color === 'primary'
            ? colors.primary
            : colors.white,
      },
      headerTitleStyle: {
        color:
          type === 'home' && color === 'primary'
            ? colors.text.light
            : colors.text.dark,
      },
    };
  }, [type, color]);
  return (
    <Tab.Screen
      name={name}
      component={component}
      key={name}
      options={{
        headerTitleAlign: styles.headerTitleAlign,
        headerShadowVisible: false,
        headerShown: headerShown,
        headerStyle: styles.headerStyle,
        headerTitle: () => (
          <BText type="header" style={styles.headerTitleStyle}>
            {title}
          </BText>
        ),
      }}
    />
  );
};

export default BTabScreen;
