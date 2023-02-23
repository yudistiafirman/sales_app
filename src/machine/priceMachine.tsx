import { getLocationCoordinates } from '@/actions/CommonActions';
import {
  getAllBrikProducts,
  getProductsCategories,
} from '@/actions/InventoryActions';
import { hasLocationPermission } from '@/utils/permissions';
import Geolocation from 'react-native-geolocation-service';
import { createMachine } from 'xstate';
import { assign, send } from 'xstate/lib/actions';
export { getLocationCoordinates } from '@/actions/CommonActions';

export const priceMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcBOBLAxmABAWwENMALdAOzADoYAXABVQHsIBXTGygG0YInKgbM2NAMQRGFSuQBujANZU0WXIRLkqtQa3ZcefMgKbaaCGY0wEa6CQG0ADAF17DxCkax0Via5AAPRABMAKwAbJR2AJwAzADsACwAHCERQRExEXEhADQgAJ6BUQCMdpQxIUEBAVFxcUF2CdUAvo05Stj4RKSSmkbCurz8WsIiYKhMqJTInJYAZoyoeJMY7apdGmD0vTrcAwZD7KZkshZeZM7OPsjuntZkPv4IhVEp4TF2ARF2ofUNATn5CGCATipUKDSiqQiIRihUKIWarWWKk66moG32HBOYCg83QcAAMnpIGjNkJ2LAAEIEWBgADyZAAwpZsbi4GIJFQzAolsoOmpuuitpjmTiMASiRASRjKdS6YyRazYIdjpZbudHJdrqd7ogYkVKM87CEnmkYgkgmV-oEjVFKE9gYaEnYotCggiQG1kfz1qTjJQsaK8bBCbxiT0yTQZTT6UyaCyxbARmN5pNpjQ5gseSsUQLfX0A4qQxAw4KI1G5bH40HleZVbZHBckB6tbcdY9nkFXu9Pt8Er8rYDgSC+0ljUEXRFgTF3Z6+WspUL-QqE0XiWgI6uICIJABRMgQABKYE6kEbbg82qbDz1hQNn2NzxiZot2TygUKoUoQXNQRfzoCCR6jOSJzqi4Z+gWK4SksG4StujLEAQBhgJWgZwGezYXq2V66vqhoPqa5qWm+g7juEURJG8H5xBEH7AbyqxgaWEHLkGm4wcYm4iKgYAzDxsBdFA+LoLANAYVcWHeDhCA3neRomk+RGvgCVQ0ZQNGFGaARvOUcSxPR2beguEZLnGaHBtB66cXBABGRByAAKowACSECcGA4ktlJoAPE8JR1HYgUWukcTPgOCS3gFQUxKkkRmgZXrzuB+aseKoaSqM4wAOIbFYexComPE0KguQ5TQeWGGWnmSXc0mwg06lBHEH4hO8CQfHqA5VBFlAhI+GTxBESkJaBuYYpQmXzGVFWoYq3EbCV038LNCbVTc3l+IgDU0U6v6tbEcURF1EIRAadhwtEgFvEaI2MZI1JyHQox4CJHgSOykhcooIF3VQD1PQsr23DWJxqg2GpNhJ621T5iAWp2MQBOUMUZBOFEDjRto0VCtHQmOUQurdOZ-bAj3PUD73iJ9RzyN9DHE5Q-3k7Ab1kCDdZnA2hQuJDXkw5tCDw6USPw6jyToyRwSdhEMs6SE5qFDU04tB6P0MwQnDcAA7pAH2cjT3Kzr9jOa4wOsQOzpzqjz57Q22hQBIr5GfLR50hPLUR-CRoRhKFITAgE7xxEFcRE0ZGva7rk0TFMszzIsRvq6b5uW2DTgQ7bl6w48jsgs6LvFHCHtewCoW2u8RRI0U0SRE1YfzsWZB4pKGbYkwLD7iIBDIMgDKMHgYBUpgchQO3+4AMo0Mya1ZwLxRvJQEXAtELrfrEXUwqUNHJLRTohDRSP16ijfN5QdnD6PjAd1u3e9-3YAAGLzG3V8T1PcYz9h2dC4jyOpHp4sEgDliLaQabxHbuw+IkI+kho4Pw2CQQkoMJAABENgEHQJweaxVcjwJoIg2spw0FT0wZ-DaDxqinTsOAi0Q0YSVCiAOWi0sKhlCCLCKoGQAgwKoJgFgYwwBkBoEgjmXEqb61kIbNWRk+ECKESI04m5U71nTjbTCdtpKe1tJpNIdg9LnXNJEZSiBiipEoD2BIQ0kZOgAlEHh-p+E8XkYQ24XFo6pjjpmROMjHGCOES4iQSizDIM5qozUNU2yUK7MEdIgEHZVCYe7Rq2l2qhAJp7bhKtvHzm4CE4hGDOBiJElPMg2AjydAIDZdyZD+YPAiqddhoRChpEdhadeJFigvD6sCaEiQ4TBzsVk6ROSAlkHyZgopokkJlOPCQSp1TubhI0dnBImQ7Sez1HqWiLSS6IDSGECiU50gwjNGCexHceIVKqWAEQpBiwAHUCCoCbgYGpbYKgDkVmURe7VaipA-BUL49j0BuRuRIAAgqTAGL0WZpyWbPXyUR-KBWiiFZ8jCSIgK3roiB-sMgJGBaCkQNJ9yDCeQQPAsA3l1SRV+FFXwnwDXNBigEdQwgVCKBk78udaj2OjktAwDJfHOJCdgxauVlrCv8SE6l2cHZO3zpEQu7t+wkTiJUL8VRih9g9ic+EQz6ZGWSjoSCbFoLGsjFSaM8ozJzXEVIA2dNDJJWYilW1UF0rGWMOWGMqUlTBI5ucRZvMInSVkvhBSz5iIqWaSCb8TVnh9X2RCZoKsyDMDgJcYZ6h4VfwFgAWgdnS2NekoQfHeE8Ac+awj0sCuA7SaRVlugNc6pieZ2C5vIYgCE6khpfG+AdNIR0OmJBiOsh0MsK7JEyYiQ1Lr20cB2PoSqxhO21MCM1cI0R4hJBSEOvSnyLQgm6QApqk4viDNna2sai5TVpWLBANdbZEjaODsaUt8tNKFE+WkTsJ71V6QhEUZWV7EptvGneiynqLU+ptVWTNIbllzz0Z2E6LoUW-lCkAyWVQSir2aVXd2qR7EWtMvBqDD6OLCE3E+6S45byK3kh+iKMJjpmKRXCSx6RJz6tA6NH0EG-XsX5RK-KZZaPZ0+LaJ0k50kccqNhlSftzEAWDtEZp1RCgkddToET5Vlp+okwLYEt5IixESMkVIIUWWBGCuYmoliKjfk0jO1Wc7URM0BrCjaUMEXduab1RINRKiBXVekYBsRsXJD6e1Rll63PXr+snSARmHgpDHe1Z0zT2FBXqBjeW5iZbywtOaf2dcW1gckCfFLiG-MIBHOEahEU+mJF-EET5qzKDL3dhs0ImRJz2Oqy3Z+l9r6pb2S6RrpyWs-na5LRGXXt5miKIrD8ERBuCNPufEeY9H21bzYij4X5MhJEruUeouzAQLe68t2EzViMVf4xNZMqA8EELyegzB42EDGlvG+qoPsnQuku1YxetQZZNRfX2ZtfHjayKcdK0REpvvQkSQEdSHxqiBw+PvCK9jckc3GYU5H+2u0-dhOpI0AOVXOn9p8r4CQDS-P+XpWovGEuVaoBc2ZiFrnfdhMadS8sPY5a44pvZ3y+xHLSJpCKBLHvGxBe5b76rgGbzARWyB+K+UvYFVAIVcjEez18wdraMQmHOhU9EVqTVp0VFTY0IAA */
  createMachine(
    {
      tsTypes: {} as import('./priceMachine.typegen').Typegen0,
      id: 'price machine',
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
            data: { result: {} };
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
              type: 'sendingParams';
              value: { latitude: number; longitude: number };
            }
          | {
              type: 'onChangeCategories';
              payload: number;
            }
          | { type: 'backToIdle' }
          | { type: 'onEndReached' }
          | { type: 'onAskPermission' }
          | { type: 'refreshingList' }
          | { type: 'hideWarning' }
          | { type: 'appComeForegroundState' }
          | { type: 'appComeBackgroundState' }
          | { type: 'retryGettingCurrentLocation' }
          | { type: 'retryFetchLocationDetail' }
          | { type: 'retryGettingCategories' }
          | { type: 'retryGettingProducts' },
      },

      context: {
        longlat: {} as any,
        locationDetail: {} as any,
        routes: [] as any[],
        size: 10,
        page: 1,
        selectedCategories: '',
        productsData: [] as any[],
        index: 0,
        loadProduct: false,
        isLoadMore: false,
        loadLocation: false,
        refreshing: false,
        totalPage: 1,
        errorMessage: '' as string | unknown,
      },

      states: {
        getProduct: {
          states: {
            loadingProduct: {
              invoke: {
                src: 'getCategoriesProduct',
                onDone: [
                  {
                    target: 'categoriesLoaded',
                    actions: 'assignCategoriesToContext',
                  },
                ],
                onError: {
                  target: 'errorGettingCategories',
                  actions: 'handleError',
                },
              },
            },

            categoriesLoaded: {
              states: {
                getProductsBaseOnCategories: {
                  invoke: {
                    src: 'getProducts',
                    onError: {
                      target: 'errorGettingProducts',
                      actions: 'handleError',
                    },
                    onDone: [
                      {
                        target: 'productLoaded',
                        actions: 'assignProductsDataToContext',
                        cond: 'isNotLastPage',
                      },
                      {
                        target: 'productLoaded',
                        actions: 'assignStopLoadMore',
                      },
                    ],
                  },

                  entry: 'enableLoadProducts',
                },

                productLoaded: {
                  on: {
                    onEndReached: {
                      target: 'getProductsBaseOnCategories',
                      actions: 'incrementPage',
                    },

                    onChangeCategories: [
                      {
                        target: 'getProductsBaseOnCategories',
                        actions: 'assignIndexToContext',
                      },
                    ],

                    refreshingList: [
                      {
                        target: 'getProductsBaseOnCategories',
                        actions: 'refreshPriceList',
                      },
                    ],

                    backToIdle: '#price machine.idle',
                  },
                },

                errorGettingProducts: {
                  on: {
                    retryGettingProducts: {
                      target: 'getProductsBaseOnCategories',
                      actions: 'handleRetryGettingProducts',
                    },
                  },
                },
              },

              initial: 'getProductsBaseOnCategories',
            },

            errorGettingCategories: {
              on: {
                retryGettingCategories: 'loadingProduct',
              },
            },
          },

          initial: 'loadingProduct',
        },

        askPermission: {
          entry: 'enableLoadLocation',

          invoke: {
            src: 'askingPermission',
            onDone: [
              {
                target: 'allowed',
                cond: 'permissionGranted',
              },
              'denied',
            ],
          },
        },

        allowed: {
          invoke: {
            src: 'getCurrentLocation',
            onError: {
              target: 'errorGettingCurrentLocation',
              actions: 'handleErrorCurrentLocation',
            },
            onDone: {
              target: 'currentLocationLoaded',
              actions: 'assignCurrentLocationToContext',
            },
          },
        },

        denied: {
          states: {
            foreground: {
              on: {
                appComeBackgroundState: 'background',
              },
            },
            background: {
              on: {
                appComeForegroundState: '#price machine.askPermission',
              },
            },
          },

          initial: 'foreground',
        },

        errorFetchLocationDetail: {
          on: {
            retryFetchLocationDetail: 'currentLocationLoaded',
          },
        },

        currentLocationLoaded: {
          invoke: {
            src: 'fetchLocationDetail',

            onDone: {
              target: 'locationDetailLoaded',
              actions: 'assignLocationDetailToContext',
            },

            onError: {
              target: 'errorFetchLocationDetail',
              actions: 'handleErrorFetchLocationDetail',
            },
          },
        },

        locationDetailLoaded: {
          entry: send('distanceReachable'),

          on: {
            distanceReachable: [
              {
                target: 'getProduct.loadingProduct',
                cond: 'isLocationReachable',
              },
              'unreachable',
            ],
          },
        },

        unreachable: {
          on: {
            hideWarning: 'getProduct.loadingProduct',
          },
        },

        idle: {
          on: {
            onAskPermission: 'askPermission',
            sendingParams: {
              target: 'currentLocationLoaded',
              actions: 'assignParams',
            },
          },
        },

        errorGettingCurrentLocation: {
          on: {
            retryGettingCurrentLocation: 'allowed',
          },
        },
      },

      initial: 'idle',
    },
    {
      guards: {
        isLocationReachable: (context, _event) => {
          return context.locationDetail?.distance?.value < 40000;
        },
        permissionGranted: (_context, event) => {
          return event.data === true;
        },
        isNotLastPage: (context, event) => {
          return context.page <= event.data.totalPage;
        },
      },
      actions: {
        assignCurrentLocationToContext: assign((_context, event) => {
          return {
            longlat: event.data,
          };
        }),
        assignLocationDetailToContext: assign((_context, event) => {
          return {
            locationDetail: event.data.result,
            loadLocation: false,
          };
        }),
        assignCategoriesToContext: assign((_context, event) => {
          const newCategoriesData = event.data.map((item) => {
            return {
              key: item.id,
              title: item.name,
              totalItems: 0,
              chipPosition: 'right',
            };
          });
          return {
            routes: newCategoriesData,
            selectedCategories: newCategoriesData[0].title,
          };
        }),
        assignProductsDataToContext: assign((context, event) => {
          const productsData = [
            ...context.productsData,
            ...event.data.products,
          ];
          return {
            totalPage: event.data.totalPage,
            loadProduct: false,
            isLoadMore: false,
            refreshing: false,
            productsData: productsData,
          };
        }),
        assignIndexToContext: assign((context, event) => {
          return {
            index: event.payload,
            selectedCategories: context.routes[event.payload].title,
            page: 1,
            loadProduct: true,
            productsData: [],
          };
        }),
        incrementPage: assign((context, _event) => {
          return {
            page: context.page + 1,
            isLoadMore: true,
          };
        }),
        refreshPriceList: assign((_context, _event) => {
          return {
            page: 1,
            refreshing: true,
            loadProduct: true,
            productsData: [],
          };
        }),
        enableLoadProducts: assign((_context, _event) => {
          return {
            loadProduct: true,
          };
        }),
        assignParams: assign((_context, event) => {
          return {
            longlat: event.value,
            loadLocation: true,
            loadProduct: true,
            productsData: [],
            selectedCategories: [],
            page: 1,
          };
        }),
        assignStopLoadMore: assign((context, event) => {
          return {
            isLoadMore: false,
          };
        }),
        handleError: assign((_context, event) => {
          return {
            loadProduct: false,
            refreshing: false,
            isLoadMore: false,
            loadLocation: false,
            errorMessage: event.data.message,
          };
        }),
        handleRetryGettingProducts: assign((context, event) => {
          return {
            productsData: [],
            page: 1,
            loadProduct: true,
          };
        }),
        handleErrorCurrentLocation: assign((context, event) => {
          return {
            errorMessage: event.data.message,
          };
        }),
        handleErrorFetchLocationDetail: assign((context, event) => {
          return {
            errorMessage: event.data.message,
          };
        }),
        enableLoadLocation: assign((_context, _event) => {
          return {
            loadLocation: true,
          };
        }),
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
            forceRequestLocation: true,
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
              'BP-LEGOK'
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
              'BRIK_MIX',
              false
            );
            return response.data.result;
          } catch (error) {
            throw new Error(error);
          }
        },
        getProducts: async (context, _event) => {
          const { page, size, selectedCategories, locationDetail } = context;
          const distance = locationDetail?.distance?.value / 1000;
          try {
            const response = await getAllBrikProducts(
              page,
              size,
              undefined,
              selectedCategories,
              distance
            );
            return response.data;
          } catch (error) {
            throw new Error(error);
          }
        },
      },
    }
  );
