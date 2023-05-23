import bStorage from "@/actions/BStorage";
import storageKey from "@/constants/storageKey";
import {
    setIsLoading,
    setUserData,
    toggleHunterScreen
} from "@/redux/reducers/authReducer";
import { AppDispatch, RootState } from "@/redux/store";
import jwtDecode from "jwt-decode";
import * as React from "react";
import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { isJsonString } from "@/utils/generalFunc";
import remoteConfig from "@react-native-firebase/remote-config";
import BackgroundFetch from "react-native-background-fetch";
import { HUNTER_AND_FARMER } from "@/navigation/ScreenNames";
import { UserModel } from "@/models/User";
import { openPopUp } from "@/redux/reducers/modalReducer";

const useAsyncConfigSetup = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        isLoading,
        userData,
        isSignout,
        remote_config,
        isNetworkLoggerVisible,
        isShowButtonNetwork
    } = useSelector((state: RootState) => state.auth);
    const userDataSetup = React.useCallback(
        async (fetchedRemoteConfig: any) => {
            try {
                const userToken = await bStorage.getItem(storageKey.userToken);
                if (userToken) {
                    const decoded =
                        jwtDecode<UserModel.DataSuccessLogin>(userToken);

                    dispatch(
                        setUserData({
                            userData: decoded,
                            remoteConfig: fetchedRemoteConfig
                        })
                    );
                } else {
                    dispatch(
                        setIsLoading({
                            loading: false,
                            remoteConfig: fetchedRemoteConfig
                        })
                    );
                }
            } catch (error) {
                bStorage.deleteItem(storageKey.userToken);
                dispatch(
                    setIsLoading({
                        loading: false,
                        remoteConfig: fetchedRemoteConfig
                    })
                );
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText:
                            error?.message ||
                            "Terjadi error dalam pengambilan user token",
                        outsideClickClosePopUp: true
                    })
                );
            }
        },
        [dispatch]
    );

    const appStateSetup = React.useCallback(async () => {
        remoteConfig().fetch(300); // in secs
        remoteConfig().setConfigSettings({
            fetchTimeMillis: 10000 // in millies
        });
        remoteConfig()
            .setDefaults(remote_config as any)
            .then(() => remoteConfig().fetchAndActivate())
            .catch((err) => {
                console.log("fetch remote config timeout", err);
            })
            .then(() => {
                let fetchedData = {} as Object;
                Object.entries(remoteConfig().getAll()).forEach(($) => {
                    const [key, entry] = $;
                    let value = remote_config?.[key];
                    if (
                        Object.values(entry).length > 0 &&
                        isJsonString(Object.values(entry)[0])
                    )
                        value = JSON.parse(Object.values(entry)[0]);
                    fetchedData = {
                        ...fetchedData,
                        [key]: value
                    };
                });
                hunterFarmerSetup();
                userDataSetup(fetchedData);
            })
            .catch((err) => {
                hunterFarmerSetup();
                userDataSetup(undefined);
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText:
                            err.message ||
                            "Terjadi error dalam pengambilan App Setup",
                        outsideClickClosePopUp: true
                    })
                );
            });
    }, [dispatch, userDataSetup]);

    const hunterFarmerSetup = React.useCallback(async () => {
        await BackgroundFetch.configure(
            {
                minimumFetchInterval: 60,
                forceAlarmManager: true
            },
            async (taskId) => {
                // <-- Event callback
                const date = await bStorage.getItem(HUNTER_AND_FARMER);
                if (date !== undefined && moment().date() !== date) {
                    setTimeout(
                        () => dispatch(toggleHunterScreen(true)),
                        Platform.OS === "ios" ? 500 : 0
                    );
                } else {
                    await bStorage.setItem(HUNTER_AND_FARMER, moment().date());
                }
                BackgroundFetch.finish(taskId);
            },
            async (taskId) => {
                BackgroundFetch.finish(taskId);
            }
        );
        // And with with #scheduleTask
        BackgroundFetch.scheduleTask({
            taskId: "enableHunterFarmers",
            delay: 0, // milliseconds
            forceAlarmManager: true,
            periodic: false
        });
    }, [dispatch]);

    React.useEffect(() => {
        appStateSetup();
    }, [appStateSetup]);

    return {
        isLoading,
        userData,
        isSignout,
        isNetworkLoggerVisible,
        isShowButtonNetwork
    };
};

export default useAsyncConfigSetup;
