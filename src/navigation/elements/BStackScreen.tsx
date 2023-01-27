import { TypedNavigator } from '@react-navigation/native';
import React from 'react';
import BHeaderTitle from '@/components/molecules/BHeaderTitle';

const BStackScreen = ({
  Stack,
  name,
  type = 'default',
  title,
  component,
  headerShown = true,
  role = undefined,
}: {
  Stack: TypedNavigator<any, any, any, any, any>;
  type?: 'default' | 'home' | 'sub';
  name: string;
  title?: string;
  component: any;
  headerShown?: boolean;
  role?: string;
}) => {
  const headerTitleAlign = type === 'home' ? 'center' : 'left';

  return (
    <Stack.Screen
      name={name}
      component={component}
      key={name}
      options={{
        headerTitleAlign: headerTitleAlign,
        headerShadowVisible: false,
        headerShown: headerShown,
        headerTitle: () => BHeaderTitle(title, 'center', role),
      }}
    />
  );
};

export default BStackScreen;
