import Geolocation from "react-native-geolocation-service";
import { createMachine } from "xstate";
import { assign, send } from "xstate/lib/actions";
import { getLocationCoordinates } from "@/actions/CommonActions";
import {
    getAllBrikProducts,
    getProductsCategories
} from "@/actions/InventoryActions";
import { hasLocationPermission } from "@/utils/permissions";
import { BatchingPlant } from "@/models/BatchingPlant";

export { getLocationCoordinates } from "@/actions/CommonActions";

export const priceMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOBLAxmABAWwENMALdAOzADoYAXABVQHsIBXTGygG0YInKgbM2NAMQRGFSuQBujANZU0WXIRLkqtQa3ZcefMgKbaaCGY0wEa6CQG0ADAF17DxCkax0Via5AAPRABMAKwAbJR2AJwAzADsACwAHCERQRExEXEhADQgAJ6BUQCMdpQxIUEBAVFxcUF2CdUAvo05Stj4RKSSmkbCurz8WsIiYKhMqJTInJYAZoyoeJMY7apdGmD0vTrcAwZD7KZkshZeZM7OPsjuntZkPv4IhVEp4TF2ARF2ofUNATn5CGCATipUKDSiqQiIRihUKIWarWWKk66moG32HBOYCg83QcAAMnpIGjNkJ2LAAEIEWBgADyZAAwpZsbi4GIJFQzAolsoOmpuuitpjmTiMASiRASRjKdS6YyRazYIdjpZbudHJdrqd7ogYkVKM87CEnmkYgkgmV-oEjVFKE9gYaEnYotCggiQG1kfz1qTjJQsaK8bBCbxiT0yTQZTT6UyaCyxbB2ZIuYokXy1lKhf6FQmQxAw4KI1G5bH40HleZVbZHDZCi4kB6tbcdQg9YUDZ9jc8YmaLdk8oFChlKEFzXFniFu5O3S0PWnVqjw36A4q8wXfcJizGc0GRmN5pNpjQ5gseSsUQKNzoV7mJZmi1To-K44G4BWTmqaxqG1cPNqGw8JpBK87yfN8CS-FagLAiCEFJMaQQuhEwIxO6nrpouhbLju4qhpKaARmuEAiBIACiZAQAASmAnSQBcP5Nt4AG6vqhpdqa5qWgOgKFKEI7mkEfbOgECR6mh84Xj6GLZi+q53gRxhESRjLEAQBhgKWr6wPRbh-s2zGtqxnYmj2nH9gClSIeEURJG8vFxBEvHibyC6XtJN5BkRSyERKIioGAMz+bAXRQPi6CwDQOmNnpTGgA8bYdkaJm9lxFnVBElAOYUZoBG85Tjqhs7oa5UlZh5uH5vhQpKQARkQcgACqMAAkhAnBgFFv43LFfiIE8JR1HYQ0WukcS9lBCTtoNw0xKkkRms557eve2GybeeGUKM4wAOIbFYexCom-k0KguS7TQ+2GEWnWMXcBmwg0mVBHEvEhO8CQfHqUFVJNlCTmkGTxBEZmLV6GZLn0W3zOdl2aYqfkbKdMP8HDCY3TFd1xYgj0OU6glvbE80RN9EIZVEdhwtEolvEaoMYZI1JyHQox4OFHgSEmnJHPIqYuZJlCM8zCxs7c75VmcX71rp3WY71CAWsBMQBOUs0ZEhNlQQ5toOVCjnQghUQunTJUC7ATMsyLHPiMm3PcsV-OCxbsDs2QYunOcdaahjLYK6UysK2ryQa9xwTARE4d5SE5qFDUhWInzy0EJw3AAO6QJzUi27zS0ZknqeQG7n5ON+0v-ljjwBDH1mfI5FMhFHUR-NxoRhGNITAgE7xxMNcTGw7yeMGnxFQxMUyzPMiz24nA9D4X1bF1L0Uyy2hSVyCzo18UcIN03AJjba7xFMrRTRJEz198t+ZkHikontiTAsBRIgEMgyAMoweBgFSmByFAD8UQAZRoMydGy97p2DeJQSawJogulHLEb6MJSgOWSI5J0IQHLKwvhmK+N9KB1R-n-Rgj9iIvzfh-MAAAxeY99iGAOAXGUBZc5a+yVirVI44g4JCgrEW0QM3iV3rh8RI2DUQj0oRsEghIPwSAACIbAIOgTgCMTq5AkTQKRlZTjyOAUoph+ly7pRAsEdIolV5VCgo5MOFQyhBFhFUDIARRGSEwCwMYYAyA0GkeLJS1suayDthJZarj3GeO8acIic8JYLy9mAwxVQ7TpDeOOCm5pIjmT6l8DKYEEjA2Vk6ESURnFUBCf5MJWjbhKRHoecep4p4ZlKR4rxFSJCRLMDI6J+ieoPCMRA94FpgYwkqFESx9cnq5Q+qEQ2jcnFFSCRmbgHSdGKM4L48KwCyDYGop0AgNV2pdNlg8SaGU7GhCHErXieoYhQWKC8ScwJoSJDhN3IpcyE4LJaWQZZSi1kRTUlsmiJBdn7M9gxb2BkEiZDtI3K5zxzmVEsWUA0H0xpJOypNBIxTKCP38jsvZYARCkHzAAdQIKga+BgDk+13n1NuUCUWCSsRUL4WL0BtQJRIAAgmbIWrNnZF1icwwC5MRxDRmqNXsIzuK8OQWkd429hGYreTnVEbL2oiBpBRQYZKCB4G0iXJeQq+oiuml8HsgNzRSoBHUMIFQigzNHGvWoWKR7IwMAyNxZTmkdJUUjPaKNPVNPCQKsFcS5aryrhvSIW966QW4nESoI4qjFAgg3GEZRmizjIMwOAlx5nqEFQYuWABaVeoqhw1AnB8eVVrEDFrDqJOocJ4jJEZb3ZVYNMJXhoIW7piAISZWBl8b4hMAY3MSDEO0tRnS8QBm9Gc8cVVuSzDsfQV1jC9sOYEF64RojxCSCkAG44bkWhBPczhz1kJfFeYuzty6IwyTLBVSAm6WyJFtDHJK44oSTRhDctIwEMGJEhdUIOGCsUQ2vDhYMd5IORkfCWaDr7wG1ANKkF0YrBJjW4SHKoJQ4FDmPvXVIEGsJ9HKjBjaClhBEWQ+XRC7ZP3Gm-VHbKhQSapANHXXJ6RkLwg7fTUqD6KNeVdf6g6RY6Ny0+LaJ0yFpnk3MThiydLkKQsiCfaohRSPds2vuVAbqoCoyDFJh4wJ2waf3a2o9tbAQjUoBkRIKRgi-tmbewTptzbC35T1LqRqEAnz+okGolQhoJvSDw2IsrkhPI+uam9c53mojzoPF9ob-MpEnR9GdKRihfHqJrKODnw5RwtOadu58BMm1wWl0uRajkQXCBAyaTzEiCSCDcyFlBlaVCHIbBo9j23ueqx4vBd8iEkNM4gaIYQhpmhji1gSHWQ5K26ygs0RQY6zqxTVyUBDf7-wgFNx4jcTmZCSEfco9QaWAlWzA6EA2tskaq-zcRkjiDBrkQopRx3jTtm7u3CEsbnTt0sR9KBtRw7PXfRBBdiWl0lMDeUjptH0v1cQNCUZARMofGqJ3D4GDJpYsWeLb5qyJS-dhJlI0VQW5OhdDd4oo5kXAlSDHaooQsU4sBapfFx3YTGkylHBudj6hpGU9NpFEEUJovm0q4b-M1VgGOwmnhSD+HyqERkeX8O71UDExdANoTvXi1+5OsowRhLHK+LCCaECoGdwgUHZ6uPM2NCAA */
    createMachine(
        {
            tsTypes: {} as import("./priceMachine.typegen").Typegen0,
            id: "price machine",
            predictableActionArguments: true,

            schema: {
                services: {} as {
                    askingPermission: {
                        data: boolean;
                    };
                    getCurrentLocation: {
                        data: { latitude: number; longitude: number };
                    };
                    fetchLocationDetail: {
                        data: { result: Record<string, never> };
                    };
                    getProducts: {
                        data: { products: [] };
                    };
                    getCategoriesProduct: {
                        data: any[];
                    };
                },
                events: {} as
                    | {
                          type: "sendingParams";
                          value: { latitude: number; longitude: number };
                          selectedBP: BatchingPlant;
                      }
                    | {
                          type: "assignSelectedBatchingPlant";
                          selectedBP: BatchingPlant;
                      }
                    | {
                          type: "onChangeCategories";
                          payload: number;
                          selectedBP: BatchingPlant;
                      }
                    | {
                          type: "backToGetProducts";
                          selectedBP: BatchingPlant;
                      }
                    | { type: "backToIdle" }
                    | { type: "onEndReached" }
                    | { type: "onAskPermission" }
                    | { type: "refreshingList"; selectedBP: BatchingPlant }
                    | { type: "hideWarning" }
                    | { type: "appComeForegroundState" }
                    | { type: "appComeBackgroundState" }
                    | { type: "retryGettingCurrentLocation" }
                    | { type: "retryFetchLocationDetail" }
                    | { type: "retryGettingCategories" }
                    | { type: "retryGettingProducts" }
            },

            context: {
                longlat: {} as any,
                locationDetail: {} as any,
                routes: [] as any[],
                size: 10,
                page: 1,
                batchingPlantId: undefined as string | undefined,
                batchingPlantName: undefined as string | undefined,
                selectedCategories: "",
                productsData: [] as any[],
                index: 0,
                loadProduct: false,
                isLoadMore: false,
                loadLocation: false,
                refreshing: false,
                totalPage: 1,
                errorMessage: "" as string | unknown
            },

            states: {
                getProduct: {
                    states: {
                        loadingProduct: {
                            invoke: {
                                src: "getCategoriesProduct",
                                onDone: [
                                    {
                                        target: "categoriesLoaded",
                                        actions: "assignCategoriesToContext"
                                    }
                                ],
                                onError: {
                                    target: "errorGettingCategories",
                                    actions: "handleError"
                                }
                            }
                        },

                        categoriesLoaded: {
                            states: {
                                getProductsBaseOnCategories: {
                                    invoke: {
                                        src: "getProducts",
                                        onError: {
                                            target: "errorGettingProducts",
                                            actions: "handleError"
                                        },
                                        onDone: [
                                            {
                                                target: "productLoaded",
                                                actions:
                                                    "assignProductsDataToContext"
                                            },
                                            {
                                                target: "productLoaded",
                                                actions: "assignStopLoadMore"
                                            }
                                        ]
                                    },

                                    entry: "enableLoadProducts"
                                },

                                productLoaded: {
                                    on: {
                                        onEndReached: {
                                            target: "getProductsBaseOnCategories",
                                            actions: "incrementPage"
                                        },

                                        onChangeCategories: [
                                            {
                                                target: "getProductsBaseOnCategories",
                                                actions: "assignIndexToContext"
                                            }
                                        ],

                                        refreshingList: [
                                            {
                                                target: "getProductsBaseOnCategories",
                                                actions: "refreshPriceList"
                                            }
                                        ],

                                        backToGetProducts: {
                                            target: "#price machine.getProduct.categoriesLoaded.getProductsBaseOnCategories",
                                            actions: "resetProduct"
                                        },

                                        backToIdle: "#price machine.idle"
                                    }
                                },

                                errorGettingProducts: {
                                    on: {
                                        retryGettingProducts: {
                                            target: "getProductsBaseOnCategories",
                                            actions:
                                                "handleRetryGettingProducts"
                                        }
                                    }
                                }
                            },

                            initial: "getProductsBaseOnCategories"
                        },

                        errorGettingCategories: {
                            on: {
                                retryGettingCategories: "loadingProduct"
                            }
                        }
                    },

                    initial: "loadingProduct"
                },

                getSelectedBatchingPlant: {
                    on: {
                        assignSelectedBatchingPlant: {
                            actions: "assignSelectedBP",
                            target: "idle"
                        }
                    }
                },

                askPermission: {
                    entry: "enableLoadLocation",

                    invoke: {
                        src: "askingPermission",
                        onDone: [
                            {
                                target: "allowed",
                                cond: "permissionGranted"
                            },
                            "denied"
                        ]
                    }
                },

                allowed: {
                    invoke: {
                        src: "getCurrentLocation",
                        onError: {
                            target: "errorGettingCurrentLocation",
                            actions: "handleErrorCurrentLocation"
                        },
                        onDone: {
                            target: "currentLocationLoaded",
                            actions: "assignCurrentLocationToContext"
                        }
                    }
                },

                denied: {
                    states: {
                        foreground: {
                            on: {
                                appComeBackgroundState: "background"
                            }
                        },
                        background: {
                            on: {
                                appComeForegroundState:
                                    "#price machine.askPermission"
                            }
                        }
                    },

                    initial: "foreground"
                },

                errorFetchLocationDetail: {
                    on: {
                        retryFetchLocationDetail: "currentLocationLoaded"
                    }
                },

                currentLocationLoaded: {
                    invoke: {
                        src: "fetchLocationDetail",

                        onDone: {
                            target: "locationDetailLoaded",
                            actions: "assignLocationDetailToContext"
                        },

                        onError: {
                            target: "errorFetchLocationDetail",
                            actions: "handleErrorFetchLocationDetail"
                        }
                    }
                },

                locationDetailLoaded: {
                    entry: send("distanceReachable"),

                    on: {
                        distanceReachable: [
                            {
                                target: "getProduct.loadingProduct",
                                cond: "isLocationReachable"
                            },
                            "getProduct.loadingProduct"
                        ]
                    }
                },

                unreachable: {
                    on: {
                        hideWarning: "getProduct.loadingProduct"
                    }
                },

                idle: {
                    on: {
                        onAskPermission: "askPermission",
                        sendingParams: {
                            target: "currentLocationLoaded",
                            actions: "assignParams"
                        }
                    }
                },

                errorGettingCurrentLocation: {
                    on: {
                        retryGettingCurrentLocation: "allowed"
                    }
                }
            },

            initial: "getSelectedBatchingPlant"
        },
        {
            guards: {
                isLocationReachable: (context, _event) =>
                    context.locationDetail?.distance?.value < 40000,
                permissionGranted: (_context, event) => event.data === true,
                isNotLastPage: (context, event) =>
                    context.page <= event.data.totalPage
            },
            actions: {
                assignCurrentLocationToContext: assign((_context, event) => ({
                    longlat: event.data
                })),
                assignLocationDetailToContext: assign((_context, event) => ({
                    locationDetail: event.data.result,
                    loadLocation: false
                })),
                assignCategoriesToContext: assign((_context, event) => {
                    const newCategoriesData = event.data.map((item) => ({
                        key: item.id,
                        title: item.name,
                        totalItems: -1,
                        chipPosition: "right"
                    }));
                    return {
                        routes: newCategoriesData,
                        selectedCategories: newCategoriesData[0].title
                    };
                }),
                assignProductsDataToContext: assign((context, event) => {
                    let productsData: any[] = [];
                    if (event.data.products && event.data.products.length > 0) {
                        productsData = [
                            ...context.productsData,
                            ...event.data.products
                        ];
                    }
                    return {
                        totalPage: event.data.totalPage,
                        loadProduct: false,
                        isLoadMore: false,
                        refreshing: false,
                        productsData
                    };
                }),
                assignIndexToContext: assign((context, event) => ({
                    index: event.payload,
                    selectedCategories: context.routes[event.payload].title,
                    page: 1,
                    loadProduct: true,
                    productsData: [],
                    batchingPlantId: event?.selectedBP?.id,
                    batchingPlantName: event?.selectedBP?.name
                })),
                incrementPage: assign((context, _event) => ({
                    page: context.page + 1,
                    isLoadMore: true
                })),
                refreshPriceList: assign((_context, _event) => ({
                    page: 1,
                    refreshing: true,
                    loadProduct: true,
                    productsData: [],
                    batchingPlantId: _event?.selectedBP?.id,
                    batchingPlantName: _event?.selectedBP?.name
                })),
                enableLoadProducts: assign((_context, _event) => ({
                    loadProduct: true
                })),
                assignParams: assign((_context, event) => ({
                    longlat: event.value,
                    loadLocation: true,
                    loadProduct: true,
                    productsData: [],
                    selectedCategories: [],
                    page: 1,
                    batchingPlantId: event?.selectedBP?.id,
                    batchingPlantName: event?.selectedBP?.name
                })),
                assignStopLoadMore: assign((context, event) => ({
                    isLoadMore: false
                })),
                handleError: assign((_context, event) => ({
                    loadProduct: false,
                    refreshing: false,
                    isLoadMore: false,
                    loadLocation: false,
                    errorMessage: event.data.message
                })),
                handleRetryGettingProducts: assign((context, event) => ({
                    productsData: [],
                    page: 1,
                    loadProduct: true
                })),
                handleErrorCurrentLocation: assign((context, event) => ({
                    errorMessage: event.data.message
                })),
                handleErrorFetchLocationDetail: assign((context, event) => ({
                    errorMessage: event.data.message
                })),
                enableLoadLocation: assign((_context, _event) => ({
                    loadLocation: true
                })),
                assignSelectedBP: assign((_context, _event) => ({
                    batchingPlantId: _event?.selectedBP?.id,
                    batchingPlantName: _event?.selectedBP?.name
                })),
                resetProduct: assign((_context, _event) => ({
                    totalPage: 1,
                    loadProduct: false,
                    isLoadMore: false,
                    refreshing: false,
                    page: 1,
                    index: 0,
                    productsData: [],
                    batchingPlantId: _event?.selectedBP?.id,
                    batchingPlantName: _event?.selectedBP?.name
                }))
            },
            services: {
                askingPermission: async () => {
                    try {
                        const granted = await hasLocationPermission();
                        return granted;
                    } catch (error) {
                        throw new Error(error);
                    }
                },
                getCurrentLocation: async () => {
                    const opt = {
                        // timeout:INFINITY,
                        // maximumAge:INFINITY,
                        // accuracy: { ios: "hundredMeters", android: "balanced" },
                        // enableHighAccuracy: false,
                        // distanceFilter:0,
                        showLocationDialog: true,
                        forceRequestLocation: true
                    };
                    const getCurrentPosition = () =>
                        new Promise((resolve, error) =>
                            Geolocation.getCurrentPosition(resolve, error, opt)
                        );

                    try {
                        const response = await getCurrentPosition();
                        const { coords } = response;
                        const { longitude, latitude } = coords;
                        return { longitude, latitude };
                    } catch (error) {
                        throw new Error(error);
                    }
                },
                fetchLocationDetail: async (context, _event) => {
                    try {
                        const { longitude, latitude } = context.longlat;
                        const response = await getLocationCoordinates(
                            longitude,
                            latitude,
                            context.batchingPlantName
                        );
                        return response.data;
                    } catch (error) {
                        throw new Error(error);
                    }
                },
                getCategoriesProduct: async (_context, _event) => {
                    try {
                        const response = await getProductsCategories(
                            undefined,
                            undefined,
                            undefined,
                            "BRIK_MIX",
                            false
                        );
                        return response.data.result;
                    } catch (error) {
                        throw new Error(error);
                    }
                },
                getProducts: async (context, _event) => {
                    const {
                        page,
                        size,
                        selectedCategories,
                        locationDetail,
                        batchingPlantId
                    } = context;
                    const distance = locationDetail?.distance?.value
                        ? locationDetail.distance.value / 1000
                        : 0;
                    try {
                        const response = await getAllBrikProducts(
                            page,
                            size,
                            undefined,
                            selectedCategories,
                            distance,
                            batchingPlantId
                        );
                        return response.data;
                    } catch (error) {
                        throw new Error(error);
                    }
                }
            }
        }
    );
