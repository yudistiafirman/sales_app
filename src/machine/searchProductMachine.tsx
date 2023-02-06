import {
  getAllBrikProducts,
  getProductsCategories,
} from '@/actions/InventoryActions';
import { assign, createMachine } from 'xstate';

export const searchProductMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACADugPYQCumALgHQCWAdvqRRfVAMQoY6sAKxZlWAG0ADAF1EofEVg0WROpJAAPRAFYATABoQAT0QBOAMwiqADgBsBixbMmALPYOWAvi52cseQiXLV6jMysHGhevPx+wgCMEkgg0rLyinGqCFEaAOwaVGoieXlRakb2Djr6CDZqVPZmZukiGkYaUS0Wbh6hOAQRlLQMTCx07AoAwtioQ2AAKqgARqKxUjJyNApKqUVGVBlmBiJ7IlEZtgYZZYj26dsaFmr2FhlNdiYZ7SCeXT4C-v1BQ2yYAA2oQAkr8FkoEis1ilEFEjBYolQNCIMiIjJYNGZUY9zgg1FYqOiantsbsjBkom8Pt4etQacEIAowH0AG5EADWLJp3V8vQZQwQ9HZmFQSQWELiUKS60QDhyOyi9gJGjUSpKeLq1QMOucWURNREZmpnVpfPppuCYHQxHQVHwgLFADMiOgALZUHlfPyey2C4VEUXi8SSpaJVbJUCpeVqRXKiyq9VGPFHexUAxFKJGowmCz2Q5GE1cM3fKhBsBQV00OAAGSIqAgkCoMD+UD45tgbCZdBZAa5vuLvNL5cr6GrsDrDabLcGbbpsCFdBFYojEvEkOWMthCBK2QMyqMLUsJWMdjxCdM5JRBhuN7MBKLXiHPpHVdr9cbEGbYFb7e+netW17UdCgXXdAcn29XpXzHd8py-Gdwg7Rdl2DMRQ3iTcI1lHcmnTA8jzzIxT2TPREAyAlzCsY4D2sQoqXcd5TWfXpANdABlCgxTANgMOlbDtzqLYLH2Ck7k0YwijxGiqBaZwjQedIzFVR9PjpWgIGBEI6AgXgMFQN1hHXKUsJhKNyLzIlGnsZo8xEe41E1FoqERU5mjqKJKjcRi6BIOAlC9OkN3DMyVEQABaCw8Ui1SSx9AIBlYYLoUjMK0nRAxZLMDInETezmm0MiEGOCx8Pqaw6lqMx7FiliLWLJKTJC1LUhslMGhcw47mq-Y8jUfdaqg6gYPHSdP2SrdzOK+w8SKDJqiKfYlVjLJCkG9SRrgz9v1-ecJoEqb0kK8oEzTDMTH3BFrBqQtGMC80qDY9BOO4-bQtSWwqk0YpiJ1LELGKaSAdkqJTjsylM2NO7mKGjTgTelrEFsUxvpPP7LEBoq7CqfYAZReyKVBgxvJcIA */
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
