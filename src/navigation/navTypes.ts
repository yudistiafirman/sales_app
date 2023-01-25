import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Verification: undefined;
};
export type RootStackParamList = {
  Location: { coordinate: { longitude: number; latitude: number } };
  SearchArea: undefined;
  Harga: { coordinate: { longitude: number; latitude: number } };
  SearchProduct: { distance: number };
  CreateVisitation: undefined;
};

export type AuthStackScreenProps = NativeStackScreenProps<AuthStackParamList>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
