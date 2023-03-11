import { Docs, visitationListResponse } from '@/interfaces';
import { ENTRY_TYPE } from '@/models/EnumModel';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PhotoFile } from 'react-native-vision-camera';

export type RootStackParamList = {
  TAB_ROOT: { screen?: string; params?: any };
  VERIFICATION: undefined;
  CAMERA: {
    photoTitle: string;
    navigateTo?: string;
    closeButton?: boolean;
    existingVisitation?: visitationListResponse;
    operationAddedStep?: string;
    disabledDocPicker?: boolean;
    disabledGalleryPicker?: boolean;
  };
  IMAGE_PREVIEW: {
    photo?: PhotoFile;
    photoTitle: string;
    picker?: any;
    navigateTo?: string;
    closeButton?: boolean;
    existingVisitation?: visitationListResponse;
    operationAddedStep?: string;
  };
  ALL_PRODUCT: {
    coordinate: { longitude: number; latitude: number };
    from: string;
  };
  PO: {};
  CREATE_DO: { id: string };
  SUBMIT_FORM: { operationType?: ENTRY_TYPE };
  CREATE_VISITATION: { existingVisitation?: visitationListResponse };
  SPH: { projectId?: string };
  APPOINTMENT: undefined;
  SEARCH_PRODUCT: { isGobackAfterPress?: boolean; distance: number };
  LOCATION: {
    coordinate: { longitude: number; latitude: number };
    isReadOnly: boolean;
    from: string;
    eventKey?: string;
  };
  SEARCH_AREA: { from?: string; eventKey?: string };
  CALENDAR: { useTodayMinDate: boolean };
  TRANSACTION_DETAIL: { title: string; data: any };
  CREATE_SCHEDULE: undefined;
  SEARCH_PO: { from: string };
  CUSTOMER_DETAIL: { existingVisitation?: any };
  DOCUMENTS: { projectId?: string; docs?: Docs[] };
  VISIT_HISTORY: { projectId?: string; projectName?: string };
  CREATE_DEPOSIT: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
