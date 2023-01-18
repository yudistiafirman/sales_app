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
  /** @xstate-layout N4IgpgJg5mDOIC5QAcBOBLAxmABAWwENMALdAOzADoYAXAGQHtMCb0GzKDYBrABTFR50sWGzIBiCOyrkAbg25U0WXIRLkqtRs1btOPfoOGj2COUxZiA2gAYAurbuIUDUbrLOQAD0QBmAEwArJS+AByBNr6+AOwAbDb+odEANCAAnogALJn+lACMgUmBgYmBAJz+sb4AvtWpytj4RKQU1GD0Fu76fAJCImKS0pTmipQNqs0abR06Yt2GfSZkZmTys+yOVnlOSCDIrujunj4IvgUh4ZEx8Ykp6Yj+NpmUsWVJ-pmxeR+BsSW19QwjTULU07W0lj0BAANtCGAB3SCDVojJRAibqVpaTpzGFwxEQFZrSFkTb2Tz7NxiY6Ib6BZ6xTK+MqBPJlGy-Xwc1IZBBM3yUTKhIp5J4xYV5aIAvbopqYsEzEmcWEIpECVAMVBjaEsABmmrwY1lIKm2PWHDxqsJ5nNZJ2Lip7BpCAqPMQ0SFlGi0RsNgKxVCVTi0vGctB0whXUwAFdUKgwGRFe5GAQIEipCjVgo0Sow6bwTi9DG4wmk2IU2nrVnbfZHBSDkddidMjYypRQv4YjF-GU8qFmeE3S62e2bLFYqEmYkvhyQ8bJliC+bKMX44nI+WGKn00NUUbcybF2Wi7G18eyBXIETC6Ta9t646PE3ab5nr5AtFAsyZx94qEh+EeSUCUmTRJOOTvnksT+HOB4LgqG4niW643peEDiOqmranqBr7sC8ERjeK6nqWiEXlulbXjWDjkrslKHNSz58q27adtE3a9v2byBABE6UL6voFAkHavjBdQynB8qEcucLmgAIu0BDoNCaGSMINAEGQ2AAEpgM0BAAEbQmAdZ0Q2jGgCcHZDnk76xBcbyit2EqhLB+FSWaSqySSCkacpqkQOpmk6XpJCGcZWz2ns5lOkxZSvF6oR5JKjy2f2bIAa+XqfBO3xcp+0RiYCknhp5XS6uQhwMOIpkOgxsWWYgvxAdB47sZOhRnL4Nk9vZvixOxbKvGUZRMlK4mhoeCFEdGZDxvpRlgOIpBpgA6gQqBkOQUC1dFj7Oh8QE2HEQSMk8mRlAE-73AgeXBOOnE5C2r6Bm5GKlUuSppltkCUPq8ZQBqs3oQQyDIAAwgweBgAAQkQ3CAwwwMAMoaTQJm0XVjaNQgSU2JQlTCiUn5BBd-hDv4jyCrczKjb2vaJG9eZHmRlDfegv0GfDiPA+IoMQ1DYAAGKamAPNkBAqMsBjUX0dj3h+EEFwRFEcTCXcvIBLkTJJT2BRRBUo1M1N0lKugEDGeI7AAIIGL0xjWJje31U+OMALQFKE-GPGBhT0iySQU2EISPOEU6FW8TLGwRZVzObluwAmgVkFAvAbQQeCwLtcsWQrCBu9B3vHcKoRlNEbw2MKNnsiHlf0gEEeTjUE3zlJAAqWmcIDYBgNDiYABLm9t4iwMQCLW93veltnMWu3np0vPEfrsv4UEjbENm-PZHrhCyLaVC2eTR+3ncEJPfc0MjY8Est5tgBP8ZT4mM-7UxlQCsdQSVJK9KMpdm9QRCMdV8XUCrvmPh9GgvANQQGjJgGglA4Spm2tAhgsD4HIhkFmUYk0Y7tFQeghBSDk6pxgXAmgVESR2gfC7Z0robqPGyPkVs7IPzCgbs3Yq7lIEEPIYgiiKCyEYMwlqZAOoaD-UNLgjy+ChFEIESnXh8DKHuGoWZV+OMK4vFZK+EmwpfTdQYdBfGnI1a+i-OxCB+YoFyJXNLKAmoOawDQtMJRNBYBw0TgAeTIODexji4CYOGNgnM3DrFuLsejBxGA4AuNoG4jxXAwA+L8VEgJsAVGOxorLWezozjRHyBUCIrUBrsg3gwzIkp2wDS-PSfwn4wiuRbiVcJtidBi3SXE2RaDyGJO8b4-xMTYAYTjFhMROFBB4Xeq0np8DIkdKGV0mxsz3GeOSQMtJQzMkbFrE7HODU85aL+LZUCJR9GRApsTAmHZKmVz+GBP4VijwRPadEpxLi0ArNUuwAAohLXSzRIAv1oUxfJhSghjkqKUsclzkr5CFBOEaXJOxPIVC8wZ7yKK-U+YQ75vjiCaRgKkhZTjgXyxOGCtkEKSnlxhUY46gpko+29K2L8qLXFtIxbErFEAjRfJ5eIeMup4yj22nQdSZLc4UqqVS4pULaXlN5PUyILx2KFWalBBptRxJkDQXACkrdQQ0PJYgN2r4WrsR7NOEo44Lk3TdjkfiAkohCnNUkJ47LY4HP2XPE4bsewCgGgECogYbXxEMbyTIwRQLQQ+A3KN3wyies+l0LgPQjD9G9bkuKQFOyBi+J2AaSU3g2UKoKMcjI43CjiNBZN55lT4kgMaqV7oGXIuKMYr+dLI1VPHBOJKusoLgOaWElmRFVykVQjy5tBy-XB3qZ8DkMbWTekVU1R1k5+yMjxhOKodbWYiIAOLtFYCnMiM7fWICDMBIUhU-jLyqOTG6u8vTMj7OyX0lNxpcOmWOmSN5fJKRUtO9RIKcZxCAne1eo1y5RvqUOTiBNSYBF9AND0nCJKjumsuCqW0aAMAvc6D8Ap4plxZKvD8bCbJ2RCEGoaI1RoxH3TNOaoUCWLUI3FDWtJC3wvHB2Eo9SznMeXOzJtoGTUIGggUiIn4o140iNyG6tlcjkYuu+fq0RvgDRE19BMHNeX-TFkDCWnGcY1OAsdekhRRSKZ4gwqmZSPhRrAlG1sRVMO-uw3pn6vKuaYARiZiAZm86ij4hUP0xRC1nHgw5-GTnshsLcxUXTXR45gBC36n4qrg3WqhXapVMR+LekKkyUayUEiBHZR3TAmWHiZBsjkL2-ZWyhpbIyUC1XT7n1LIPEhdWECFU3pTWj5RIhgR+PFLrmAu6PwvlfK0A2dbe3FPEQo8Q4gNeUyBaphQtOiTLt+zzzM0VyIGx8GyVQ2zvu9AUH0z0qsjq8xylZ-DkGKLOxJltg2n28hSvZPt3wkpBoCHW9FmzMXbmC192d7oyhBy5CEXskp2FjlFJkMHnKIfcqhy9whfT1nErefqmHl6pNnH4nSC67Ioi-G4wgII3wvTHX3qyMcmnMevdeZ0nlfLcUgaxt9749PnNtjxkkKIgZersqPSe7aRP0kDe+B8Am6rwjhDOfDhhHbqYnUlHZV82rqhAA */
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

              entry: 'enableLoadLocation',
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
              always: 'idle',
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
        assignParams: assign((context, event) => {
          return {
            longlat: event.value,
            loadLocation: true,
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
        enableLoadLocation: assign((context, event) => {
          return {
            loadLocation: true,
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
