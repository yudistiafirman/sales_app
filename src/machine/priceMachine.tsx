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
  /** @xstate-layout N4IgpgJg5mDOIC5QAcBOBLAxmABAWwENMALdAOzADoYAXAGQHtMCb0GzKDYBrABTFR50sWGzIBiCOyrkAbg25U0WXIRLkqtRs1btOPfoOGj2COUxZiA2gAYAurbuIUDUbrLOQAD0QBmAEwArJS+AByBNr6+AOwAbDb+odEANCAAnogALJn+lACMgUmBgYmBAJz+sb4AvtWpytj4RKQU1GD0Fu76fAJCImKS0pTmipQNqs0abR06Yt2GfSZkZmTys+yOVnlOSCDIrujunj4IvgUh4ZEx8Ykp6Yj+NpmUsWVJ-pmxeR+BsSW19QwjTULU07W0lj0BAANtCGAB3SCDVojJRAibqVpaTpzGFwxEQFZrSFkTb2Tz7NxiY6Ib6BZ6xTK+MqBPJlGy-Xwc1IZBBM3yUTKhIp5J4xYV5aIAvbopqYsEzEmcWEIpECVAMVBjaEsABmmrwY1lIKm2PWHDxqsJ5nNZJ2Lip7BpCAqPMQ0SFlGi0RsNgKxVCVTi0vGctB0whXUwAFdUKgwGRFe5GAQIEipCjVgo0Sow6bwTi9DG4wmk2IU2nrVnbfZHBSDkddidMjYypRQv4YjF-GU8qFmeE3S62e2bLFYqEmYkvhyQ8bJliC+bKMX44nI+WGKn00NUUbcybF2Wi7G18eyBXIETC6Ta9t646PE3ab5nr5AtFAsyZx94qEh+EeSUCUmTRJOOTvnksT+HOB4LgqG4niW643peEDiOqmranqBr7sC8ERjeK6nqWiEXlulbXjWDjkrslKHNSz58q27adtE3a9v2byBABE6UL6voFAkHavjBdQynB8qEcucLmgAIu0BDoNCaGSMINAEGQ2AAEpgM0BAAEbQmAdZ0Q2jGgCcHZDnk76xBcbyit2EqhLB+FSWaSqySSCkacpqkQOpmk6XpJCGcZWz2ns5lOkxZSvF6oR5JKjy2f2bIAa+XqfBO3xcp+0RiYCknhp5XTRmQ8b6UZYDiKQaYAOoEKgZDkFApkOgxsWWQ8mRATYcRBIyTyZGUAT-vcCB5cE46cTkLavoGbkYqVS5KmmrWQJQ+rxlAGoVehBDIMgADCDB4GAABCRDcHtDAHQAyhpNAmbRnWNj1CBJTYlCVMKJSfkEo3+EO-iPIKtzMmUo1st8rniaGh4IURG3oFtBk3XdB3iEdp3nWAABimpgFjZAQE9LCvVF9Efd4fhBBcERRHEwl3LyAS5EySU9gUUQVNDy15keZHDBAxniOwACCBi9MY1hvdFj7OgAtAUoT8Y8YGFPSLJJKDYQhI84RToVbxMoLSPSUq6Bi7VsAJoFZBQLwzUEHgsAdYrXVPp9yvQRrA3CqEZTRG8NjCjZ7KG+H9IBKbk41Aj85SQAKlpnB7WAYAXYmAASNtteIsDEAikuZ9npaezTFl0wgQ0vPEfrsv4UFlPFNm-PZHrhCyLaVC2eQWwRaeYBn8YV4mD0lwSdU22AZfjznNBVzFPu15UAoDUElSSvSjJjR3UEhANr5nDEH7vkPHntLwGoQNGmA0JQcKpm1t8MPfj-IjIWajIjBG0Hfp-J+L9HbOzvg-GgVESR2gfN7Z0rpJqPGyPkVs7IPzCjjonYq7lVo0CAZA5+FE34QK-phLUyAdQ0B2oaf+198GkJAcQp2BDH7QPcLAsySs4qhB+n8WyoESjCl9L4UG0EfqchZr6L87Er54NYU-HQJNNRo1gGhaYCjYDXXtgAeTICdSmUAVFwG-sMX+OZcH5gYR-QhSijEYDgOowBjCtFcDAHogxL17GqPYfLGi1NV7OjONEfIFQIjQXHKHMcoM+ohMDJ+d8OQEnCjkVYhRK5DHGLURRLazibGP1cbo-RmSHGwAwnGLClCcKCDwitNJjCMleKyU4m+LjtHuOKU00pviNi1gVtXbqtcw4vFZK+QGwjIigwBr9DsfVw5-DAn8VJR50l2OaTkiARp8kdG3OhdgABRMmulmiQBXtwz6wTQlBDHJUWIUTYhTOSvkIUE425ck7MshUqySmqPUWgbZql2AnWIJpGAnjlGlLOfApily2TXIiXc9kDykHxBCX1b4A1vSti-J8jRDS1mlL+Yw1S8ZdTxmLm1Og6koW0xOLCsJNzIlItBj6AUdzuy-GSncnFScSpWJFrqcghwGDiBpTXE4nKXi3PYpOQoZ8bI9nsr4dlbJXhtyZFKaUZAP5wApMnUEcDaWIGVq+IC7KezThKOOSZk1lY5H4gJI27IcglCKhJSxwsbyGvFcansbL2IWsDFa+IojJqZGCKBaCoog6tmiJKXFZVcQyyMP0QZAy17NmeD6eITJw3fBDq2GygZgLhveHGn0xRxwJrWl0S0BJvWDJOD6EJ7zK2PG3tEsNkoG4TiStzKCl9eUeuRsuVcpFUIbIbRm41Bt-AeniPSOIrJvTIt5PSXIk5+yMm+hOKo1bzyUHIQAcXaKwJ2ZEp3OiDCW94fwm5VBBpNHuXpmR9nZL6MGmqcF1M9TJG8vklIqUnVw6Fn04hAUKlG6Godw1zqHJxX6QMAi+juR6bB7qf0jqVIK1qNAGCXqYhfSg8UQ4shbh+DBNk7IhBVSR9VMR90iwqlVMKNUCOfRDgq5VzzxwdldeMxjKMExowgOx2u0EQkRE-KW0UkRuSTVsrkMj2RbnjjZL8QTy5UZbR2iTfaZMxMnG5cBAa9JCiya5DxJB4MkUfHDWBcNrY3V0LwSLbTmyMaYFuvp0TIGjVTTHOrCofpiidiqN8NmDwbM3OyBgxzFRNPW1toZ314aXgBoqEG25NreRsX4t6QqTJobJQSIEXFI8Ut10yDZHI6t0rhxEaKOd6GXNTBHmPLOS985gMq4VDuYMaPlEiGBH48VyvpwIOXJeU8rSVa5hrcUC7AwDUZP154QakgCJ7N6fdCjKsfBslUNsb7+zh0nCzFr+r6nbKIa-FhjDeuPt5Cley44viJCguxAIu38U-MccB96PqECh31lyEIvZOxJWyPFL9GGhZfN+1035Gy8XbMKR08F3jdV+aB+F-idJRrsiiL8SLddWS5GbX3VkY5lWw9aysxHELke7K2cAtClWIsxNGu2aNX3AyKtxce09bVMdZI52DZ4c6gjhHCEIsoUzfgQ0GpKOyr5ai1CAA */
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
        loadLocation: false,
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
              always: "idle"
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
        assignParams: assign((context, event) => {
          return {
            longlat: event.value,
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
