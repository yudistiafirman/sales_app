import {
  getAllBrikProducts,
  getProductsCategories,
} from '@/actions/InventoryActions';
import { assign, createMachine } from 'xstate';

export const searchProductMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACADugPYQCumALgHQCWAdvqRRfVAMQoY6sAKxZlWAG0ADAF1EofEVg0WROpJAAPRAE4AbCKoAWAMwB2AKwBGAExm1B63qMAaEAE9Eh7UdsaTmkSIAcesxMjAF9gh04sPEIScmp6RmZWDjRI3n5Y4RMJJBBpWXlFHNUEDQMTKlKzHQ09E18DHSr7J0RLMwrPMyMNX26DEVtQ8JScAnTKKgjuOnYIBTBaOgA3IgBrBamo8epN1gR6FcxUAtExU6U8uRoFJWK9EQ0Kgy0RczKTEwDm5wQ1MwMqAZLHo9JozL41CJ-kMQJsxjEJkcKGAoER0DQ4AAZIioCCQKgwRIzPgIiiwNhzOgLA5rDYjLakqhIlFojGwbG4-GEljE7awfbLIhI650U7nHKXAq3RA6IxqKgmB4Ge4gjRGAy+fwOH7VXxUERqaoNAbq0ylGFw6ICOIMJg89gKADC2FQMzAABVUAAjcVSGRXG5FVqNCqGkTVDSWV7K7WIcxGBV1dX1Z4iOXPC30+HWqh4r1EUh0TBJZSwCjHBaoABmyPQAApFT4AJTJLgMnN5gtF1i+3L+qVBhDmWNDsyhMIgOgkOBKS3bC79kXShAAWj0GhHK+MumeVX8Rh0agh4MzbezsUWCXtC-yS8HDUeel8ka+65fvhHoL0VD+hisAwMNQD18HRT0ic8Jl2GYbwDQpQGKdUR18ExHxEBprDMTxfDMdcwNGK0L2ZVF0SxHE8QgGCB3guNXiodwTH0e5sKfWo1BHHDvzTHQdD8Iw03cRi8PbQiK2ItkOXIgkwCJKASWteAJUXQNqKHQ86NqRi-Bw-wzE-Mw3HuHojEwqxnyEiDqE7Qti2gxTb2UlREEjPVjH0NQ1HXYxNDYloShDbjn36AJ3LQkJxyAA */
  createMachine(
    {
      id: 'search product',
      predictableActionArguments: true,
      tsTypes: {} as import('./searchProductMachine.typegen').Typegen0,

      schema: {
        events: {} as
          | { type: 'searchingProducts'; value: string }
          | { type: 'onChangeTab'; value: number },
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
        routes: [],
        selectedCategories: '',
        page: 1,
        size: 10,
        productsData: [],
        loadProduct: false,
      },

      states: {
        inputting: {
          on: {
            searchingProducts: [
              {
                target: 'debouncing',
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
              target: "inputting",
              actions: 'assignIndex',
              internal: true
            }
          },
        },

        searching: {
          invoke: {
            src: 'getCategoriesData',
            onDone: {
              target: 'categoriesLoaded',
              actions: 'assignCategories',
            },
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
              }
            },
          },

          initial: 'gettingProducts',
        },

        debouncing: {
          after: {
            '1000': 'searching',
          },
        },
      },

      initial: 'inputting',
    },
    {
      actions: {
        assignSearchValue: assign((context, event) => {
          return {
            searchValue: event.value,
            loadProduct: true,
          };
        }),
        assignCategories: assign((context, event) => {
          const newCategoriesData = event.data.map((item) => {
            return {
              key: item.id,
              title: item.display_name,
              totalItems: item.ProductCount,
              chipPosition: 'right',
            };
          });
          return {
            routes: newCategoriesData,
            selectedCategories: newCategoriesData[0].title,
          };
        }),
        assignProducts: assign((context, event) => {
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
        clearData: assign((context, event) => {
          return {
            productsData: [],
            routes: [],
          };
        }),
      },
      guards: {
        searchValueLengthAccepted: (context, event) => {
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
