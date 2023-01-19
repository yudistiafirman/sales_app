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
  /** @xstate-layout N4IgpgJg5mDOIC5QAcBOBLAxmABAWwENMALdAOzADoYAXAGQHtMCb0GzKDYBrABTFR50sWGzIBiCOyrkAbg25U0WXIRLkqtRs1btOPfoOGj2COUxZiA2gAYAurbuIUDUbrLOQAD0QBmAEwArJS+AByBNr6+AOwAbDb+odEANCAAnogALJn+lACMgUmBgYmBAJz+sb4AvtWpytj4RKQU1GD0Fu76fAJCImKS0pTmipQNqs0abR06Yt2GfSZkZmTys+yOVnlOSCDIrujunj4IvgUh4ZEx8Ykp6Yj+NpmUsWVJ-pmxeR+BsSW19QwjTULU07W0lj0BAANtCGAB3SCDVojJRAibqVpaTpzGFwxEQFZrSFkTb2Tz7NxiY6Ib6BZ6xTK+MqBPJlGy-Xwc1IZBBM3yUTKhIp5J4xYV5aIAvbopqYsEzEmcWEIpECVAMVBjaEsABmmrwY1lIKm2PWHDxqsJ5nNZJ2Lip7BpCAqPMQ0SFlGi0RsNgKxVCVTi0vGctB0whXUwAFdUKgwGRFe5GAQIEipCjVgo0Sow6bwTi9DG4wmk2IU2nrVnbfZHBSDkddidMjYypRQv4YjF-GU8qFmeE3S62e2bLFYqEmYkvhyQ8bJliC+bKMX44nI+WGKn00NUUbcybF2Wi7G18eyBXIETC6Ta9t646PE3ab5nr5AtFAsyZx94qEh+EeSUCUmTRJOOTvnksT+HOB4LgqG4niW643peEDiOqmranqBr7sC8ERjeK6nqWiEXlulbXjWDjkrslKHNSz58q27adtE3a9v2byBABE6UL6voFAkHavjBdQynB8qEcucLmgAIu0BDoNCaGSMINAEGQ2AAEpgM0BAAEbQmAdZ0Q2jGgCcAC0PqCmyJSMpUYR5EKQ55FEuRMq2QSRC23xSuJoaHghRGySSCkacpqkQOpmk6XpJCGcZWz2ns5lOkxEQCmU0E5P2LaPCUbk2HEwElfEopxHEoRlLB+FSWaSq6uQhwMOIpkOgxGWWYgvxAdB47sZOhRnL4bk9rEISxOxbKvGUZRMgFgKSeGjVdNGZDxvpRlgOIpBpgA6gQqBkOQUAdWlj7Oh8QHlUEjJPJkZQBP+9wIN874vK8fY5C2r6BnVGKrUuSppqdkCUPq8ZQBqG3oQQyDIAAwgweBgAAQkQ3AwwwcMAMoaTQJm0Z1jY9QgoSipQlTCiUn5BE9-hDv4jyCrczILb2vaJIDeZHmRlBg+gEMGVjONw+ICPI6jYAAGKamA4tkBABMsMTqX0WT3h+EEFxZdcwl3LyASec5PYFFEFQLbzwXSUq6AQMZ4jsAAggYvTGNYJOXV1T7k1ZBShPxjxgYU9IskkzNhCEjzhFO0Q9pONSBfODUg10DtO7ACYxWQUC8MdBB4LAF2axZ2sIFZ0HByVwo1dEbw2MKbnsjHTf0gECdvEyNsEQAKlpnAw2AYBo4mAASDtneIsDEAiLvD6Ppal+lfsV-dX2Cey-hQfNsRub8k0euELIFQ9eS91JA+YEP8ZL4meNzwSe0O2AC932PNAr1dTFOfxCcOUlPSRkz0D5QRCCVV8o1PzsUCJfYGNBeAaggNGTANBKBwlTGdJBDAUFoORDILMowgoEVoDgvB6DMG53zsg1BNAqIkjtA+X2zpXRvUeNkfIrZ2QfmFJ3ZOy16oIPIXQjBFFsG0PwZhLUyAdQ0ChoaEhadEGSMoeIvOIi0EMPcEwsyP9yaNxeKyV89NhS+jGuw6CNhgJBniL6L87F4H5hUbg0ROhFaamFrANC0xNE0FgJjbOAB5MgSM1ZQE8XAAhwwiE5iEc4vxK5wmRO8RRCGZDVEBK4GAEJYSiYRIwHAbRXsaIa1Xs6M40R8gVAiANaa7J97sMyJKds00vz0n8J+MIoQnFHkSe4gpXifEZNcWgrJwTQnJMKbADCcYsKyJwoIPCQMEmqKSfklJwz2h+PGTkyZGzpnFI2LWb2ZduoV0MX8dyoEShmMiMzOm1MOzNKbn8MCfxekKn6VMoZaSIBGlGR0bc6F2AAFFla6WaJAb+LCmKVOqT5OpDcxwPLyEBFygYarPQSAIiS8S+lrIGZsv5AKKGqXYEjYgmkYB5I8dMmFWsTjwrZIiyo9SUWWJKnZb4JVvSti-J83xhKflwB8WgQFql4y6njLPM6dB1IMvLkylpLLalsuRY03knTIgvHYgAr4UEum1HEmQXBcAKSp1BMwxliArKvn6uxHs04HLxAsbyKyOR+ICV+IkBIfpMi-EFWtcuZy17WR7AKaaAQKiBhdfct6AbBRxEeBbMcE56RBvTrid2Rh+jnNDawoCnZAxfE7NNSmbw3IJ0FGm363S4jQUzeeZU+JIDWqVe6LlXIgg+oSCUDlvJmlVPHBOSmlMd5VDgSnFaziBarlIqhP57bznWWjp0z4HJQJXO9Jq3qnrJz9kZJTMcgZcVKIQQLaRABxdorA85kWXWGxAQZgJCgTn8P0OUAgAXKF6ZkfZ2S+hZktPFKz+ahRvBFJSKkl16NheTOIQF307wWg3ANnShycWpgzAIvppoejPZa2dRFmqnRoAwR9zoPzZVeA3EoBQYGvV5O5X4U0Zo5XmgtGITaBYbS2olHalGmIB0qF6DsiHJTRG+MKJmb00VcnbH2FyPYWSRE-DxoiQs21wZtQgaCVSIifgDceyI3I5MBEoCyD4Pp2LzRUxp5cWn-lQ0VrDZWQnyZtLKkZwoopTM8XYazBpHwA1gQDd5BzoMEzC3+aLTA2M3MQA8xXUUfEKh+mKGWs4GHAvWOC9kXh4WKiRYzo7MAyXw2JqjU62NbL41apiP-b0HxmTNNFEEQV18KsPEyG5PK7YuRvD+C2RkU7BFgaoNfW+I9P6T2od1hACcD4symuUNTzzyixE64PAgi9P6PytAtpkQccXvI5IGcqvW5MgVaYUKTokyjeibX4hbHw3JVDbAB70DGniRDG6BvmXy1lUIkYChbS25Pvq+qWymUaAjPeFQc35wLwdlCjgp-9ko+FjlFJkBHgL1l0uR5WIVgLdm5JFfAHTHa9NnH4nSJ67Ioi-CNg8VkuQbMFVZGOXw018cUMJ4M0VJLxVktg6TGn-lmbZDbMepIURAwTUFde29Z1aVC6pxLldtIWbPE6UEcI4Rblo-YcUSaORk2SnfFUPHxqgA */
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
          return context.locationDetail.distance.value < 40000;
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
            console.log('ini response', response);
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
