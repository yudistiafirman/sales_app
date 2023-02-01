import {
  getAllBrikProducts,
  getProductsCategories,
} from '@/actions/InventoryActions';
import { event } from 'react-native-reanimated';
import { assign, createMachine } from 'xstate';

export const searchProductMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACADugPYQCumALgHQCWAdvqRRfVAMQoY6sAKxZlWAG0ADAF1EofEVg0WROpJAAPRAGYArCKoBOAIwAWEQHYAHHp0A2AEwHTOgDQgAnomuWdVAzp3G9Ig2tjG0sNAF8wp04sPEIScmp6RmZWDjQY3n4E4T0JJBBpWXlFfNUEHWsnVwQ9Y2NdYzVDWoMDNRFLEVMIqPScAizKWgYmFjp2BQBhbFRxsAAVVAAjUTypGTkaBSUymyrEU2tTKmsRI7VvDTUgw56QaP64gUSRlPG2TAAbdIBJV9WlIVNttSog9KZtMYTGdgsYDHVTHV9ghzFQNKcRIYjtZfO1upF7n1YoNqA9sKkIAowMMAG5EADW1LJA3iQzJrAQ9DpmFQxVWAPyQOKO3UATRZj0Gg0hx0Gks1zUyN8el0OLUOlMllM6taljuzKeCSo7PeYHQxHQVHwn15ADMiOgALbGoks54urjk8acujc3lbOj88SAjbC0EIdoGcXmKUyuUK5F6PSWFXWdU4pMmNSmAx6fWuw1DHkUMBQB00OAAGSIqAgkCoMDeUD4rIosDYlLo1K5DKZBZJVGLpfLVZrdYgDbATZbz1gPr9fPEAvWRQDIoQfl0Pm3O+3BmRWssDRscIxejU+c9bqNQ7L6ArsGrtfrjbGzZJ7bNFqtNoo9qdHoxNeRa8sO96js+E6vpkrZzj2xYBkGawFKGa7hhoKq7lhPj7i4YJStoGoVDoJgakm6KXkBhbUF+DoAMoUKBbDLihq4gqAZR6JUeE1NYlGPAONAQN8aR0BAvAYKgjrCMGgqoexKiILmJzmCIAT2PKmnBMiaiNFQ4LgiIcpypq+gRASdAkHASgGiSIZsSUHGIAAtDoUbWBYalGVcUqWMYGjIs5-leDupgaBqRm6XmBK2a2wzJG+9nAo5ik1GoR7BPGkrgoc1josiQSeIEIQVEZ8qmGF-HEnFJpQElYZOQgGjGImXHWF49jYvoFVmDoVXAdQt4jo+Y6QPVaGNRh9RcVorQGFcdSysiYXaHYOjtDi6L+f5-XUYOoF3g+T7jpO04fuNCllMZ+l5QErQLcYS08et9REe0Fh+Yi1h8TF-ZxbR6AMaBF0pWUkbRpK0qbfKaaJlK7VrTcoQauY+K9Fee1Cd8IPrs5BhHh5JFqVKmhyv5uHVFFuhNIcalNOt80GOZYRAA */
  createMachine(
    {
      id: 'search product',
      predictableActionArguments: true,
      tsTypes: {} as import('./searchProductMachine.typegen').Typegen0,

      schema: {
        events: {} as
          | { type: 'searchingProducts'; value: string }
          | { type: 'onChangeTab'; value: number }
          | { type: 'onGettingProductsData'; data: any[] }
          | { type: 'getCategoriesData'; data: any[] }
          | { type: 'clearInput' }
          | { type: 'sendingParams'; value: number },

        services: {} as {
          getCategoriesData: {
            data: any[];
          };
          onGettingProductsData: {
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
        productsData: [] as any[],
        loadProduct: false,
        distance: 0,
      },

      states: {
        inputting: {
          on: {
            searchingProducts: [
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
              target: 'categoriesLoaded.gettingProducts',
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
              target: 'categoriesLoaded.gettingProducts',
              actions: 'assignCategories',
            },

            onError: 'errorState',
          },
        },

        categoriesLoaded: {
          states: {
            gettingProducts: {
              invoke: {
                src: 'onGettingProductsData',

                onDone: {
                  target: '#search product.inputting',
                  actions: 'assignProducts',
                },

                onError: '#search product.errorState',
              },

              entry: 'enableLoadProduct',
            },
          },
        },

        errorState: {
          always: 'inputting',
        },

        idle: {
          on: {
            sendingParams: {
              target: 'inputting',
              actions: 'assignParams',
            },
          },
        },
      },

      initial: 'idle',
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
              key: item.id,
              title: item.display_name,
              totalItems: item.ProductCount,
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
        assignProducts: assign((_context, event) => {
          return {
            productsData: event.data,
            loadProduct: false,
          };
        }),
        assignIndex: assign((context, event) => {
          return {
            selectedCategories: context.routes[event.value].title,
            loadProduct: true,
          };
        }),
        clearData: assign((_context, _event) => {
          return {
            productsData: [],
            routes: [],
          };
        }),
        enableLoadProduct: assign((context, event) => {
          return {
            loadProduct: true,
          };
        }),
        assignParams: assign((context, event) => {
          return {
            distance: event.value / 1000,
          };
        }),
      },
      guards: {
        searchValueLengthAccepted: (_context, event) => {
          return event.value.length > 2;
        },
      },
      services: {
        getCategoriesData: async (context) => {
          try {
            const response = await getProductsCategories(
              undefined,
              undefined,
              context.searchValue,
              undefined,
              true
            );
            return response.data.result;
          } catch (error) {
            console.log(error);
          }
        },
        onGettingProductsData: async (context) => {
          try {
            const { page, size, selectedCategories, searchValue, distance } =
              context;
            const filteredValue = searchValue
              .split('')
              .filter((char) => /^[A-Za-z0-9]*$/.test(char))
              .join('');
            const response = await getAllBrikProducts(
              page,
              size,
              filteredValue,
              selectedCategories,
              distance
            );
            return response.data.products;
          } catch (error) {
            console.log(error);
          }
        },
      },
    }
  );
