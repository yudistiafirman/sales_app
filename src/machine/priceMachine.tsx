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
  /** @xstate-layout N4IgpgJg5mDOIC5QAcBOBLAxmABAWwENMALdAOzADoYAXABVQHsIBXTGygG0YInKgbM2NAMQRGFSuQBujANZU0WXIRLkqtQa3ZcefMgKbaaCGY0wEa6CQG0ADAF17DxCkax0Via5AAPRAAsAIwArJQATEEAHADsASEAbFEAnEEBwQkANCAAnojhdnYBEUEAzMml5cnhyQmlQQC+DdlK2PhEpJKaRsK6vPxawiJgqEyolMiclgBmjKh4Exhtqp0aYPQ9Otz9BoPspmSyFl5kzs4+yO6e1mQ+-gih6ZRBySHhCUF2yXafUSHZeQQ4XeYTSdhCdii7ziIWSTRaSxUHXU1HWew4xzAUDm6DgABk9JBURshOxYAAhAiwMAAeTIAGFLFicXAxBIqGYFItlO01F00ZsMUzsRh8YSIMT0RSqbSGcKWbADkdLDczo4LlcTndELE7JQQqEQrEoXF6lEAYhonZSvqQgEPuEYgkYnFavCQK0kXy1iTjJRMSLcbACbwid1STRpdS6YyaMzRbBhqM5hMpjRZvNuctkfzfb0AwqQxAwwKI1HZbH40GleYVbZHOckB7NTdtQ87cUXm8Pl8fpD-rl8uCYpR7eV0jEQpPnaV3Z7eatJYL-fKE0WiWgI+uICIJABRMgQABKYA6kEbbg8Wqb911+sNxsdATNFoeKRHhRdL1CpQ+c8RC4ouGfoFmu4qLFu4q7gyxAEAYYCVoGcAXs2V6tjeOoxHqBohEaMQms+0Svi8FSjgkkKVOEuFRAkyRRP+PIrEBpYgauQbbhBxjbiIqBgNMvGwJ0UB4ugsA0Chlxod4GEIHeOF4QRL6DkCkLJJQqTjjEpRGkENQhAx2bekuEYrnGSHBuBm5cVBABGRByAAKowACSECcGAEkttJoC3uEUSUNpv6OrRoSFAOgJlFENqTp8djhPU7yOuEBleouVJyHQIx4KJHgSGykicooAFMZI6WZfMOU3DWxyqg26pNpJ1zeX4iClH5lB2PhaROkUNTOlkynJE6lAJOEATJAEWkulE1r0c0HrFTmVBlVllV5eIBWHPIRWMUtlArRVsC5WQ1V1qcDZBC4DVebcMmlAE-mdVE3XkQEfVOq+sLhJQsTjVEfwJAkb3gilgGlZw3AAO6QPlHJbVy84lctEOMNDECnScapXZeTW3T5iC1EEAXfLCMTxZ8bUBMRhRqb9E1BHEUTpH5oNI-tKNo0mYypjMcwLIje0EBzkAY7VTj1Tj174wghPE+CQ3k9aY2vrU32lK6U7xZE-Ws3txZkLiEoZliTAsIeIgEMgyD0oweBgJSmByFApuHgAyjQTKeVJeMtbJz7PEDw5pM+cQxK+5H+aNf2QmN1GNPNAtGfrhuUHZjvO4wZs7pb1u22AABicwm5nbse3GXu42292PV1k2ve9A2AjEnwjWNQ20YD2lRbrRkjGMADi6xWAYBI1XlQuQwQOSwBXUu+5UNfPXXvW1B9ylRUT6vjVpMe0YkPeLpgLCjGAZA0KPZ3cRtcOyAji1GUfJ9nxfJzbqL9bi9jqGVzJZPERTAU-JFGevdUo1p44Il2g-Y+vFn61lflBPuKZJi80zInQ+MDT7n3gTcN+Zgx7nU-hqb2bYXhYUoC6So6QIQug+KUf+7wApFHIt8WiXwpwHxRNwAhAARdYBB0CcCvqJD2ZBsAng6AQGy7lZ7oWllRUEXxfyJGbiwuIr4FGt23gkRI2tnyzgTvfRc3Czp8I9oI4RYk4LiNPCQKRMjLrEJ-vInRzwlE6OdEENRVNlIFFBG3JmbUJopChJwyQZteKSOkWAEQpBiwAHUCCoANgYWRzV7iRCJrpCEdhO6lH+pEYibVvpDV0k6BRyRqgGMgYZRc6A3IxIkAAQVgBlVaR0xZOLnvcT4LwRpvWejNHRKQ7SvjAcUfCkQIQGl0jUGIYSOQNJENSQ8AwkkEDwDPCW39umWjqGEeozpIS0INEDMZzoIhQjSIkWESQfhNHmmQZgcALhGPUF0uRvsAC0jdEA-I6oUQFsRXjpB-As4yxgPnpNam8Eov1EgpGDl44iwIRy4XiENGi5Q3j6UMVAxcwFejbH0IYCMUKfb3ACIUOFMIkipFBb8h49QwjggxfhO0IRingsJToUC7FxTkrbEDb6IJYRRSpR8SpxFVEdTtA6F0zd5l4tqcxPMvK2JilDBKHlkZKTRjlGZBUgqZJBBeMUB6z4ai6SSJ4jRvV1JUoes3P4KRKjcpYvmDVFktWcWENuY10s2ERB0WK+6uSSLEVSCOOiAzCj-Spe8cFSDUCDxoMPKAiEjXXRISa-C0bw1fh0c+SEdqaIjRJmFco5EEjgoOtlDpzVGq7IQH-ZSsI9RQm0QaWIXiAi1uFhAANvtm56gZtETlNNYrhQJrC3S40QqVKVnCZVqUUTJ0gEO+4gM9TaQqKaMNlRPqRGeAEii5R8J9pXWDKg66jZFwzlnTdiAsL+V3VvKh1p6HKRYSe6Ona47gtvaneyD7DxPoeL0n6MawExA0lhZI4cvi-rojHeIOkk3JhTUPfgL9PlNs+Rkl4-kjRGntBKmasQVZ1B+q6Cazd1a4VxTU1dkhH6wOwQQ-12bnG+zHWpWEv5O5-FNdpf+PwfrMLASkJWTGFr4q4TgiQZiBFCIFdx5tb1XzPVHJU3TpqKbUXBRE2xsFongedEU+Ko5m7xXGl4goD1wX1PckOmgjBkCtSKBQq52l0hQmUQOdy0waB7INPqQGqjITxFEyAGyjA022xhd9SZZQOz+ZDdkDAUBiAhYeF+cLniI7RYHJDepNBiCWgKNkYgYB0DZdyw9bIPSdFE0SIVqLnLp0IHGd5yIvmHrxRDQ8hoQA */
  
/** @xstate-layout N4IgpgJg5mDOIC5QAcBOBLAxmABAWwENMALdAOzADoYAXABVQHsIBXTGygG0YInKgbM2NAMQRGFSuQBujANZU0WXIRLkqtQa3ZcefMgKbaaCGY0wEa6CQG0ADAF17DxCkax0Via5AAPRAAsAIwArJQATEEAHADsASEAbFEAnEEBwQkANCAAnojhdnYBEUEAzMml5cnhyQmlQQC+DdlK2PhEpJKaRsK6vPxawiJgqEyolMiclgBmjKh4Exhtqp0aYPQ9Otz9BoPspmSyFl5kzs4+yO6e1mQ+-gih6ZRBySHhCUF2yXafUSHZeQQ4XeYTSdhCdii7ziIWSTRaSxUHXU1HWew4xzAUDm6DgABk9JBURshOxYAAhAiwMAAeTIAGFLFicXAxBIqGYFItlO01F00ZsMUzsRh8YSIMT0RSqbSGcKWbADkdLDczo4LlcTndELE7JQQqEQrEoXF6lEAYhonZSvqQgEPuEYgkYnFavCQK0kXy1iTjJRMSLcbACbwid1STRpdS6YyaMzRbBhqM5hMpjRZvNuctkfzfb0AwqQxAwwKI1HZbH40GleYVbZHOckB7NTdtQ87cUXm8Pl8fpD-rl8uCYpR7eV0jEQpPnaV3Z7eatJYL-fKE0WiWgI+uICIJABRMgQABKYA6kEbbg8Wqb911+sNxsdATNFoeKRHhRdL1CpQ+c8RC4ouGfoFmu4qLFu4q7gyxAEAYYCVoGcAXs2V6tjeOoxHqBohEaMQms+0Svi8FSjgkkKVOEuFRAkyRRP+PIrEBpYgauQbbhBxjbiIqBgNMvGwJ0UB4ugsA0Chlxod4GEIHeOF4QRL6DkCkLJJQqTjjEpRGkENQhAx2bekuEYrnGSHBuBm5cVBABGRByAAKowACSECcGAEkttJoC3uEUSUNpv6OrRoSFAOgJlFENqTp8djhPU7yOuEBleouVJyHQIx4KJHgSGykicooAFMZI6WZfMOU3DWxyqg26pNpJ1zeX4iClH5lB2PhaROkUNTOlkynJE6lAJOEATJAEWkulE1r0c0HrFTmVBlVllV5eIBWHPIRWMUtlArRVsC5WQ1V1qcDZBC4DVebcMmlAE-mdVE3XkQEfVOq+sLhJQsTjVEfwJAkb3gilgGlZw3AAO6QPlHJbVy84lctEOMNDECnScapXZeTW3T5iC1EEAXfLCMTxZ8bUBMRhRqb9E1BHEUTpH5oNI-tKNo0mYypjMcwLIje0EBzkAY7VTj1Tj174wghPE+CQ3k9aY2vrU32lK6U7xZE-Ws3txZkLiEoZliTAsIeIgEMgyD0oweBgJSmByFApuHgAyjQTKeVJeMtbJz7PEDw5pM+cQxK+5H+aNf2QmN1GNPNAtGfrhuUHZjvO4wZs7pb1u22AABicwm5nbse3GXu42292PV1k2ve9A2AjEnwjWNQ20YD2lRbrRkjGMADi6xWAYBI1XlQuQwQOSwBXUu+5UNfPXXvW1B9ylRUT6vjVpMe0YkPeLpgLCjGAZA0KPZ3cRtcOyAji1GUfJ9nxfJzbqL9bi9jqGVzJZPERTAU-JFGevdUo1p44Il2g-Y+vFn61lflBPuKZJi80zInQ+MDT7n3gTcN+Zgx7nU-hqb2bYXhYUoC6So6QIQug+KUf+7wApFHIt8WiXwpwHxRNwAhAARdYBB0CcCvqJD2ZBsAng6AQGy7lZ7oWllRUEXxfyJGbiwuIr4FGt23gkRI2tnyzgTvfRc3Czp8I9oI4RYk4LiNPCQKRMjLrEJ-vInRzwlE6OdEENRVNlIFFBG3JmbUJopChJwyQZteKSOkWAEQpBiwAHUCCoANgYWRzV7iRCJrpCEdhO6lH+pEYibVvpDV0k6BRyRqgGMgYZRc6A3IxIkAAQVgBlVaR0xZOLnvcT4LwRpvWejNHRKQ7SvjAcUfCkQIQGl0jUGIYSOQNJENSQ8AwkkEDwDPCW39umWjqGEeozpIS0INEDMZzoIhQjSIkWESQfhNHmmQZgcALhGPUF0uRvsAC0jdEA-I6oUQFsRXjpB-As4yxgPnpNam8Eov1EgpGDl44iwIRy4XiENGi5Q3j6UMVAxcwFejbH0IYCMUKfb3ACIUOFMIkipFBb8h49QwjggxfhO0IRingsJToUC7FxTkrbEDb6IJYRRSpR8SpxFVEdTtA6F0zd5l4tqcxPMvK2JilDBKHlkZKTRjlGZBUgqZJBBeMUB6z4ai6SSJ4jRvV1JUoes3P4KRKjcpYvmDVFktWcWENuY10s2ERB0WK+6uSSLEVSCOOiAzCj-Spe8cFSDUCDxoMPKAiEjXXRISa-C0bw1fh0c+SEdqaIjRJmFco5EEjgoOtlDpzVGq7IQH-ZSsI9RQm0QaWIXiAi1uFhAANvtm56gZtETlNNYrhQJrC3S40QqVKVnCZVqUUTJ0gEO+4gM9TaQqKaMNlRPqRGeAEii5R8J9pXWDKg66jZFwzlnTdiAsL+V3VvKh1p6HKRYSe6Ona47gtvaneyD7DxPoeL0n6MawExA0lhZI4cvi-rojHeIOkk3JhTUPfgL9PlNs+Rkl4-kjRGntBKmasQVZ1B+q6Cazd1a4VxTU1dkhH6wOwQQ-12bnG+zHWpWEv5O5-FNdpf+PwfrMLASkJWTGFr4q4TgiQZiBFCIFdx5tb1XzPVHJU3TpqKbUXBRE2xsFongedEU+Ko5m7xXGl4goD1wX1PckOmgjBkCtSKBQq52l0hQmUQOdy0waB7INPqQGqjITxFEyAGyjA022xhd9SZZQOz+ZDdkDAUBiAhYeF+cLniI7RYHJDepNBiCWgKNkYgYB0DZdyw9bIPSdFE0SIVqLnLp0IHGd5yIvmHrxRDQ8hoQA */
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
            },
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
            onError: 'errorGettingLocation',
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
          on: {
            always: 'askPermission',
          },
        },

        currentLocationLoaded: {
          invoke: {
            src: 'fetchLocationDetail',

            onDone: {
              target: 'locationDetailLoaded',
              actions: 'assignLocationDetailToContext',
            },

            onError: 'errorGettingLocation',
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
              target: "currentLocationLoaded",
              actions: "assignParams"
            }
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
            productsData:[],
            selectedCategories:[]
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
            console.log(error);
          }
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
              longitude,
              latitude,
              'BP-LEGOK'
            );
            return response.data;
          } catch (error) {
            console.log(error);
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
