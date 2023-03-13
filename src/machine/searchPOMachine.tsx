import { customLog } from '@/utils/generalFunc';
import { assign, createMachine } from 'xstate';

export const searchPOMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACADugPYQCumALgHQCWAdvqRRfVAMQoY6sAKxZlWAG0ADAF1EofEVg0WROpJAAPRAGYArCKoBOAIwAWEQHYAHHp0A2AEwHTOgDQgAnomuWdVAzp3G9Ig2tjG0sNAF8wp04sPEIScmp6RmZWDjQY3n4E4T0JJBBpWXlFfNUEHWsnVwQ9Y2NdYzVDWoMDNRFLEVMIqPScAizKWgYmFjp2BQBhbFRxsAAVVAAjUTypGTkaBSUymyrEU2tTKmsRI7VvDTUgw56QaP64gUSRlPG2TAAbdIBJV9WlIVNttSog9KZtMYTGdgsYDHVTHV9ghzFQNKcRIYjtZfO1upF7n1YoNqA9sKkIAowMMAG5EADW1LJA3iQzJrAQ9DpmFQxVWAPyQOKO3UATRZj0Gg0hx0Gks1zUyN8el0OLUOlMllM6taljuzKeCSo7PeYHQxHQVHwn15ADMiOgALbGoks54urjk8acujc3lbOj88SAjbC0EIdoGcXmKUyuUK5F6PSWFXWdU4pMmNSmAx6fWuw1DHkUMBQB00OAAGSIqAgkCoMDeUD4rIosDYlLo1K5DKZBZJVGLpfLVZrdYgDbATZbz1gPr9fPEAvWRQDIoQfl0Pm3O+3BmRWssDRscIxejU+c9bqNQ7L6ArsGrtfrjbGzZJ7bNFqtNoo9qdHoxNeRa8sO96js+E6vpkrZzj2xYBkGawFKGa7hhoKq7lhPj7i4YJStoGoVDoJgakm6KXkBhbUF+DoAMoUKBbDLihq4gqAZR6JUeE1NYlGPAONAQN8aR0BAvAYKgjrCMGgqoexKiILmJzmCIAT2PKmnBMiaiNFQ4LgiIcpypq+gRASdAkHASgGiSIZsSUHGIAAtDoUbWBYalGVcUqWMYGjIs5-leDupgaBqRm6XmBK2a2wzJG+9nAo5ik1GoR7BPGkrgoc1josiQSeIEIQVEZ8qmGF-HEnFJpQElYZOQgGjGImXHWF49jYvoFVmDoVXAdQt4jo+Y6QPVaGNRh9RcVorQGFcdSysiYXaHYOjtDi6L+f5-XUYOoF3g+T7jpO04fuNCllMZ+l5QErQLcYS08et9REe0Fh+Yi1h8TF-ZxbR6AMaBF0pWUkbRpK0qbfKaaJlK7VrTcoQauY+K9Fee1Cd8IPrs5BhHh5JFqVKmhyv5uHVFFuhNIcalNOt80GOZYRAA */
  createMachine(
    {
      id: 'search PO',
      predictableActionArguments: true,
      tsTypes: {} as import('./searchPOMachine.typegen').Typegen0,

      schema: {
        events: {} as
          | { type: 'searchingPO'; value: string }
          | { type: 'onChangeTab'; value: number }
          | { type: 'onGettingPOData'; data: any[] }
          | { type: 'getCategoriesData'; data: any[] }
          | { type: 'clearInput' },

        services: {} as {
          getCategoriesData: {
            data: any[];
          };
          onGettingPOData: {
            data: any[];
          };
        },
      },

      context: {
        searchValue: '' as string,
        routes: [] as any,
        selectedCategories: '',
        page: 1,
        size: 10,
        poData: [] as any[],
        loadPO: false,
      },

      states: {
        inputting: {
          on: {
            searchingPO: [
              {
                target: 'searching',
                actions: 'assignSearchValue',
                cond: 'searchValueLengthAccepted',
              },
              {
                target: 'inputting',
                internal: true,
                actions: 'clearData',
              },
            ],

            onChangeTab: {
              target: 'categoriesLoaded.gettingPO',
              actions: 'assignIndex',
            },

            clearInput: {
              target: 'inputting',
              internal: true,
              actions: 'clearData',
            },
          },
        },

        searching: {
          invoke: {
            src: 'getCategoriesData',

            onDone: {
              target: 'categoriesLoaded.gettingPO',
              actions: 'assignCategories',
            },

            onError: 'errorState',
          },
        },

        categoriesLoaded: {
          states: {
            gettingPO: {
              invoke: {
                src: 'onGettingPOData',

                onDone: {
                  target: '#search PO.inputting',
                  actions: 'assignPO',
                },

                onError: '#search PO.errorState',
              },

              entry: 'enableLoadPO',
            },
          },
        },

        errorState: {
          always: 'inputting',
        },
      },

      initial: 'inputting',
    },
    {
      actions: {
        assignSearchValue: assign((_context, event) => {
          return {
            searchValue: event.value,
          };
        }),
        assignCategories: assign((_context, event) => {
          const newCategoriesData = event.data.map((item) => {
            return {
              key: item.count,
              title: item.display_name,
              totalItems: item.count,
              chipPosition: 'right',
            };
          });
          const selectedCategory =
            _context.selectedCategories.length > 0
              ? _context.selectedCategories
              : newCategoriesData[0].title;
          return {
            routes: newCategoriesData,
            selectedCategories: selectedCategory,
          };
        }),
        assignPO: assign((_context, event) => {
          return {
            poData: event.data,
            loadPO: false,
          };
        }),
        assignIndex: assign((context, event) => {
          return {
            selectedCategories: context.routes[event.value].title,
            loadPO: true,
          };
        }),
        clearData: assign((_context, _event) => {
          return {
            poData: [],
            routes: [],
          };
        }),
        enableLoadPO: assign((_context, _event) => {
          return {
            loadPO: true,
          };
        }),
      },
      guards: {
        searchValueLengthAccepted: (_context, event) => {
          return event.value.length > 2;
        },
      },
      services: {
        getCategoriesData: async (_context) => {
          try {
            // call api here
            const response = [
              {
                count: 1,
                key: 'a',
                display_name: 'Semua',
              },
              {
                count: 2,
                key: 'b',
                display_name: 'PO',
              },
              {
                count: 3,
                key: 'c',
                display_name: 'Perusahaan',
              },
              {
                count: 4,
                key: 'd',
                display_name: 'PIC',
              },
            ];
            return response;
          } catch (error) {
            customLog(error);
          }
        },
        onGettingPOData: async (_context) => {
          try {
            // const { page, size, selectedCategories, searchValue } = context;
            // const filteredValue = searchValue
            //   .split('')
            //   .filter((char) => /^[A-Za-z0-9]*$/.test(char))
            //   .join('');

            // call api here
            const response = [
              {
                id: '634b93c2-f9aa-4570-9320-2c06fa5b7fc0',
                name: 'PT. Guna Karya Mandiri',
                locationName: 'Jakarta Barat',
               
                QuotationRequests: [
                  {
                    name: 'PO/BRIK/2022/11/777777',
                    totalPrice: 7120000,
                    QuotationLetter: {
                        id: "19a0bae2-5f5f-479c-a100-48c223ca56e9",
                        number: "SPH/BRIK/2023/02/0004"
                    },
                    products: [
                      {
                        id: "aeb965b0-e984-4190-a70e-e7369eb218ab",
                       offeringPrice: 800000,
                        quantity: 2,
                        Product: {
                            name: "KBOFA",
                            unit: "M3",
                            displayName: "K-BO",
                            category: {
                                name: "FA",
                                Parent: {
                                    name: "BETON"
                                }
                            }
                        }
                    }
                    ],
                  },
                ],
              },
              {
                id: '9ab2de9b-6503-576a-816e-592ba1d9a7c7',
                name: 'Demokrat',
                locationName: 'Jakarta Selatan',
               
                QuotationRequests: [
                  {
                    "totalPrice": 24600000,
                    "QuotationLetter": {
                        "id": "d872d1e1-8789-4e83-8019-3ce89dc4e63f",
                        "number": "SPH/BRIK/2023/03/00003"
                    },
                    "products": [
                        {
                            "id": "94eb961c-a05e-4276-bf0c-a165cb10add9",
                            "offeringPrice": 900000,
                            "quantity": 2,
                            "Product": {
                                "name": "K100FA",
                                "unit": "M3",
                                "displayName": "K-100",
                                "category": {
                                    "name": "FA",
                                    "Parent": {
                                        "name": "BETON"
                                    }
                                }
                            }
                        },
                        {
                            "id": "4974e266-0bca-468b-8f96-9ed6cd625592",
                            "offeringPrice": 5000000,
                            "quantity": 3,
                            "Product": {
                                "name": "K225FA",
                                "unit": "M3",
                                "displayName": "K-225",
                                "category": {
                                    "name": "FA",
                                    "Parent": {
                                        "name": "BETON"
                                    }
                                }
                            }
                        },
                        {
                            "id": "abc9eeb0-373e-4f48-95e7-7ce18dd52d67",
                            "offeringPrice": 3000000,
                            "quantity": 2,
                            "Product": {
                                "name": "K400FA",
                                "unit": "M3",
                                "displayName": "K-400",
                                "category": {
                                    "name": "FA",
                                    "Parent": {
                                        "name": "BETON"
                                    }
                                }
                            }
                        },
                        {
                            "id": "109691e6-0661-4658-95a0-d510cd08adc4",
                            "offeringPrice": 900000,
                            "quantity": 2,
                            "Product": {
                                "name": "K250FA",
                                "unit": "M3",
                                "displayName": "K-250",
                                "category": {
                                    "name": "FA",
                                    "Parent": {
                                        "name": "BETON"
                                    }
                                }
                            }
                        }
                    ]
                },
                  {
                    name: 'PO/BRIK/2022/11/666666',
                    totalPrice: 9000000,
                    QuotationLetter: {
                        id: "07fe3517-b4f9-4e57-b218-54ab0d26024d",
                        number: "SPH/BRIK/2023/02/0004"
                    },
                    products: [
                      {
                        id: "aeb965b0-e984-4190-a70e-e7369eb218ab",
                       offeringPrice: 800000,
                        quantity: 2,
                        Product: {
                            name: "KBOFA",
                            unit: "M3",
                            displayName: "K-BO",
                            category: {
                                name: "FA",
                                Parent: {
                                    name: "BETON"
                                }
                            }
                        }
                    },
                    {
                      "id": "aeb965b0-e984-4190-a70e-e7369eb218ab",
                      "offeringPrice": 800000,
                      "quantity": 2,
                      "Product": {
                          "name": "KBOFA",
                          "unit": "M3",
                          "displayName": "K-BO",
                          "category": {
                              "name": "FA",
                              "Parent": {
                                  "name": "BETON"
                              }
                          }
                      }
                  },
                  {
                      "id": "81c9c85f-5cf3-47c6-94bd-6384f07ce13b",
                      "offeringPrice": 900000,
                      "quantity": 3,
                      "Product": {
                          "name": "K200FA",
                          "unit": "M3",
                          "displayName": "K-200",
                          "category": {
                              "name": "FA",
                              "Parent": {
                                  "name": "BETON"
                              }
                          }
                      }
                  }
                    
                    ],
                  },
                ],
              }
            ];
            return response;
          } catch (error) {
            customLog(error);
          }
        },
      },
    }
  );
