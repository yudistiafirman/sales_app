import {
  getAllBrikProducts,
  getProductsCategories,
} from '@/actions/InventoryActions';
import { assign, createMachine } from 'xstate';

export const searchProductMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACADugPYQCumALgHQCWAdvqRRfVAMQoY6sAKxZlWAG0ADAF1EofEVg0WROpJAAPRAGYAjGqoAmAGwBWAOxGRRnRqMGROgDQgAnoh06AnFQ0AWPSIAcenSM9VwNXDQBfcPtOLDxCEnJqekZmVg40WN5+ROENCSQQaVl5RQLVBE1tfWNTc0trO0d1PW1PPx8DXzU1YwtI6IycAmzKWgYmFjp2BQBhbFQpsAAVVAAjUXypGTkaBSVyg0anBF8Qqm6A808eq1dffpAYofiBJPHUqbZMABsMgEl3hslEUdnsyohrlQ9HpfFYLCIET0RAZ7MdqlQQjprF0saZfF0Hk84iNqES0hAFGAxgA3IgAaypROGCVGZKmCHotMwqBKGyBBRBJX26i0VARGjcPQ0BlCQVRiCsnihOmurhcakMEs8hMGxJZ1G5FDAUCI6BocAAMkRUBBIFQYB8oHx9bA2BS6FTOfTGbrma8qIbjabzbArTa7Q7Jk6SbAOXQuTzdnQ+eJgdsheCEOZ5Qg9BoNBibAYNNCgsW8zquHr-YGTWbLdbbRB7WBHc7Xq6wOhiOgqPhvjyAGamgC2VCZL0SAZ5QfrocbEdbUfbOTjCd54n5W2KSeFuesGM8Vl8Ih8Jg0vhzvh0Il03QMwVcbT8T8rsT9U67PYAyhQZ2wt0KdNd0zYJtCMNQbBELVXDuPMczUWCxVcTU1GPAxPBVN9nhJcddTSL9TT7AcKGHdAxwnXC2SgNciENJMU02ICdzBUByk0XwqE8fx9HzQ5rAwlEmgQQ4C06QIYUMEw83uB46BIOAlEo-U0xY0o2MQABaPQcz4jFXARBFXCMfNpSsbDqynZIJlYVTQXUlQISOZwRFaaEsR0bpKmvCyP1ZfCpjsjMNNzIwcysbQNGRGwsRhSCdF8ydRlrYMG3DCAgpAkLDm0Gw1GvIx-GgmVnKzNUqCsCDrk6AIakS3CUrnMMmxbNsY0y1jHJEkyxU8gqiulQ4rxPO8ekfZ9Tm1KJHl9JLqEI9BfxnDqHPKGEjAqrRuluMzfCE45PFCZDUPQzCpsiIA */
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
          | { type: 'clearInput' },

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
            loadProduct: true,
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
      },
      guards: {
        searchValueLengthAccepted: (_context, event) => {
          return event.value.length > 3;
        },
      },
      services: {
        getCategoriesData: async (context) => {
          try {
            const response = await getProductsCategories(
              '',
              undefined,
              undefined,
              context.searchValue,
              undefined,
              true
            );
            return response.result;
          } catch (error) {
            console.log(error);
          }
        },
        onGettingProductsData: async (context) => {
          try {
            const { page, size, selectedCategories, searchValue } = context;
            const response = await getAllBrikProducts(
              '',
              page,
              size,
              searchValue,
              selectedCategories
            );
            return response.products;
          } catch (error) {
            console.log(error);
          }
        },
      },
    }
  );
