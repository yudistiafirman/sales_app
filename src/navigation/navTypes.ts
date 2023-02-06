import { visitationListResponse } from '@/interfaces';
import { photoType } from '@/redux/reducers/cameraReducer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PhotoFile } from 'react-native-vision-camera';

export type AuthStackParamList = {
  Login: undefined;
  Verification: undefined;
};
export type RootStackParamList = {
  Location: { coordinate: { longitude: number; latitude: number } };
  SearchArea: undefined;
  Harga: { coordinate: { longitude: number; latitude: number } };
  SearchProduct: { distance: number };
  CreateVisitation: {
    existingVisitation?: visitationListResponse;
  };
  Camera: {
    photoTitle: string;
    navigateTo?: string;
    existingVisitation?: visitationListResponse;
  };
  Preview: {
    photo: PhotoFile;
    photoTitle: string;
    navigateTo?: string;
    existingVisitation?: visitationListResponse;
    poImages?: photoType;
  };
  Schedule: { id: string };
  Operation: { role?: string };
  SubmitForm: { type?: string };
  PO: {
    poImages?: Record<string, string>;
  };
};

export type AuthStackScreenProps = NativeStackScreenProps<AuthStackParamList>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
