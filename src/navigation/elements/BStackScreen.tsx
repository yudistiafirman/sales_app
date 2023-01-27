import colors from '@/constants/colors';
import { TypedNavigator } from '@react-navigation/native';
import React from 'react';
import BHeaderTitle from '@/components/molecules/BHeaderTitle';

const BStackScreen = ({
  Stack,
  name,
  type = 'default',
  title,
  color,
  component,
  headerShown = true,
}: {
  Stack: TypedNavigator<any, any, any, any, any>;
  type?: 'default' | 'home' | 'sub';
  name: string;
  title?: string;
  color?: 'primary' | 'white' | undefined;
  component: any;
  headerShown?: boolean;
}) => {
  const styles = {
    headerTitleAlign: type === 'home' ? 'center' : 'left',
    headerStyle: {
      backgroundColor:
        type === 'home' && color === 'primary' ? colors.primary : colors.white,
    },
  };

  return (
    <Stack.Screen
      name={name}
      component={component}
      key={name}
      options={{
        headerTitleAlign: styles.headerTitleAlign,
        headerShadowVisible: false,
        headerShown: headerShown,
        headerStyle: styles.headerStyle,
        headerTitle: () => BHeaderTitle(title, type, color),
      }}
    />
  );
};

export default BStackScreen;
