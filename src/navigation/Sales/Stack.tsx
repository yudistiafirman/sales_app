import Preview from '@/screens/Camera/Preview';
import Camera from '@/screens/Camera';
import CalendarScreen from '@/screens/Calendar';
import * as React from 'react';
import SearchAreaProject from '@/screens/SearchAreaProject';
import Location from '@/screens/Location';
import SearchProduct from '@/screens/SearchProduct';
import Sph from '@/screens/Sph';
import CreateVisitation from '@/screens/Visitation/CreateVisitation';
import TransactionDetail from '@/screens/Transaction/Detail';
import {
  ALL_PRODUCT,
  ALL_PRODUCT_TITLE,
  APPOINTMENT,
  APPOINTMENT_TITLE,
  CALENDAR,
  CALENDAR_TITLE,
  CAMERA,
  CAMERA_TITLE,
  CREATE_DEPOSIT,
  CREATE_DEPOSIT_TITLE,
  CREATE_SCHEDULE,
  CREATE_SCHEDULE_TITLE,
  CREATE_VISITATION,
  CREATE_VISITATION_TITLE,
  CUSTOMER_DETAIL,
  CUSTOMER_DETAIL_TITLE,
  DOCUMENTS,
  DOCUMENTS_TITLE,
  IMAGE_PREVIEW,
  IMAGE_PREVIEW_TITLE,
  LOCATION,
  LOCATION_TITLE,
  PO,
  SEARCH_AREA,
  SEARCH_AREA_TITLE,
  SEARCH_PO,
  SEARCH_PO_TITLE,
  SEARCH_PRODUCT,
  SEARCH_PRODUCT_TITLE,
  SPH,
  SPH_TITLE,
  TRANSACTION_DETAIL,
  TRANSACTION_DETAIL_TITLE,
  VISIT_HISTORY,
} from '../ScreenNames';
import CustomerDetail from '@/screens/CustomerDetail';
import PurchaseOrderWithProvider from '@/screens/PurchaseOrder';
import CreateSchedule from '@/screens/CreateSchedule';
import PriceList from '@/screens/Price';
import AppointmentWithProvider from '@/screens/Appointment';
import SearchPO from '@/screens/SearchPO';
import RequiredDocuments from '@/screens/RequiredDocuments';
import VisitHistory from '@/screens/VisitHistory';
import Deposit from '@/screens/Deposit';

const SalesStack = (Stack: any) => {
  return (
    <>
      <Stack.Screen
        name={CREATE_VISITATION}
        key={CREATE_VISITATION}
        component={CreateVisitation}
        options={{
          headerTitle: CREATE_VISITATION_TITLE,
        }}
      />
      <Stack.Screen
        name={SPH}
        key={SPH}
        component={Sph}
        options={{
          headerTitle: SPH_TITLE,
        }}
      />
      <Stack.Screen
        name={PO}
        key={PO}
        component={PurchaseOrderWithProvider}
        options={{
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name={APPOINTMENT}
        key={APPOINTMENT}
        component={AppointmentWithProvider}
        options={{
          headerTitle: APPOINTMENT_TITLE,
        }}
      />
      <Stack.Screen
        name={SEARCH_PRODUCT}
        key={SEARCH_PRODUCT}
        component={SearchProduct}
        options={{
          headerTitle: SEARCH_PRODUCT_TITLE,
        }}
      />
      <Stack.Screen
        name={LOCATION}
        key={LOCATION}
        component={Location}
        options={{
          headerTitle: LOCATION_TITLE,
        }}
      />
      <Stack.Screen
        name={SEARCH_AREA}
        key={SEARCH_AREA}
        component={SearchAreaProject}
        options={{
          headerTitle: SEARCH_AREA_TITLE,
        }}
      />
      <Stack.Screen
        name={CALENDAR}
        key={CALENDAR}
        component={CalendarScreen}
        options={{
          headerTitle: CALENDAR_TITLE,
        }}
      />
      <Stack.Screen
        name={CAMERA}
        key={CAMERA}
        component={Camera}
        options={{
          headerTitle: CAMERA_TITLE,
        }}
      />
      <Stack.Screen
        name={IMAGE_PREVIEW}
        key={IMAGE_PREVIEW}
        component={Preview}
        options={{
          headerTitle: IMAGE_PREVIEW_TITLE,
        }}
      />
      <Stack.Screen
        name={TRANSACTION_DETAIL}
        key={TRANSACTION_DETAIL}
        component={TransactionDetail}
        options={{
          headerTitle: TRANSACTION_DETAIL_TITLE,
        }}
      />
      <Stack.Screen
        name={CUSTOMER_DETAIL}
        key={CUSTOMER_DETAIL}
        component={CustomerDetail}
        options={{
          headerTitle: CUSTOMER_DETAIL_TITLE,
        }}
      />
      <Stack.Screen
        name={ALL_PRODUCT}
        key={ALL_PRODUCT}
        component={PriceList}
        options={{
          headerTitle: ALL_PRODUCT_TITLE,
        }}
      />
      <Stack.Screen
        name={CREATE_SCHEDULE}
        key={CREATE_SCHEDULE}
        component={CreateSchedule}
        options={{
          headerTitle: CREATE_SCHEDULE_TITLE,
        }}
      />
      <Stack.Screen
        name={SEARCH_PO}
        key={SEARCH_PO}
        component={SearchPO}
        options={{
          headerTitle: SEARCH_PO_TITLE,
        }}
      />
      <Stack.Screen
        name={DOCUMENTS}
        key={DOCUMENTS}
        component={RequiredDocuments}
        options={{
          headerTitle: DOCUMENTS_TITLE,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name={VISIT_HISTORY}
        key={VISIT_HISTORY}
        component={VisitHistory}
        options={{
          headerTitle: false,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name={CREATE_DEPOSIT}
        key={CREATE_DEPOSIT}
        component={Deposit}
        options={{
          headerTitle: CREATE_DEPOSIT_TITLE,
        }}
      />
    </>
  );
};

export default SalesStack;
