import { visitationListResponse } from '@/interfaces';
import { ENTRY_TYPE } from '@/models/EnumModel';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PhotoFile } from 'react-native-vision-camera';

export type RootStackParamList = {
  TAB_ROOT: {};
  TAB_OPERATION: { role?: string };
  TAB_DISPATCH: {};
  TAB_HOME: {};
  TAB_TRANSACTION: {};
  TAB_PROFILE: {};
  TAB_PRICE_LIST: { coordinate: { longitude: number; latitude: number } };
  OPERATION: { role?: string };
  LOGIN: {};
  VERIFICATION: {};
  CAMERA: {
    photoTitle: string;
    navigateTo?: string;
    closeButton?: boolean;
    existingVisitation?: visitationListResponse;
    operationAddedStep?: string;
  };
  ALL_PRODUCT: {
    coordinate: { longitude: number; latitude: number };
    from: string;
  };
  IMAGE_PREVIEW: {
    photo: PhotoFile | undefined;
    photoTitle: string;
    navigateTo?: string;
    closeButton?: boolean;
    existingVisitation?: visitationListResponse;
    operationAddedStep?: string;
  };
  SCHEDULE: { id: string };
  SUBMIT_FORM: { operationType?: ENTRY_TYPE };
  CREATE_VISITATION: { existingVisitation?: visitationListResponse };
  SPH: {};
  APPOINTMENT: {};
  SEARCH_PRODUCT: { isGobackAfterPress?: boolean; distance: number };
  LOCATION: {
    coordinate: { longitude: number; latitude: number };
    isReadOnly: boolean;
    from: string;
  };
  SEARCH_AREA: { from: string; eventKey: string };
  CALENDAR: {};
  TRANSACTION_DETAIL: { title: string; data: any };
  CREATE_SCHEDULE: {
    useTodayMinDate?: boolean;
  };
  SEARCH_PO: { from: string };
  CUSTOMER_DETAIL: { existingVisitation?: any };
  DOCUMENTS: {};
  CREATE_DEPOSIT: {};
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
