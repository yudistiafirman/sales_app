import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import UserModel from "@/models/User";
import { isDevelopment, isProduction } from "@/utils/generalFunc";

interface LoginCredential {
    phoneNumber: string;
}

interface AuthState {
    userData: UserModel.DataSuccessLogin | null;
    loginCredential: LoginCredential;
    isLoading: boolean;
    isSignout: boolean;
    hunterScreen: boolean;
    isShowButtonNetwork: boolean;
    isNetworkLoggerVisible: boolean;
    selectedBP: string;
    remoteConfigData: {
        enable_signed_so: boolean;
        enable_appointment: boolean;
        enable_create_schedule: boolean;
        enable_customer_detail: boolean;
        enable_deposit: boolean;
        enable_hunter_farmer: boolean;
        enable_po: boolean;
        enable_price_menu: boolean;
        enable_profile_menu: boolean;
        enable_sph: boolean;
        enable_transaction_menu: boolean;
        enable_customer_menu: boolean;
        enable_visitation: boolean;
        enable_invoice: boolean;
        force_update: { min_version: string; is_forced: boolean };
    };
}

const initialState: AuthState = {
    userData: null,
    loginCredential: {
        phoneNumber: ""
    },
    selectedBP: "BP-Legok",
    isLoading: true,
    isSignout: false,
    hunterScreen: false,
    isShowButtonNetwork: isDevelopment() || (isProduction() && __DEV__),
    isNetworkLoggerVisible: false,
    remoteConfigData: {
        enable_signed_so: true,
        enable_appointment: true,
        enable_create_schedule: true,
        enable_customer_detail: true,
        enable_deposit: true,
        enable_hunter_farmer: true,
        enable_po: true,
        enable_price_menu: true,
        enable_profile_menu: false,
        enable_customer_menu: true,
        enable_sph: true,
        enable_transaction_menu: true,
        enable_visitation: true,
        enable_invoice: true,
        force_update: { min_version: "1.0.0", is_forced: false }
    }
};

export const authSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        setPhoneNumber: (state, action: PayloadAction<string>) => ({
            ...state,
            loginCredential: {
                ...state.loginCredential,
                phoneNumber: action.payload
            }
        }),
        setSelectedBP: (state, action: PayloadAction<string>) => ({
            ...state,
            selectedBP: action.payload
        }),
        setUserData: (state, action: PayloadAction<any>) => {
            if (action.payload.remoteConfigData) {
                return {
                    ...state,
                    userData: action.payload.userData,
                    remoteConfigData: {
                        ...state.remoteConfigData,
                        enable_signed_so:
                            action.payload.remoteConfigData.enable_signed_so,
                        enable_appointment:
                            action.payload.remoteConfigData.enable_appointment,
                        enable_create_schedule:
                            action.payload.remoteConfigData
                                .enable_create_schedule,
                        enable_customer_detail:
                            action.payload.remoteConfigData
                                .enable_customer_detail,
                        enable_deposit:
                            action.payload.remoteConfigData.enable_deposit,
                        enable_hunter_farmer:
                            action.payload.remoteConfigData
                                .enable_hunter_farmer,
                        enable_po: action.payload.remoteConfigData.enable_po,
                        enable_price_menu:
                            action.payload.remoteConfigData.enable_price_menu,
                        enable_profile_menu:
                            action.payload.remoteConfigData.enable_profile_menu,
                        enable_sph: action.payload.remoteConfigData.enable_sph,
                        enable_transaction_menu:
                            action.payload.remoteConfigData
                                .enable_transaction_menu,
                        enable_visitation:
                            action.payload.remoteConfigData.enable_visitation,
                        enable_invoice:
                            action.payload.remoteConfigData.enable_invoice,
                        force_update:
                            action.payload.remoteConfigData.force_update
                    },
                    isSignout: false,
                    isLoading: false
                };
            }
            return {
                ...state,
                userData: action.payload.userData,
                isSignout: false,
                isLoading: false
            };
        },
        setIsLoading: (state, action: PayloadAction<any>) => {
            if (action.payload.remoteConfigData) {
                return {
                    ...state,
                    remoteConfigData: {
                        ...state.remoteConfigData,
                        enable_signed_so:
                            action.payload.remoteConfigData.enable_signed_so,
                        enable_appointment:
                            action.payload.remoteConfigData.enable_appointment,
                        enable_create_schedule:
                            action.payload.remoteConfigData
                                .enable_create_schedule,
                        enable_customer_detail:
                            action.payload.remoteConfigData
                                .enable_customer_detail,
                        enable_deposit:
                            action.payload.remoteConfigData.enable_deposit,
                        enable_hunter_farmer:
                            action.payload.remoteConfigData
                                .enable_hunter_farmer,
                        enable_po: action.payload.remoteConfigData.enable_po,
                        enable_price_menu:
                            action.payload.remoteConfigData.enable_price_menu,
                        enable_profile_menu:
                            action.payload.remoteConfigData.enable_profile_menu,
                        enable_customer_menu:
                            action.payload.remoteConfigData
                                .enable_customer_menu,
                        enable_sph: action.payload.remoteConfigData.enable_sph,
                        enable_transaction_menu:
                            action.payload.remoteConfigData
                                .enable_transaction_menu,
                        enable_visitation:
                            action.payload.remoteConfigData.enable_visitation,
                        enable_invoice:
                            action.payload.remoteConfigData.enable_invoice,
                        force_update:
                            action.payload.remoteConfigData.force_update
                    },
                    isLoading: action.payload.loading
                };
            }
            return {
                ...state,
                isLoading: action.payload.loading
            };
        },
        signout: (state, action: PayloadAction<boolean>) => ({
            ...state,
            userData: null,
            isLoading: action.payload,
            isSignout: true
        }),
        toggleHunterScreen: (state, action: PayloadAction<boolean>) => ({
            ...state,
            hunterScreen: action.payload
        }),
        setShowButtonNetwork: (state, action: PayloadAction<boolean>) => ({
            ...state,
            isShowButtonNetwork: action.payload
        }),
        setVisibleNetworkLogger: (state, action: PayloadAction<boolean>) => ({
            ...state,
            isNetworkLoggerVisible: action.payload
        })
    }
});

export const {
    setPhoneNumber,
    setUserData,
    setSelectedBP,
    setIsLoading,
    signout,
    toggleHunterScreen,
    setShowButtonNetwork,
    setVisibleNetworkLogger
} = authSlice.actions;

export default authSlice.reducer;
