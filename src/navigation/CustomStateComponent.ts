import { Docs, visitationListResponse } from '@/interfaces';
import { ENTRY_TYPE } from '@/models/EnumModel';
import { OperationProjectDetails } from '@/redux/reducers/operationReducer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PhotoFile } from 'react-native-vision-camera';

export type RootStackParamList = {
  TAB_ROOT: { screen?: string; params?: any };
  VERIFICATION: undefined;
  BLANKSCREEN: undefined;
  CAMERA: {
    photoTitle: string;
    navigateTo?: string;
    closeButton?: boolean;
    existingVisitation?: visitationListResponse;
    operationAddedStep?: string;
    disabledDocPicker?: boolean;
    disabledGalleryPicker?: boolean;
    operationTempData?: OperationProjectDetails;
    soID?: string;
    soNumber?: string;
  };
  IMAGE_PREVIEW: {
    photo?: PhotoFile;
    photoTitle: string;
    picker?: any;
    navigateTo?: string;
    closeButton?: boolean;
    existingVisitation?: visitationListResponse;
    operationAddedStep?: string;
    operationTempData?: OperationProjectDetails;
    soID?: string;
    soNumber?: string;
  };
  ALL_PRODUCT: {
    coordinate: { longitude: number; latitude: number };
    from: string;
  };
  PO: undefined;
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
  TRANSACTION_DETAIL: { title: string; data: any; type: string };
  CREATE_SCHEDULE: undefined;
  CUSTOMER_DETAIL: { existingVisitation?: any };
  DOCUMENTS: { projectId?: string; docs?: Docs[] };
  VISIT_HISTORY: { projectId?: string; projectName?: string };
  CREATE_DEPOSIT: undefined;
  SEARCH_SO: undefined;
  FORM_SO: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
