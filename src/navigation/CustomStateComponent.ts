import { visitationListResponse } from '@/interfaces';
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
    existingVisitation?: visitationListResponse;
  };
  ALL_PRODUCT: {
    coordinate: { longitude: number; latitude: number };
    from: string;
  };
  IMAGE_PREVIEW: {
    photo: PhotoFile;
    photoTitle: string;
    navigateTo?: string;
    existingVisitation?: visitationListResponse;
  };
  SCHEDULE: { id: string };
  SUBMIT_FORM: { type?: string };
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
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
