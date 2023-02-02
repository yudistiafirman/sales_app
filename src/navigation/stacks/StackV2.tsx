import Preview from '@/screens/Camera/Preview';
import Schedule from '@/screens/Operation/Schedule';
import SubmitForm from '@/screens/Operation/SubmitForm';
import Camera from '@/screens/Camera';
import CalendarScreen from '@/screens/CalendarScreen';
import * as React from 'react';
import SearchAreaProject from '@/screens/SearchAreaProject';
import Location from '@/screens/Location';
import SearchProduct from '@/screens/SearchProduct';
import Sph from '@/screens/Sph';
import CreateVisitation from '@/screens/Visitation/CreateVisitation';
import { BHeaderTitle } from '@/components';

export const getOperationStack = (Stack: any) => {
  return [
    <Stack.Screen
      name={'Camera'}
      component={Camera}
      options={{
        headerTitle: () => BHeaderTitle('Camera', 'flex-start'),
      }}
    />,
    <Stack.Screen
      name={'Preview'}
      component={Preview}
      options={{
        headerTitle: () => BHeaderTitle('Preview', 'flex-start'),
      }}
    />,
    <Stack.Screen
      name={'Schedule'}
      component={Schedule}
      options={{
        headerTitle: () => BHeaderTitle('Schedule', 'flex-start'),
      }}
    />,
    <Stack.Screen
      name={'SubmitForm'}
      component={SubmitForm}
      options={{
        headerTitle: () => BHeaderTitle('SubmitForm', 'flex-start'),
      }}
    />,
  ];
};

export const getSalesStack = (Stack: any) => {
  return [
    <Stack.Screen
      name={'CreateVisitation'}
      component={CreateVisitation}
      options={{
        headerTitle: () => BHeaderTitle('CreateVisitation', 'flex-start'),
      }}
    />,
    <Stack.Screen
      name={'SPH'}
      component={Sph}
      options={{
        headerTitle: () => BHeaderTitle('SPH', 'flex-start'),
      }}
    />,
    <Stack.Screen
      name={'SearchProduct'}
      component={SearchProduct}
      options={{
        headerTitle: () => BHeaderTitle('SearchProduct', 'flex-start'),
      }}
    />,
    <Stack.Screen
      name={'Location'}
      component={Location}
      options={{
        headerTitle: () => BHeaderTitle('Pilih Area Proyek', 'flex-start'),
      }}
    />,
    <Stack.Screen
      name={'SearchArea'}
      component={SearchAreaProject}
      options={{
        headerTitle: () => BHeaderTitle('Pilih Area Proyek', 'flex-start'),
      }}
    />,
    <Stack.Screen
      name={'CalendarScreen'}
      component={CalendarScreen}
      options={{
        headerTitle: () => BHeaderTitle('Pilih Tanggal', 'flex-start'),
      }}
    />,
    <Stack.Screen
      name={'Camera'}
      component={Camera}
      options={{
        headerTitle: () => BHeaderTitle('Camera', 'flex-start'),
      }}
    />,
    <Stack.Screen
      name={'Preview'}
      component={Preview}
      options={{
        headerTitle: () => BHeaderTitle('Preview', 'flex-start'),
      }}
    />,
  ];
};
