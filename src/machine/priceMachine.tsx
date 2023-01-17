import { getLocationCoordinates } from '@/actions/CommonActions';
import {
  getAllBrikProducts,
  getProductsCategories,
} from '@/actions/InventoryActions';
import { hasLocationPermission } from '@/utils/permissions';
import { Alert } from 'react-native';
import GetLocation from 'react-native-get-location';
import { createMachine, forwardTo } from 'xstate';
import { assign, send } from 'xstate/lib/actions';
export { getLocationCoordinates } from '@/actions/CommonActions';

export const priceMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcBOBLAxmABAWwENMALdAOzADoYAXAGQHtMCb0GzKDYBrABTFR50sWGzIBiCOyrkAbg25U0WXIRLkqtRs1btOPfoOGj2COUxZiA2gAYAurbuIUDUbrLOQAD0QBmAEwArJS+AByBNgAsgaEAnP6hkQkA7AA0IACeiJFJlACMMclFkaF5Cb7JAL6V6crY+ESkFNRg9Bbu+nwCQiJiktKU5oqUdaqNGi1tOmKdhj0mZGZk8tPsjlZ5TkggyK7o7p4+CL4FIeFRMfGJKelZCP5RlABssaFFFb6fSf7VtRj1aiamla2ksegIABsIQwAO6QfrNIZKf5jdTNLTtGaQ6FwiBLFZgsjreyeXZuMSHRBlQKRZ6RMKhUJPEo2PKxPK3bKfSglN7JelsyLMn41HYohpo4FTQmcKGw+ECVAMVAjCEsABmyrwI3FgImGNWHGx8rx5kNxK2LnJ7EpCHinIQ-NClCKNhsvkisRKOV8gV+YpUEqBk1BHUwAFdUKgwGRpe5GAQIPCpIjlgpkYG9eiQZi9BGozG42IE0nTWnzfZHKS9gdtkdIjZYpRQv4wjZQr5Yh6HtEHeym6EbE8nnEInlPnlIv7RkH9TnDZR89HY6HiwxE8mBkidZnxtmi3nI8uD2QS5B8bmiZXNtXrR461SPSFAvyvd84hcHeE8pRAv4SpOsSBL47attOup7lKq6HgWK6XmeEDiIqyqqhqWo7gCkEhpei5HoW0GnuupYXhWDgktsZL7BSD4IA2A6toOHZdkkn6ZIgTLOm6bq+CO-j-pOU6ijOWZQTh0KGgAIq0BDoBCCGSMINAEGQ2AAEpgI0BAAEYQmAVYUTW1GgEcLYOuOgRPGcrx8UB-gvIy4G7pK2ELuJhJSUpsnyRAinKWpGkkNpukbJaOyGTaNGxC8LqlB6FRDk8-hfk+-LDrEUTxFFjaOZhzkGjK6rkPsDDiLAMYQIwZBQGqNAACoMOpEDhl4+lWlREXGexjx5O2Nj+MkXYdolaRsQgk6dpQ7bJN+YTxPyIp-E5wb5R04ZkNGmk6WA4ikEmADqBCoGQ5BQK1YV3ra-GTckw3REK46ROOZmtsEaVshZgRsmyOWost84ykmx2QJQmrRlASprYhBDIMgADCDB4GAABCRDcODDCQwAykpNB6eRbW1p1CClDYlB2YySQxHkyQMg6fGk0kfIWTYNNlF2P2zvuBGUID6DA1pqPo5D4jQ3DCNgAAYsqYBC2QEDYyweOhZRhPeH4QRnBE0RxAkjMjXcAT+DyYQFKyg4RGEgmLblwa1SpnDg2AYCI7GAAS6A+VVpXELCACCjvO4WZ0q0Zav3BZzxPG6-ixPyPFPGyZkWZZTpPAELYvo9VsBjbEx25gDvRoHsaYz7uI7R7YD+0XLs0MH4X3kTdm+NdQQnOy-5vLESd5JZIE09NfGPaUoQcyJky8EqTWYDQlDQomJ2Tww080AiMhpsMwlYbQS8r3PRGL1P4YzyRhIWre7WN2H9qjT2tI9a8jNR0yQFj9vrS78fs-z57UCfzPSEowoWQDVUG2ot55Q-kfGe+8F5VX-jQU+7hz4GQupFQczxPoVFbANP8L46aJVJhZX0yQgg9Q9MkP0QkIKQJoAgxcisoDKj5rABCE9oE0FgCjMqAB5MgsNGHMLgGvQYG8My533PQnQMshGsKIsDHeHCuFcDAHwgRuMmEYDgEg6wlZ8bnUvraE4yR8jxGAt2IcARu630eiYpkNMWZkL4gtHOv05x0I4QwjRsi2GKOXl-ZRvD+GCK0bAQBSoVQgLQoIDCbjJGeOkZolhvioH+JnoE1RwTvGhJ0WsPRysG62leKTJ4WDSEVFsvg2+f4TEJFbHkPIjJxwjjfrQqRITknyIgDqNJbQNyIXYAAUTlupRokB65oKJsY0xbcLFpxjnTT6P5JzhCeNNQcDxJytL+h43pXiZGhLYWgXp8l2Cw2IMpGA6iDksImYYmi0y2SzJYvM6xdw7Isx5A0lmNgaRYNiNs9x7TsmdP6T0le8lozqmjLAJoUA6CKTuarI4jyzFfAeK8umyR3TPBpi+AIPUWalOqKKMgy84CkhoUCC+yLEAAFpPSTS7FERI1lSgNkCA6BlP5Yi8tjrxOyKQniAq5peGlocjh0p-I2EC3o2WTl+Q6aIPIbr9Q7J8E2rIRWiQXFwLoRhegdQMbS2ill0ovE+mOZIjTAhAQdCcUmRR0ogTih2Dl2qXIymNLicVRqjjYpMSBQVrIwgBD6kq6mkcXjuk+uyZOHqVozCXPheCXTfVXyOPi42tqE5lFKYbZ6kb2SCi9IOBKo9qFLXcdzZCqAADirRWBVQIum20acTE0kZCcXujIWZfltS6TsfFSgx2xUyBN-0OhuXcB5GSck02oPuUTDszpO3+HeszNOvgzK-J-JQrsL1PhuheBOk8IMio0AYK2mipRLLRAaY9fqQbt2jXHDdZ4rI06BGAmY3lp7uZrQ2oFLa16iZJBMbygokQBolH-ANB01rghBF1qU3iayqHWziTqgGMY+YQFA2HYav4WYvi7DSKIlCzIBEoJUr4cROztn-ThXmwNQYywhnLAjRx0PEcoQNX0DZoOctvg8GjQ5ybAVZL8pITGFwse6QLTAaMOP4cXSanqI4aObJWUBAU+tED0zE4lEckmeo0hcRA22KkuMGciGZRmzZu08Q00EV+laJFUHzoXJ2td3a-xs46JKr6-xGx4rauDL4Y4nvc1hygXmCAB1rqXE0AX6ScQYkOGk2Ko5vKpH+WkTJbUFC7FFHiFbMOcylAggL-4zJpybI02OqVqYvH-Ke+hP9D69IC6QsypDLLDhyw0xkaywjtYSR0uACEeu5fuEekI7JMvjk+ONvZiSfFdPYb0jJajJvwDUxKxAadpXUmjW6RpzJFllBdCzAIpCBrsiqDFyrW297rcOZt45EKF0E0O2NfqdMcgDg016TsL4poetrQ2mgTaoDXKSRSg7fqqRDzJv1+kltsEvved+u9-UhTTQbKyp71QgA */
  createMachine(
    {
      id: 'price machine',
      type: 'parallel',
      predictableActionArguments: true,
      schema: {
        services: {} as {
          askingPermission: {
            data: boolean;
          };
          getCurrentLocation: {
            data: {};
          };
          fetchLocationDetail: {
            data: {};
          };
        },
        actions: {} as {
          assignCurrentLocationToContext: {
            longlat: { longitude: number; latitude: number };
          };
        },
      },
      context: {
        longlat: {} as { longitude: number; latitude: number },
        locationDetail: {} as any,
        routes: [] as any[],
        size: 10,
        page: 1,
        selectedCategories: '',
        productsData: [] as any[],
        index: 0,
        loadProduct: false,
        isLoadMore: false,
        refreshing: false,
        errorMessage: '' as string | unknown,
      },

      states: {
        getLocation: {
          states: {
            askPermission: {
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
                onDone: [
                  {
                    target: 'currentLocationLoaded',
                    actions: 'assignCurrentLocationToContext',
                  },
                ],
                onError: 'errorGettingLocation',
              },
            },

            currentLocationLoaded: {
              invoke: {
                src: 'fetchLocationDetail',

                onDone: [
                  {
                    target: 'locationDetailLoaded',
                    actions: 'assignLocationDetailToContext',
                    cond: 'isHasResult',
                  },
                  {
                    target: 'currentLocationLoaded',
                    internal: true,
                  },
                ],

                onError: 'errorGettingLocation',
              },
            },

            errorGettingLocation: {},

            locationDetailLoaded: {
              entry: send('distanceReachable'),

              on: {
                distanceReachable: [
                  {
                    target: 'finito',
                    cond: 'isLocationReachable',
                  },
                  'unreachable',
                ],
              },
            },

            finito: {
              on: {
                sendLonglatToRedux: {
                  target: 'finito',
                  internal: true,
                  actions: 'sendingLonglat',
                },
              },
            },

            unreachable: {
              on: {
                hideWarning: 'finito',
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
                    appComeForegroundState:
                      '#price machine.getLocation.askPermission',
                  },
                },
              },

              initial: 'foreground',
            },
          },

          initial: 'askPermission',
        },

        Tnc: {
          states: {
            agreementHiding: {
              on: {
                showAgreement: 'agreementShowed',
              },
            },
            agreementShowed: {
              on: {
                hideAgreement: 'agreementHiding',
              },
            },
          },

          initial: 'agreementHiding',
        },

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
                  target: '#price machine.errorGettingCategories',
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
                      target: '#price machine.errorGettingCategories',
                      actions: 'handleError',
                    },
                    onDone: [
                      {
                        target: 'productLoaded',
                        actions: 'assignProductsDataToContext',
                        cond: 'isNotLastPage',
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
                  },
                },
              },

              initial: 'getProductsBaseOnCategories',
            },
          },

          initial: 'loadingProduct',
        },

        errorGettingCategories: {},
      },
    },
    {
      guards: {
        isHasResult: (context, event) => {
          return event.data?.result;
        },
        isLocationReachable: (context, event) => {
          return context.locationDetail?.distance?.value > 40000;
        },
        permissionGranted: (context, event) => {
          return event.data === true;
        },
        isNotLastPage: (context, event) => {
          return context.page !== event.data.totalPage;
        },
      },
      actions: {
        assignCurrentLocationToContext: assign((context, event) => {
          return {
            longlat: event.data,
          };
        }),
        assignLocationDetailToContext: assign((context, event) => {
          return {
            locationDetail: event.data.result,
          };
        }),
        assignCategoriesToContext: assign((context, event) => {
          const newCategoriesData = event.data.map((item) => {
            return {
              key: item.id,
              title: item.name,
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
        incrementPage: assign((context, event) => {
          return {
            page: context.page + 1,
            isLoadMore: true,
          };
        }),
        refreshPriceList: assign((context, event) => {
          return {
            page: 1,
            refreshing: true,
            loadProduct: true,
            productsData: [],
          };
        }),
        enableLoadProducts: assign((context, event) => {
          return {
            loadProduct: true,
          };
        }),
        handleError: assign((context, event) => {
          return {
            loadProduct: false,
            refreshing: false,
            isLoadMore: false,
            errorMessage: event.data.message,
          };
        }),
      },
      services: {
        askingPermission: async () => {
          const granted = await hasLocationPermission();
          return granted;
        },
        getCurrentLocation: async () => {
          try {
            const position = await GetLocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 15000,
            });
            const { latitude, longitude } = position;
            return { latitude, longitude };
          } catch (error) {
            console.log(error);
          }
        },
        fetchLocationDetail: async (context, event) => {
          try {
            const { longitude, latitude } = context.longlat;
            const response = await getLocationCoordinates(
              '',
              longitude,
              latitude,
              'BP-LEGOK'
            );
            return response;
          } catch (error) {
            console.log(error);
          }
        },
        getCategoriesProduct: async (context, event) => {
          try {
            const response = await getProductsCategories(
              '',
              undefined,
              undefined,
              undefined,
              'BRIK_MIX',
              false
            );
            return response.result;
          } catch (error) {
            throw new Error(error.message);
            // throw new Error(error.message);
          }
        },
        getProducts: async (context, event) => {
          const { page, size, selectedCategories } = context;
          try {
            const response = await getAllBrikProducts(
              '',
              page,
              size,
              selectedCategories
            );
            return response;
          } catch (error) {
            throw new Error(error.message);
          }
        },
      },
    }
  );
