import {
  getAllBrikProducts,
  getProductsCategories,
} from '@/actions/InventoryActions';
import { assign, createMachine } from 'xstate';

export const searchProductMachine = createMachine(
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

            entry: 'enableLoadProduct',
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
          return response.data.result;
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
          return response.data.products;
        } catch (error) {
          console.log(error);
        }
      },
    },
  }
);
