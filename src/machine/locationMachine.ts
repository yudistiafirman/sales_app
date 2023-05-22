import { Dimensions } from "react-native";
import { assign, createMachine } from "xstate";
import { getLocationCoordinates } from "./priceMachine";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const LATITUDE = -6.18897;
const LONGITUDE = 106.738909;
export const locationMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QBsD2BjAhgFwJaoDsA6AJzHTFwDdcCoAFTEzAW1gGJYwCJaoBhVKhKNmbANoAGALqJQAB1SxceQnJAAPRACYAzNqLbtAdgCs2gBznj2gJy3dAFgA0IAJ6JdANi9FHd3VNdCwsARl1JXVCAX2jXNCxVYjIKaj5RVg5CfgALTDowACUwKHwCKVkkEEVlJPUtBD0DIzNLazsHF3cdPSJjSWNHMONw+zsvWPiMHDKiGGw8OgAZaaSAETBsTFxkDghCMCJaKlQAa0OEmcI5zcWoFcSyja2d2ARj1bKKivUalTL6ohBhYiF5bNpTI5wUZIvZXB4EGE-MYvHpvGFQqFTGFJiBLkkiBAwAAjVAAVwIFHYGlgW2wh0wADN6SQABSmSSSACU7HxsyJpIpFB+VT+dSqDWBoPBkOh2lhtnhOiGRFCkgsxgioQskW0YOMsTiIAIqCJ8CqfLUoqU-ytoAaAFosQYvDYhrYvN5bFCvKYlQgHb5OcHwtqvEMzBMjZbkuRKDQ6Bk2L8beL7YgnZJHKC3RYPV6fX7uo1w0RTOXTB7QvZJK7bLiYzcFnwHlcCM9trsU7UARLEGrwqDHMFJKFUZXvcZ-UZfJivFZbDqR0YG59rgLyZSwN3bQRAQghqEiLZQhDtJjQpqPUWEUZdKCxwulzrz1HYkA */
    createMachine(
        {
            id: "location",
            predictableActionArguments: true,
            tsTypes: {} as import("./locationMachine.typegen").Typegen0,
            schema: {
                events: {} as
                    | {
                          type: "sendingCoorParams";
                          value: { longitude: number; latitude: number };
                      }
                    | {
                          type: "onChangeRegion";
                          value: {
                              longitude: number;
                              latitude: number;
                              latitudeDelta: number;
                              longitudeDelta: number;
                          };
                      },
                services: {} as {
                    onGettingLocationDetails: {
                        data: {
                            formattedAddress?: string;
                            PostalId?: number;
                            lon: number;
                            lat: number;
                        };
                    };
                }
            },
            context: {
                region: {
                    latitude: LATITUDE,
                    longitude: LONGITUDE,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                },
                locationDetail: {},
                loadingLocation: false
            },
            states: {
                receivingParams: {
                    on: {
                        sendingCoorParams: {
                            target: "gettingLocationDetails",
                            actions: "assignParamsToContext"
                        },

                        onChangeRegion: {
                            target: "debounce",
                            actions: "assignOnChangeRegionValue"
                        }
                    }
                },

                gettingLocationDetails: {
                    invoke: {
                        src: "onGettingLocationDetails",
                        onDone: {
                            target: "receivingParams",
                            actions: "assignLocationDetail"
                        }
                    }
                },

                debounce: {
                    entry: "enabledLoadingDetails",

                    after: {
                        500: "gettingLocationDetails"
                    }
                }
            },

            initial: "receivingParams"
        },
        {
            actions: {
                assignParamsToContext: assign((context, event) => ({
                    region: {
                        latitude: event.value.latitude,
                        longitude: event.value.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    }
                })),
                assignLocationDetail: assign((context, event) => ({
                    locationDetail: {
                        formattedAddress: event.data?.formattedAddress
                            ? event.data.formattedAddress
                            : "",
                        postalId: event.data?.PostalId,
                        lon: event?.data?.lon,
                        lat: event?.data?.lat
                    },
                    loadingLocation: false
                })),
                assignOnChangeRegionValue: assign((context, event) => ({
                    region: {
                        latitude: event.value.latitude,
                        longitude: event.value.longitude,
                        latitudeDelta: event.value.latitudeDelta,
                        longitudeDelta: event.value.longitudeDelta
                    }
                })),
                enabledLoadingDetails: assign((context, event) => ({
                    loadingLocation: true
                }))
            },
            services: {
                onGettingLocationDetails: async (context, event) => {
                    const { latitude, longitude } = context.region;
                    const response = await getLocationCoordinates(
                        longitude,
                        latitude
                    );
                    return response.data.result;
                }
            }
        }
    );
