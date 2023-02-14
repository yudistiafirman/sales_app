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
            console.log(error);
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
                id: 'xxx-po-test1',
                companyName: 'PT. Guna Karya Mandiri',
                locationName: 'Jakarta Barat',
                sphs: [
                  {
                    name: 'SPH/BRIK/2022/11/00021',
                    products: [
                      {
                        product_id: 'product1',
                        display_name: 'Beton K 250 NFA',
                        offering_price: 1815000,
                        total_price: 50820000,
                        unit: 28,
                      },
                      {
                        product_id: 'product2',
                        display_name: 'Beton K 200 NFA',
                        offering_price: 1815000,
                        total_price: 70000000,
                        unit: 28,
                      },
                    ],
                  },
                  {
                    name: 'SPH/BRIK/2022/11/00042',
                    products: [
                      {
                        product_id: 'product1',
                        display_name: 'Beton K 250 NFA',
                        offering_price: 1815000,
                        total_price: 50820000,
                        unit: 28,
                      },
                    ],
                  },
                ],
              },
              {
                id: 'xxx-po-test2',
                companyName: 'PT. Karunaguna Marunda',
                locationName: 'Marunda',
                sphs: [
                  {
                    name: 'SPH/BRIK/2022/11/00042',
                    products: [
                      {
                        product_id: 'product1',
                        display_name: 'Beton K 250 NFA',
                        offering_price: 1815000,
                        total_price: 50820000,
                        unit: 28,
                      },
                    ],
                  },
                ],
              },
            ];
            return response;
          } catch (error) {
            console.log(error);
          }
        },
      },
    }
  );
