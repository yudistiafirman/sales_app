import { getLocationCoordinates } from '@/actions/CommonActions';
import {
  getAllBrikProducts,
  getProductsCategories,
} from '@/actions/InventoryActions';
import { hasLocationPermission } from '@/utils/permissions';
import GetLocation from 'react-native-get-location';
import { createMachine } from 'xstate';
import { assign, send } from 'xstate/lib/actions';
export { getLocationCoordinates } from '@/actions/CommonActions';

export const priceMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcBOBLAxmABAWwENMALdAOzADoYAXAGQHtMCb0GzKDYBrABTFR50sWGzIBiCOyrkAbg25U0WXIRLkqtRs1btOPfoOGj2COUxZiA2gAYAurbuIUDUbrLOQAD0QBmAEwArJS+AByBNgAsgaEAnP6hkQkA7AA0IACeiJFJlACMMclFkaF5Cb7JAL6V6crY+ESkFNRg9Bbu+nwCQiJiktKU5oqUdaqNGi1tOmKdhj0mZGZk8tPsjlZ5TkggyK7o7p4+CL4FIeFRMfGJKelZCP5RlABssaFFFb6fSf7VtRj1aiamla2ksegIABsIQwAO6QfrNIZKf5jdTNLTtGaQ6FwiBLFZgsjreyeXZuMSHRBlQKRZ6RMKhUJPEo2PKxPK3bKfSglN7JelsyLMn41HYohpo4FTQmcKGw+ECVAMVAjCEsABmyrwI3FgImGNWHGx8rx5kNxK2LnJ7EpCHinIQ-NClCKNhsvkisRKOV8gV+YpUEqBk1BHUwAFdUKgwGRpe5GAQIPCpIjlgpkYG9eiQZi9BGozG42IE0nTWnzfZHKS9gdtkdIjZYpRQv4wjZQr5Yh6HtEHeym6EbE8nnEInlPnlIv7RkH9TnDZR89HY6HiwxE8mBkidZnxtmi3nI8uD2QS5B8bmiZXNtXrR461SPSFAvyvd84hcHeE8pRAv4SpOsSBL47attOup7lKq6HgWK6XmeEDiIqyqqhqWo7gCkEhpei5HoW0GnuupYXhWDgktsZL7BSD4IA2A6toOHZdkkn6ZIgTLOm6bq+CO-j-pOU6ijOWZQTh0KGgAIq0BDoBCCGSMINAEGQ2AAEpgI0BAAEYQmAVYUTW1GgEcLYOuOgRPGcrx8UB-gvIy4G7pK2ELuJhJSUpsnyRAinKWpGkkNpukbJaOyGTaNGxC8LqlB6FRDk8-hfk+-LDrEUTxFFjaOZhzkGjK6rkPsDDiLAMYQIwZBQGqNAACoMOpEDhl4+lWlREXGexjx5O2Nj+MkXYdolaRsQgk6dpQ7bJN+YTxPyIp-E5wb5R04ZkNGmk6WA4ikEmADqBCoGQ5BQK1YV3ra-GTckw3REK46ROOZmtsEaVshZgRsmyOWost84ykmx2QJQmrRlASprYhBDIMgADCDB4GAABCRDcODDCQwAykpNB6eRbW1p1CClDYlB2YySQxHkyQMg6fGk0kfIWTYNNlF2P2zvuBGUID6DA1pqPo5D4jQ3DCNgAAYsqYBC2QEDYyweOhZRhPeH4QRnBE0RxAkjMjXcAT+DyYQFKyg4RGEgmLblwa1SpnDg2AYCI7GAAS6A+VVpXELCACCjvO4WZ0q0ZavHP4P5AV6EQk-EnZmUUTatuOPEtoO6ULQGNsTHbmAO9GgexpjPu4jtHtgP7BcuzQwfhfeRMBM6FTvf4sQDa+sQJwkLrpaBfFPMBQ4cyJky8EqTWYDQlDQomJ1jwwE80AiMhpsMwlYbQ8+L9PRFz+P4aTyRhIWre7X12H45Nm3PWfDTjYNq2dMVMEL7DkKvcPG8w8b60W8H1PM9PZQD-pPJCUYULIBqqDbU688q-33pPHes8qogJoEfdwJ8DIXUioOZ4n0KitgGn+F8dNEqkwsr6ZIQQb6RGSH6ISEE4E0FQYuRWUBlR81gAhUeCCaCwBRmVAA8mQWGbCOFwGXoMVeGZs77hYToGW4iuFEWBpvXh-CuBgGEaI3G7CMBwHQdYSs+Nzpn1tDxYIeQni+ieMkAoBRWaBDpq+EIHo8juNbjYCyeRv5MPkWI-RyiNwQB4Qvf+GihEiICZwsBSoVSQLQoIDCv05zMN4aw3RSjuFqLCZPCJWiomZMCYYtYxjlZ11tK8UmA9xxUIqLZEho0gj9TJi2E4eRGTjhHL4v6aTclTwUXozh3C0D9PkuwAAonLdSjRIC12wQ3Ae+RrEWTsZ9F8JwnFNOuM8Aozd+w0iiD01J-iinDJUSE0Zi9xkiOIMpGAOjFGBPmWYmiFjlk2LWQ4zZdNBrNiKG8bWORprHLkekwZWSLk6jGRc8Q0Z1TRlgE0KAdBFIvNVkcd5VjPn2I2QUB0IFfT5AbBUKhnpHqBHoaKMgC84CkkYUCU+GLEAAFpPSTS7FERI1lSgNi2XcNlkdYjCuFW6SlNIwIMKWqkgiTLQ5HBZT+RsIFvQ8snF4h00QeQ3V1tTN0bxOxPFBaJBcXAuhGF6B1UxzLaKWXSi8dZrI7HhCAgSnqLoBrundPSDsfLjUuRlMaXEcqrVHGSCzEIfUyHjg7A8JKo1HrJGeGld0n12QWSNVK2RJqZRLnwvBC5Ibz5HA2cbQIUUPED0Ns9amlB2SCi9IOBKoR-UrRmMhVAABxVorAqqyqwa8om1ik00kZO0kcg59bsXLS6TsfFSit3DUyVt-0OhuXcB5GSclC0DptR2Z0o6I5AWZtY3wZkvE-joV2F6nw3QvBXSeEGRUaAMCLbaUollojuMev1ECj9Rq1Msk8VkKzgLxHLbEB93M1obUCltN9NEkhJuFQUWhjb-wDQdGssmf5EgD14rY+h1sUlcxwrzSACGh0tIiHQgavoGy0P5Y+I2DTqYkr6gyKDZGYx8xCaDGWEM5aUbDoR38LMXxdkOYxumDw61DnJoPHqEquMLnIyEgWmA0aCYgMJo4PURx1oeN+0cAop33Fk-ahTIElNJH9bnXT7Ek7CqSPpqhZD413CsY9EIMavTFAbHYuz9sCAB2ru7IBDmxoVDJs5iOQ43NxoTk+RITIUjluZBZILecQtV0LMXE0kWLYhFbHxG640bJJaTR6JkbIvRsnCJm4jnMpSoMi3Yutdj3QfHvhxsybdqkZrKF4whZQH0sMAXvfpkX3FX067fECXpetNK8c6ccCRbIJFZL4Mb4LolwAQtNuyHWb7dcW-+u4dkng-nCO8Vs7IGyTh2-0jJTzznBNCYvfJ2i9vwF3fKxAtjnSvB4n1VmZRbF00SLSNj45Yfgca1nEjLXdtnP21Cq5-8Dt-dDVSfkx2ut3zO2epp00fz9VfIkX0UQbr+o7d2mgvaoCPKGXS7HxaqR8VpP1Oy9JLYEOJxdyln7+pCmmg2blVRqiVCAA */
  createMachine(
    {
      tsTypes: {} as import('./priceMachine.typegen').Typegen0,
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
        events: {} as
          | { type: 'getCurrentLocation'; data: {} }
          | { type: 'fetchLocationDetail'; data: { result: {} } },
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
        isHasResult: (_context, event) => {
          return event.data?.result;
        },
        isLocationReachable: (context, _event) => {
          return context.locationDetail?.distance?.value > 40000;
        },
        permissionGranted: (_context, event) => {
          return event.data === true;
        },
        isNotLastPage: (context, event) => {
          return context.page !== event.data.totalPage;
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
          };
        }),
        assignCategoriesToContext: assign((_context, event) => {
          const newCategoriesData = event.data.map((item) => {
            return {
              key: item.id,
              title: item.name,
              totalItems:0,
              chipPosition:'right'
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
        handleError: assign((_context, event) => {
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
        fetchLocationDetail: async (context, _event) => {
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
        getCategoriesProduct: async (_context, _event) => {
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
        getProducts: async (context, _event) => {
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
