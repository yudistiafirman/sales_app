import { getAllOrders } from '@/actions/OrderActions';
import { customLog } from '@/utils/generalFunc';
import { createMachine } from 'xstate';
import { assign } from 'xstate/lib/actions';

export const transactionMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPaYAEAtngBYGZgB0MyAKhtnoSfQDZHoS0orLDnzFMAYggkGtAG5EA1gzQiO4itVoMmw9mK69+gvaM6YE8ornTmA2gAYAuo6eJQAByKwC59yAAPRABmYIBGegB2ADYAVmiAJmDIgE5Y4OjM2IAaEABPRDDYh3oUspTIhwci1ISHaIBfBtzVfXNNXBo6RjAWNjNxHj4BTCF+9RIJMFRUIlR6D25bADM58npWgZIOrp1e0wnMIeNRg4MLKxt7Z1d-Lx8-JEDChwAWaPow6NeHAA4EmJvSLBHL5RApJL0cIJV5FWIJFKJMKRJotcbnHbaHp9NTnDZ5DxgAAyw0g2LO5lgACF0LAwAB5TDMAlgKQyehWZQbdHtSidLG6HmDZAskn8MmC3GUml0xnMwmWTAKK7iVy3J73XzifxBBAZX5ROKJWKvd6xWK-FK5AoIaIg0rpeoZGEVYKokCbQ6Y7qStrC0WkiDkoUkam0hlMllTGZzBZLZCrVDrT0Yvm7YNS-2EsUQCX7EPYGUR+VgRXK2yqm7OO7eLUkHUvd6fb5-AHRIEg62If4pei-WIQlKvQEpS2-d0p3laH35zNcEXZwPcueYHOQCQkACimAgACUwNRIOrPLXHqBdSCEvRor9Iq9R-9omEUn9QTbIgj6D8n79XsEUhkbzjs0HoFt6ew4n684BuKQaTuIa4QBumAAMJUFgMAlseICamezx6vC163vevyPs+r5dgg-yxH2A4Iv8CS-A4H4TmBaYCrOUFHAuxJLvBJCIRIqBgMswmwF0UBEgQsDINhuHak8F6ETed4PgkT4vv2lEQle0KwnUxr-q8rEruBGZcfii6wcuXGCQARngijMEQADinFbNgcmngp56FMEJQmmErxJLe-4fpElFhA46SlJEqQWv2-ZhF8TQgZgRC5vATz8WQ7F0DWDw+fhAC0MKUaVrz0FUVTJEkqmwmECQmVxZm+h5BV1pgDYIGVYK2sEX7lJkwSWkFlooiBOWte5hzHCMYwrh1eG6h+kV2lE6nwuRYXDhNaKmXlEEUlmvGwUtRUrVafUmgaryOnF0QQqRMTNR502QR5lmnbmQZtYcYaypGhLnfWimIJUNEVHEvzfMlzEOFdNq-EUUIgsRcXBEkN6vV6h3mZ9PGITZHmISDXVgwgjURX1mS9gjiQvpEpFfACOOptODDTLMqBucghCnCyZPdY1-z0PECSxFFYRMQjvzBJR-Z04l5oZBUdRhKlDRAA */
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
          | { type: 'backToGetTransactions' },
      },

      context: {
        routes: [] as any[],
        size: 10,
        page: 0,
        selectedType: '',
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
                  target: '#transaction machine.errorGettingType',
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
                      target: '#transaction machine.errorGettingType',
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
                        '#transaction machine.getTransaction.loadingTransaction',
                      actions: 'resetProduct',
                    },
                  },
                },
              },

              initial: 'getTransactionsBaseOnType',
            },
          },

          initial: 'loadingTransaction',
        },

        errorGettingType: {},
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
              totalItems: item.index,
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
              key: event.data.totalItems,
              title: item.title,
              totalItems: event.data.totalItems,
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
      },
      services: {
        getTypeTransactions: async (_context, _event) => {
          try {
            // need to call API
            const response = [
              {
                index: 1,
                name: 'SPH',
              },
              // {
              //   index: 2,
              //   name: 'DO',
              // },
              // {
              //   index: 3,
              //   name: 'Deposit',
              // },
              // {
              //   index: 4,
              //   name: 'Jadwal',
              // },
              // {
              //   index: 5,
              //   name: 'PO',
              // },
            ];
            return response;
          } catch (error) {
            customLog(error);
          }
        },
        getTransactions: async (_context, _event) => {
          try {
            // need to call API
            const response = await getAllOrders();
            // const response = {
            //   transactions: [
            //     {
            //       title: 'SPH/BRIK/2022/11/07856',
            //       name: '',
            //       desc: 'Proyek Jembatan',
            //       status: 'Diajukan',
            //       address: 'Jalan Kramat 3 no 15 Kel Sukatani Kec Tapos  Depok',
            //       chosenProducts: [
            //         {
            //           id: 'k350',
            //           product: {
            //             name: 'Beton K 350 NFA',
            //           },
            //           sellPrice: 1815000,
            //           volume: 28,
            //         },
            //         {
            //           id: 'k200',
            //           product: {
            //             name: 'Beton K 200 NFA',
            //           },
            //           sellPrice: 1815000,
            //           volume: 28,
            //         },
            //       ],
            //       company: 'PT. Guna Karya Mandiri',
            //       pic: {
            //         name: 'Agus',
            //         jabatan: 'Finance',
            //         phone: '8972633212',
            //         email: 'agus@agus.com',
            //       },
            //       paymentMethod: 'Cash',
            //       expiredDate: '20 December 2022',
            //       createdDate: '28 Dec 2022 14:58',
            //     },
            //     {
            //       title: 'SPH/BRIK/2022/11/07856',
            //       name: 'SPH/BRIK/2022/11/00254',
            //       desc: 'Proyek Jembatan',
            //       status: 'Cek Barang',
            //       address: 'Jalan Kramat 3 no 15 Kel Sukatani Kec Tapos  Depok',
            //       chosenProducts: [
            //         {
            //           id: 'k350',
            //           product: {
            //             name: 'Beton K 350 NFA',
            //           },
            //           sellPrice: 1815000,
            //           volume: 28,
            //         },
            //         {
            //           id: 'k200',
            //           product: {
            //             name: 'Beton K 200 NFA',
            //           },
            //           sellPrice: 1815000,
            //           volume: 28,
            //         },
            //       ],
            //       lastOrder: [
            //         {
            //           title: 'PO/BRIK/2022/11/00023',
            //           price: 50820000,
            //           chosenProducts: [
            //             {
            //               id: 'k350',
            //               product: {
            //                 name: 'Beton K 350 NFA',
            //               },
            //               sellPrice: 1815000,
            //               volume: 28,
            //             },
            //             {
            //               id: 'k200',
            //               product: {
            //                 name: 'Beton K 200 NFA',
            //               },
            //               sellPrice: 1815000,
            //               volume: 28,
            //             },
            //           ],
            //         },
            //         {
            //           title: 'PO/BRIK/2022/11/00023',
            //           price: 50820000,
            //           chosenProducts: [
            //             {
            //               id: 'k350',
            //               product: {
            //                 name: 'Beton K 350 NFA',
            //               },
            //               sellPrice: 1815000,
            //               volume: 28,
            //             },
            //             {
            //               id: 'k200',
            //               product: {
            //                 name: 'Beton K 200 NFA',
            //               },
            //               sellPrice: 1815000,
            //               volume: 28,
            //             },
            //           ],
            //         },
            //       ],
            //       company: 'PT. Guna Karya Mandiri',
            //       pic: {
            //         name: 'Agus',
            //         jabatan: 'Finance',
            //         phone: '8972633212',
            //         email: 'agus@agus.com',
            //       },
            //       paymentMethod: 'Cash',
            //       expiredDate: '20 December 2022',
            //       createdDate: '28 Dec 2022 14:58',
            //       deposit: {
            //         firstSection: 'Deposit Awal',
            //         firstSectionValue: 60000000,
            //         secondSection: 'Tambahan Deposit',
            //         secondSectionValue: 7000000,
            //         thirdSection: 'Deposit Akhir',
            //       },
            //     },
            //     {
            //       title: 'SPH/BRIK/2022/11/07856',
            //       name: 'SPH/BRIK/2022/11/00254',
            //       desc: 'Proyek Jembatan',
            //       status: 'Persiapan',
            //       address: 'Jalan Kramat 3 no 15 Kel Sukatani Kec Tapos  Depok',
            //       chosenProducts: [
            //         {
            //           id: 'k350',
            //           product: {
            //             name: 'Beton K 350 NFA',
            //           },
            //           sellPrice: 1815000,
            //           volume: 28,
            //         },
            //         {
            //           id: 'k200',
            //           product: {
            //             name: 'Beton K 200 NFA',
            //           },
            //           sellPrice: 1815000,
            //           volume: 28,
            //         },
            //       ],
            //       lastOrder: [
            //         {
            //           title: 'PO/BRIK/2022/11/00023',
            //           price: 50820000,
            //           chosenProducts: [
            //             {
            //               id: 'k350',
            //               product: {
            //                 name: 'Beton K 350 NFA',
            //               },
            //               sellPrice: 1815000,
            //               volume: 28,
            //             },
            //             {
            //               id: 'k200',
            //               product: {
            //                 name: 'Beton K 200 NFA',
            //               },
            //               sellPrice: 1815000,
            //               volume: 28,
            //             },
            //           ],
            //         },
            //       ],
            //       company: 'PT. Guna Karya Mandiri',
            //       pic: {
            //         name: 'Agus',
            //         jabatan: 'Finance',
            //         phone: '8972633212',
            //         email: 'agus@agus.com',
            //       },
            //       paymentMethod: 'Cash',
            //       expiredDate: '20 December 2022',
            //       createdDate: '28 Dec 2022 14:58',
            //       deposit: {
            //         firstSection: 'Deposit Awal',
            //         firstSectionValue: 60000000,
            //         secondSection: 'Tambahan Deposit',
            //         secondSectionValue: 7000000,
            //         thirdSection: 'Deposit Akhir',
            //       },
            //     },
            //     {
            //       title: 'SPH/BRIK/2022/11/07856',
            //       name: 'SPH/BRIK/2022/11/00254',
            //       desc: 'Proyek Jembatan',
            //       status: 'Diajukan',
            //       address: 'Jalan Kramat 3 no 15 Kel Sukatani Kec Tapos  Depok',
            //       chosenProducts: [],
            //       company: 'PT. Guna Karya Mandiri',
            //       pic: {
            //         name: 'Agus',
            //         jabatan: 'Finance',
            //         phone: '8972633212',
            //         email: 'agus@agus.com',
            //       },
            //       paymentMethod: 'Cash',
            //       expiredDate: '20 December 2022',
            //       createdDate: '28 Dec 2022 14:58',
            //       deposit: {
            //         firstSection: 'Deposit',
            //         firstSectionValue: 28000000,
            //         secondSection: 'Beton K 250 NFA',
            //         secondSectionValue: -25410000,
            //         thirdSection: 'Est. Sisa Deposit',
            //       },
            //     },
            //     {
            //       title: 'SPH/BRIK/2022/11/07856',
            //       name: 'SPH/BRIK/2022/11/00254',
            //       desc: 'Proyek Jembatan',
            //       status: 'Kadaluarsa',
            //       address: 'Jalan Kramat 3 no 15 Kel Sukatani Kec Tapos  Depok',
            //       chosenProducts: [],
            //       company: 'PT. Guna Karya Mandiri',
            //       paymentMethod: 'Cash',
            //       expiredDate: '20 December 2022',
            //       createdDate: '28 Dec 2022 14:58',
            //       deposit: {
            //         firstSection: 'Deposit',
            //         firstSectionValue: 28000000,
            //         secondSection: 'Beton K 250 NFA',
            //         secondSectionValue: -25410000,
            //         thirdSection: 'Est. Sisa Deposit',
            //       },
            //     },
            //     {
            //       title: 'SPH/BRIK/2022/11/07856',
            //       name: 'SPH/BRIK/2022/11/00254',
            //       desc: 'Proyek Jembatan',
            //       status: 'Ditolak',
            //       address: 'Jalan Kramat 3 no 15 Kel Sukatani Kec Tapos  Depok',
            //       chosenProducts: [],
            //       company: 'PT. Guna Karya Mandiri',
            //       pic: {
            //         name: 'Agus',
            //         jabatan: 'Finance',
            //         phone: '8972633212',
            //         email: 'agus@agus.com',
            //       },
            //       paymentMethod: 'Cash',
            //       expiredDate: '20 December 2022',
            //       createdDate: '28 Dec 2022 14:58',
            //     },
            //   ],
            //   message: '',
            //   totalItems: 6,
            //   totalPage: 1,
            // };
            return response.data as any;
          } catch (error) {
            customLog(error);
          }
        },
      },
    }
  );
