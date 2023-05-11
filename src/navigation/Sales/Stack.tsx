import * as React from 'react';
import AppointmentWithProvider from '@/screens/Appointment';
import CalendarScreen from '@/screens/Calendar';
import CameraScreen from '@/screens/Camera';
import Preview from '@/screens/Camera/Preview';
import CreateScheduleScreen from '@/screens/CreateSchedule';
import CustomerDetail from '@/screens/CustomerDetail';
import Deposit from '@/screens/Deposit';
import Location from '@/screens/Location';
import PriceList from '@/screens/Price';
import PurchaseOrderWithProvider from '@/screens/PurchaseOrder';
import RequiredDocuments from '@/screens/RequiredDocuments';
import SearchAreaProject from '@/screens/SearchAreaProject';
import SearchProduct from '@/screens/SearchProduct';
import SearchSO from '@/screens/SearchSO';
import FormSO from '@/screens/SearchSO/Form/FormSO';
import Sph from '@/screens/Sph';
import TransactionDetail from '@/screens/Transaction/Detail';
import VisitHistory from '@/screens/VisitHistory';
import CreateVisitation from '@/screens/Visitation/CreateVisitation';
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
  FORM_SO,
  FORM_SO_TITLE,
  IMAGE_PREVIEW,
  IMAGE_PREVIEW_TITLE,
  LOCATION,
  LOCATION_TITLE,
  PO,
  SEARCH_AREA,
  SEARCH_AREA_TITLE,
  SEARCH_PRODUCT,
  SEARCH_PRODUCT_TITLE,
  SEARCH_SO,
  SEARCH_SO_TITLE,
  SPH,
  SPH_TITLE,
  TRANSACTION_DETAIL,
  TRANSACTION_DETAIL_TITLE,
  VISIT_HISTORY,
} from '../ScreenNames';

function SalesStack(Stack: any) {
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
          headerTitle: false,
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
        component={CameraScreen}
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
          headerTitleAlign: 'center',
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
        component={CreateScheduleScreen}
        options={{
          headerTitle: CREATE_SCHEDULE_TITLE,
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
      <Stack.Screen
        name={SEARCH_SO}
        key={SEARCH_SO}
        component={SearchSO}
        options={{
          headerTitle: SEARCH_SO_TITLE,
        }}
      />
      <Stack.Screen
        name={FORM_SO}
        key={FORM_SO}
        component={FormSO}
        options={{
          headerTitle: FORM_SO_TITLE,
        }}
      />
    </>
  );
}

export default SalesStack;
