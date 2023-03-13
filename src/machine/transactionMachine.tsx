import { getAllPurchaseOrders, getAllVisitationOrders } from '@/actions/OrderActions';
import { customLog } from '@/utils/generalFunc';
import { createMachine } from 'xstate';
import { assign } from 'xstate/lib/actions';

export const transactionMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPaYAEAtngBYGZgB0MyAKhtnoSfQDZHoS0orLDnzFMAYggkGtAG5EA1gzQiO4itVoMmw9mK69+gvaM6YE8ornTmA2gAYAuo6eJQAByKwC59yAAPRABmYIA2egB2MIBWMIAmAA4ATniHVMTggBoQAE9EABZEgvpkmOCHMODI0MSqgEZggF8mnNV9c01cGjpGMBY2M3EePgFMIUH1EgkwVFQiVHoPblsAMwXyenahki6enX7TKcwR43GjgwsrG3tnV38vHz8kQJC4qNiElLSM7LzENL1egFZKg2KRAqRNIxMotNqTS57bR9AZqS5bXIeMAAGVGkBRF3MsAAQuhYGAAPKYZiYsBSGT0KzKLYIzqUbrI3Ss4bIWm4-j4rloomk8lUmlYyyYBQ3cSue4vR6+cT+IIIYoReKfArBRIOSI1Ar1HL5BAxeLBehhSLJML1eJQyL1ZL1MJwkDbY5I3pCjo8vl4iAE7kkElkynU2kzOYLJYrZDrVCbT2I9n7YPC-1Y-kQQWHEPYUURiVgKUy2xyu7OB7eZUkVWIeoFIr0Bz6xpai1hEF-U31BzxeL0epQ0IFGIxfthW3ulNsrQ+-OZri87OBlnLzA5yASEgAUUwEAASmBqJAFZ5a89QGrMg5h4lIpP7WE267IibEHbIsPgg7+06upFJEs4Ft6Byon6K4BgKQZzuI24QLumAAMJUFgMAlheIBKterzqhUD5PvUL5vtan4IIB9AxIkNFpHUEI6jEoGbuBGZQScq44uu8EkIhEioGAqyCbAPRQNiBCwMg2G4SqLy3oR9SPs+WpkR+-zqv2ra6skwT9vE-a6sxrQemBaackuHEYmusEbhx-EAEZ4IozBEAA4pZOzYDJV5yTeIQFBE0RxEkqTpEkvYBUOg6xA4dQxJElRxG6Jm8WQ5mLpBXnWdxtmzPMqAecghDnLShLiLAAn9KguRFSVQhlQWsA+U8fn4U2NFWt2+qpDUwRlGEFF2iUDh-k66ROiRmQsRxbG+tl+ULHVJiNZulWCWgtX9PV5Whi1daYA2CDBO8wVfGFvwUfUMT3qCoJ1IkSkASkLQmZgRC5vALxpeBNatfW8mIAAtPEBQUSDI1tg4zp6pUrrWjNXlzZ5xx-QdR2g0NlogmCiSg82Rq2il8KsRlEG7ScRhjBMm5o3hapQld5TDjjT41NdCWxIjXpk+x2VcYhdNtWq5Q-gZI5486oNKfEFE6hEI62qDYSS6E3Opgu5MFjliF88cYZipGWJCwD-nqu8ML9RU0RGgayQUckT70BUunRKEjvxMZJOzbz83HDrPEFoLiq+ab+E0TE9Di5EkupEaeMUTCkdxWEsQWmk440er84cplFMB3lMaFdtK1YhTX2Xv9h2AwgI7mvQtG6WUyS0ROA5DeO1GpK+JG9Uk2caL7KPootxfFaXYDlyb1dm6+Q5-qNL4VC7TPJNRmR6an-UJAUFqvU0QA */
  createMachine(
    {
      tsTypes: {} as import('./transactionMachine.typegen').Typegen0,
      id: 'transaction machine',
      predictableActionArguments: true,

      schema: {
        services: {} as {
          getTransactions: {
            data: { data: [] };
          };
          getTypeTransactions: {
            data: any[];
          };
        },
        events: {} as
          | {
              type: 'onChangeType';
              payload: number;
            }
          | { type: 'onEndReached' }
          | { type: 'refreshingList' }
          | { type: 'backToGetTransactions' }
          | { type: 'retryGettingTransactions' }
          | { type: 'retryGettingTypeTransactions' },
      },

      context: {
        routes: [] as any[],
        size: 10,
        page: 0,
        selectedType: 'SPH',
        data: [] as any[],
        index: 0,
        loadTab: true,
        loadTransaction: false,
        isLoadMore: false,
        refreshing: false,
        errorMessage: '' as string | unknown,
        totalItems: 0,
      },

      states: {
        getTransaction: {
          states: {
            loadingTransaction: {
              invoke: {
                src: 'getTypeTransactions',
                onDone: [
                  {
                    target: 'typeLoaded',
                    actions: 'assignTypeToContext',
                  },
                ],
                onError: {
                  target: 'errorGettingTypeTransactions',
                  actions: 'handleError',
                },
              },
            },

            typeLoaded: {
              states: {
                getTransactionsBaseOnType: {
                  invoke: {
                    src: 'getTransactions',
                    onError: {
                      target: 'errorGettingTypeTransactions',
                      actions: 'handleError',
                    },
                    onDone: [
                      {
                        target: 'transactionLoaded',
                        actions: 'assignTransactionsDataToContext',
                        cond: 'isNotLastPage',
                      },
                    ],
                  },

                  entry: 'enableLoadTransaction',
                },

                transactionLoaded: {
                  on: {
                    onEndReached: {
                      target: 'getTransactionsBaseOnType',
                      actions: 'incrementPage',
                      cond: 'hasNoDataOnNextLoad',
                    },

                    onChangeType: [
                      {
                        target: 'getTransactionsBaseOnType',
                        actions: 'assignIndexToContext',
                      },
                    ],

                    refreshingList: [
                      {
                        target: 'getTransactionsBaseOnType',
                        actions: 'refreshTransactionList',
                      },
                    ],

                    backToGetTransactions: {
                      target:
                        'getTransactionsBaseOnType',
                      actions: 'resetProduct',
                    },
                  },
                },

                errorGettingTypeTransactions: {
                  on: {
                    retryGettingTypeTransactions: {
                      target: 'getTransactionsBaseOnType',
                      actions: 'handleRetryGettingTypeTransactions',
                    },
                  },
                },
              },

              initial: 'getTransactionsBaseOnType',
            },

            errorGettingTypeTransactions: {
              on: {
                retryGettingTransactions: 'loadingTransaction',
              },
            },
          },

          initial: 'loadingTransaction',
        },
      },

      initial: 'getTransaction',
    },
    {
      guards: {
        isNotLastPage: (context, event) => {
          if (event.data && event.data.totalPage > 1) {
            return context.page !== event.data.totalPage;
          } else {
            return true;
          }
        },
        hasNoDataOnNextLoad: (context, _event) => {
          return context.totalItems >= 20;
        },
      },
      actions: {
        assignTypeToContext: assign((_context, event) => {
          const newTypeData = event.data.map((item) => {
            return {
              key: item.index,
              title: item.name,
              totalItems: _context.totalItems ? _context.totalItems : 0,
              chipPosition: 'bottom',
            };
          });
          return {
            routes: newTypeData,
            selectedCategories: newTypeData[0].title,
            loadTab: false,
          };
        }),
        assignTransactionsDataToContext: assign((context, event) => {
          const transactionsData = [...context.data, ...event.data.data];
          const newTypeData = context.routes.map((item) => {
            return {
              key: item.key,
              title: item.title,
              totalItems:
                context.selectedType === item.title
                  ? event.data.totalItems
                  : item.totalItems,
              chipPosition: 'bottom',
            };
          });
          return {
            loadTransaction: false,
            isLoadMore: false,
            refreshing: false,
            totalItems: event.data.totalItems,
            data: transactionsData,
            routes: newTypeData,
          };
        }),
        assignIndexToContext: assign((context, event) => {
          return {
            index: event.payload,
            selectedType: context.routes[event.payload].title,
            page: 1,
            loadTransaction: true,
            data: [],
          };
        }),
        incrementPage: assign((context, _event) => {
          return {
            page: context.page + 1,
            isLoadMore: true,
          };
        }),
        refreshTransactionList: assign((_context, _event) => {
          return {
            page: 1,
            refreshing: true,
            loadTransaction: true,
            data: [],
          };
        }),
        enableLoadTransaction: assign((_context, _event) => {
          return {
            loadTransaction: true,
          };
        }),
        handleError: assign((_context, event) => {
          return {
            loadTransaction: false,
            refreshing: false,
            isLoadMore: false,
            errorMessage: event.data.message,
          };
        }),
        resetProduct: assign((context, event) => {
          return {
            data: [],
            page: 1,
            loadTransaction: true,
          };
        }),
        handleRetryGettingTypeTransactions: assign((context, event) => {
          return {
            data: [],
            page: 1,
            loadTransaction: true,
          };
        }),
      },
      services: {
        getTypeTransactions: async (_context, _event) => {
          try {
            // need to call API
            const response = [
              {
                index: 0,
                name: 'SPH',
              },
              {
                index: 1,
                name: 'PO',
              },
            ];
            return response;
          } catch (error) {
            throw new Error(error);
          }
        },
        getTransactions: async (_context, _event) => {
          try {
            // need to call API
            let response;
            if (_context.selectedType === 'SPH') {
              response = await getAllVisitationOrders();
            } else {
              response = await getAllPurchaseOrders();
            }
            response = {
              ...response,
              data: {
                ...response.data,
                totalItems: response.data?.totalItems
                  ? response.data.totalItems
                  : 0,
              },
            };
            return response.data as any;
          } catch (error) {
            throw new Error(error);
          }
        },
      },
    }
  );
