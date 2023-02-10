import { getAllOrders } from '@/actions/OrderActions';
import { createMachine } from 'xstate';
import { assign } from 'xstate/lib/actions';

export const transactionMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcBOBLAxmABAWwENMALdAOzADoYAXABVQHsIBXTGygG0YInKgbM2NAMQRGFSuQBujANZU0WXIRLkqtQa3ZcefMgKbaaCGY0wEa6CQG0ADAF17DxCkax0Via5AAPRABMAOwALJQArHZRdgCMAMwAHCEJAJxxdiEANCAAnoFBcXGUAGyxpcUJBUFBMUEAvnXZStj4RKSSmkbCurz8WsIiYKhMqJTInJYAZoyoeGMYLartGmD0XTrcvQb97KZkshZeZM7OPsjuntZkPv4IMSF2xZQBdnH3cSEpD+HF2XkIAS+QRKQRSQUB9x+4QCcQaTQWKja6moqx2HEOYCgM3QcAAMnpICi1kJ2LAAEIEWBgADyZAAwpZMdi4GIJFQzAp5spWmoOqj1ujGViMHiCRAiWjyZSafShczYHsDpYridHGcLkcbohQuESpVIuFwulYm8-oFkrrij9AWl4gkAsU4SBmojeSticZKBjhTjYPjeITOiSaFKqbSGTQmSLYINhjMxhMaNNZlzFki+R7ut75f6IIH+cHQzKI1HfYrzMrbI5TkhnRqrlq7g8ni83iEPl87D8zQDisVgX2AuEQv2vikUkanS6ecsJQKvXLo7nCWhg8uICIJABRMgQABKYDakBrbg8mtrtx1eqCBqNUXiMR7Q9Bzw+ISHH2KMQnU4RM+RQaetmS5ivMa5ipu9LEAQBhgCWPpwCedZng2F7aiElr6l2d4mo+uSBP2uoJDEQ4hEEX4JHYN4JL+3JLABBZAYuvrrmBxjriIqBgJMXGwO0UC4ugsA0Eh5wod4aEIFeFQ3thxoPk+1QBJQcQpI8xQpAkqQTsUIS0WmbpzsGC6Rghfqgau7EQQARkQcgACqMAAkhAnBgKJ9YSaAtxxA6lCUSOKTFAEWnJBhPbEZQnzjmCcTBek7Y0Y0zp-vRkiUnIdBDHgQkeBIrKSByiipemVAZVlsy5Vc5aHCq1ZqrWYmXF5fiINCPYxEaTydcUxrVG8MQxPprqzuV2VVfl4iFfs8jFXRpWUGNlWwHlZA1ZWxzVjELiNZ51ySe1+EIG84QpM8MSVCkDrxBkw3-ulnDcAA7pABXsjNnLTmlZWPYwL0QOtRyqjtp7Nft3mIG8TwBRpwWhUk4RPpp-khSRUQJEalRJfC82GQQv3-bGIwJlMMxzF9C3489kCA3VTgNaD54Q8djz+RksMhUkCM9r1ynNgEGFkRk47hHd32UHmZA4uKyaYkwLC7iIBDIMgdKMHgYAUpgchQPLu4AMo0IyHnieDrUIMOwJUcRIQXROiThHh-xvKElBBZdnWQqCjrJRThmS9LlC2druuMArG7K6r6tgAAYjMcthwbRuRibYONsFPbpKpUUyVdMQUXE9S+yVhlDCMADiqxWAY+K1flvjCYyi2TJGqAABSRHYACUIh+7OZczJXNDVwJFZAwzyFp5JAC0JHKTCCSF2RI43uRWRHYN6T+XFfY3uOASc2LC2YCwwxgGQNC1xtHFTe9sifSXs4n2fF9X0c6601W9Mg5PTPm4v0NWwhRSJCPsKQnwZAiIvXyV0+ynVKNjFKuMn6ny4q-MeVwOID1GOMUmKY+7Imfmgy+GCJAfzMHXTa391Sm0bAAlGrxgGgI0j2R2RQeoCytBUIKsQj6GW4JQgAIqsAg6BOA3yEkbMg2ADxtAINZNyqc-63BCspI0akvy6WCKUAIHVahFA0SFW2kQXj2j4bOARG1hFGzERIxu0iwCyJIPIxR20aFT2ZqoiIqlHj53fOROwuiN5djCFwh045QRLz0sXZByIFZcTkQosAIhSB5gAOoEFQFLAwSjULM3BBArslAqKAgojUDShpzHInQK5ZJEgACCsBMrjRWnTdxyjIb5zZoFOGXNwpHVUnzR4nDBrVHCOCWEMSDKzhqW5EQVJdx9EyQQPAsBcktR8n5GGQVOZhURkdF489opgmInESINQGjJTIMwOAZxH7qHaXk82s8gh2FfIvUIoRCJrx7NPXUMUdldliKdOKQ0pkjQYpmdgjyNmBEGhEaIJouZpAyB1NSZ0uGFCtA6V4dhEEEIzGiHo+hDDBhhWbFRp0EXRDtMkFF69-jfjBJQDhE40hJC+D7HG0zIVEuAixMU5LGzRWeMcrSwR7gVCfKpBILLrTBXUZRXSVTCXzn5aKAM4pALCCLOGZitzdq0MkjELsZ13bUTxZ2bsByrRFBePnTqdgwQqvdHy-V5lNVsWEOuIVB0yKipiuKmoI4EiKXtM8Xqjw4olNIi6yg2Ch4j3gvKX1zM-GytGa2e0bxs1Plhm7R2FEuGghSHGpaOVWktSah0hA7YwivLeICMiw4PkdULk8QxvUzmvB1GWgmkBU3m3fJnb8bs85qX0Xi6EcaA4DsNR482cVdTW3iIkIIlF85dkzni4EIabzLy7FypBPLJCzplvHUO4dB23FtkUFdhQsZlC3QM2ouo93VFBJ8MKM7z6B2DjrPWEBr2IEonejGQVQjjkFvs52r6c5aS7DCd8JrJncohZIBNVd+BvyedWp5txp6pCiuRcINsogtvARvQuwJvxGk9rpMEyrwX3SoEQ8+JDKE+vnTW0jHaZJ9h3p+p8tQVLggeLUQaI52xxssUcaxojxGCu4-h7UQQOoZH+cM9swQznruiWhljlB4mHmcUk4DFtmUkc0UOeI+71OGjlQqhVYJ2xFwM+LWZYBzPDqOmpUTnxeZaXtIvaJDQgA */
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
          | { type: 'refreshingList' },
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
          return {
            loadTransaction: false,
            isLoadMore: false,
            refreshing: false,
            totalItems: event.data.totalItems,
            data: transactionsData,
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
            console.log(error);
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
            console.log('inii, ', response.data);
            return response.data as any;
          } catch (error) {
            console.log(error);
          }
        },
      },
    }
  );
