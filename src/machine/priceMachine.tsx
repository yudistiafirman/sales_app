import { getLocationCoordinates } from '@/Actions/CommonActions';
import {
  getAllBrikProducts,
  getProductsCategories,
} from '@/Actions/InventoryActions';
import { hasLocationPermission } from '@/utils/permissions';
import { Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { createMachine } from 'xstate';
import { assign, send } from 'xstate/lib/actions';
export { getLocationCoordinates } from '@/Actions/CommonActions';

export const priceMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcBOBLAxmABAWwENMALdAOzADoYAXABVQHsIBXTGygG0YInKgbM2NAMQRGFSuQBujANZU0WXIRLkqtQa3ZcefMgKbaaCGY0wEa6CQG0ADAF17DxCkax0Via5AAPRABMAOwALJQArHZRdgCMAMwAHCEJAJxxdiEANCAAnoFBcXGUAGyxpcUJBUFBMUEAvnXZStj4RKSSmkbCurz8WsIiYKhMqJTInJYAZoyoeGMYLartGmD0XTrcvQb97KZkshZeZM7OPsjuntZkPv4IMSF2xZQBdnH3cSEpD+HF2XkIAS+QRKQRSQUB9x+4QCcQaTQWKja6moqx2HEOYCgM3QcAAMnpICi1kJ2LAAEIEWBgADyZAAwpZMdi4GIJFQzAp5spWmoOqj1ujGViMHiCRAiWjyZSafShczYHsDpYridHGcLkcbohQuESpVIuFwulYm8-oFkrrij9AWl4gkAsU4SBmojeSticZKBjhTjYPjeITOiSaFKqbSGTQmSLYINhjMxhMaNNZlzFki+R7ut75f6IIH+cHQzKI1HfYrzMrbI5TkhnRqrlq7g8ni83iEPl87D8zQDisVgX2AuEQv2vikUkanS6ecsJQKvXLo7nCWhg8uICIJABRMgQABKYDakBrbg8mtrtx1eqCBqNUXiMR7Q9Bzw+ISHH2KMQnU4RM+RQaetmS5ivMa5ipu9LEAQBhgCWPpwCedZng2F7aiElr6l2d4mo+uSBP2uoJDEQ4hEEX4JHYN4JL+3JLABBZAYuvrrmBxjriIqBgJMXGwO0UC4ugsA0Eh5wod4aEIFeFQ3thxoPk+1QBJQcQpI8xQpAkqQTsUIS0WmbpzsGC6Rghfqgau7EQQARkQcgACqMAAkhAnBgKJ9YSaAtxxA6lCUSOKTFAEWnJBhPbEZQnzjmCcTBek7Y0Y0zp-vRkiUnIdBDHgQkeBIrKSByiipemVAZVlsy5Vc5aHCq1ZqrWYmXF5fiINCPYxEaTydcUxrVG8MQxPprqzuV2VVfl4iFfs8jFXRpWUGNlWwHlZA1ZWxzVjELiNZ51ySe1+EIG84QpM8MSVCkDrxBkw3-ulnDcAA7pABXsjNnLTmlZWPYwL0QOtRyqjtp7Nft3mIG8TwBRpwWhUk4RPpp-khSRUQJEalRJfC82GQQv3-bGIwJlMMxzF9C3489kCA3VTgNaD54Q8djz+RksMhUkCM9r1ynNgEGFkRk47hHd32UHmZA4uKyaYkwLC7iIBDIMgdKMHgYAUpgchQPLu4AMo0IyHnieDrUIMOwJUcRIQXROiThHh-xvKElBBZdnWQqCjrJRThmS9LlC2druuMArG7K6r6tgAAYjMcthwbRuRibYONsFPbpKpUUyVdMQUXE9S+yVhlDCMADiqxWAY+K1flvjCYyi2TJGqAABSRHYACUIh+7OZczJXNDVwJFZAwzyFp5JAC0JHKTCCSF2RI43uRWRHYN6T+XFfY3uOASc2LC2YCwwxgGQNC1xtHFTe9sifSXs4n2fF9X0c6601W9Mg5PTPm4v0NWwhRSJCPsKQnwZAiIvXyV0+ynVKNjFKuMn6ny4q-MeVwOID1GOMUmKY+7Imfmgy+GCJAfzMHXTa391Sm0bAAlGrxgGgI0j2R2RQeoCytBUIKsQj6GW4JQgAIqsAg6BOA3yEkbMg2ADxtAINZNyqc-63BCspI0akvy6WCKUAIHVahFA0SFW2kQXj2j4bOARG1hFGzERIxu0iwCyJIPIxR20aFT2ZqoiIqlHj53fOROwuiN5djCFwh045QRLz0sXZByIFZcTkQosAIhSB5gAOoEFQFLAwSjULM3BBArslAqKAgojUDShpzHInQK5ZJEgACCsBMrjRWnTdxyjIb5zZoFOGXNwpHVUnzR4nDBrVHCOCWEMSDKzhqW5EQVJdx9EyQQPAsBcktR8n5GGQVOZhURkdF489opgmInESINQGjJTIMwOAZxH7qHaXk82s8gh2FfIvUIoRCJrx7NPXUMUdldliKdOKQ0pkjQYpmdgjyNmBEGhEaIJouZpAyB1NSZ0uGFCtA6V4dhEEEIzGiHo+hDDBhhWbFRp0EXRDtMkFF69-jfjBJQDhE40hJC+D7HG0zIVEuAixMU5LGzRWeMcrSwR7gVCfKpBILLrTBXUZRXSVTCXzn5aKAM4pALCCLOGZitzdq0MkjELsZ13bUTxZ2bsByrRFBePnTqdgwQqvdHy-V5lNVsWEOuIVB0yKipiuKmoI4EiKXtM8Xqjw4olNIi6yg2Ch4j3gvKX1zM-GytGa2e0bxs1Plhm7R2FEuGghSHGpaOVWktSah0hA7YwivLeICMiw4PkdULk8QxvUzmvB1GWgmkBU3m3fJnb8bs85qX0Xi6EcaA4DsNR482cVdTW3iIkIIlF85dkzni4EIabzLy7FypBPLJCzplvHUO4dB23FtkUFdhQsZlC3QM2ouo93VFBJ8MKM7z6B2DjrPWEBr2IEonejGQVQjjkFvs52r6c5aS7DCd8JrJncohZIBNVd+BvyedWp5txp6pCiuRcINsogtvARvQuwJvxGk9rpMEyrwX3SoEQ8+JDKE+vnTW0jHaZJ9h3p+p8tQVLggeLUQaI52xxssUcaxojxGCu4-h7UQQOoZH+cM9swQznruiWhljlB4mHmcUk4DFtmUkc0UOeI+71OGjlQqhVYJ2xFwM+LWZYBzPDqOmpUTnxeZaXtIvaJDQgA */
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
          | { type: 'appComeBackgroundState' },
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

                    backToIdle: '#price machine.idle',
                  },
                },
              },

              initial: 'getProductsBaseOnCategories',
            },
          },

          initial: 'loadingProduct',
        },

        errorGettingCategories: {},

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
              target: 'errorGettingLocation',
              actions: 'handleError',
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

        errorGettingLocation: {
          entry: (context, event) => {
            Alert.alert('something went wrong', context.errorMessage);
          },
          after: {
            '500': 'askPermission',
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
              target: 'errorGettingLocation',
              actions: 'handleError',
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
        handleError: assign((_context, event) => {
          return {
            loadProduct: false,
            refreshing: false,
            isLoadMore: false,
            loadLocation: false,
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
            console.log(error);
            // throw new Error(error.message);
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
            console.log(error);
          }
        },
      },
    }
  );
