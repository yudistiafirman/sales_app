import { bStorage } from '@/actions';
import { storageKey } from '@/constants';
import { assign, createMachine } from 'xstate';

const POMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EAJgAsAdkruAHAE5D7u4AzACsAGwhhiFBzgA0IACeiACM3s6U0b5Z3u6GycFBQa4AvsXxkjj4RKTkVDT0TKwQHJy4EBAAkgC2uDCwZvbIVjZ6vPZOCGHpQb6uIa6GYaEhzr5B7vFJk8mulIXOyYthAUHJISGl5RiVMjXyYLwAjqiC6GBsAPIAKgnIYJxQYhfYgAMVesG0DG0YGQAyQICG1lsY3hE2c6MoxzOYVy3hWgSimxSzhxXmSU1cbnJhmclwR12k1TkVAez1e72+v3+gOBYPQEKhMP0yXM8MRIzsqJcGKx4Vx+NyISJCDxIT2aV86JCOx2lLpFUZslqlAAZuDIdDkJQ2s0PpwCLgpMIoAxkNg4ZYkaNxoh3EtKIZA4GfIVDt4gsrgrslqtnKdks53PlvPqGVUjfIzfyLTDre1Pq12gBZUhgbq9OAehHDZE+hArZVnBaUA4UhOpHIxVNSdN3KhZgWWvO27hgAA2YGh5ZgVfFtal9e8yT22vmvgihzWyqmnhJp1COTWOzC3ZuTONA5zVptBeEaEhbtnNe9C4plF8fvOqTCOIjiUQ0SGJQS5Br42ozDitJlPSPa3MyprmoKVoMGAjo4K62CcAARrg9DAgAgvmxBPl6kqgBMPieGB8aGBqhR4sqaRqq4P4HIUtGuNkp6Gn2CHZkhlAoWh2AYUIvD3rovBQPaqFOlJJESii5EpIYawBu4sz5IUKzrN4yprEBOIRHkrihOiSzcb28GXgJQlSKJDpyS6brcHwAgaGIEhpnBF6IUOdnoW6lCOTgzoYeoIjEFoyJmAp87KQgyQxOkmo0gsQSGK4S5hHp-4IKlwEgSE4YLDi3gntBBpWb5-H+bJgXYMF9XYGFLl8AAwngUlgO1OhgIC6CCJWJiDM+ZGOCpS4Bs4tGnDStHeAEkacS2LFhJqazaoEFVXLB56Zn5uYBSJQV3qg2iSdJxB-LwzolhAuBjnFL4Jd4b0BniM2GBlqyRGE+nfV4M3rR+gSFKElk+QdtW5tdDz3Y9nXEFYYAYYWEBIyjvAYc940TOcvjvhE5w5SsYauIx5zqrGhwrOVcylNBvDEOQ8Bit5+3oKNpFKRNCAALT-Xl-PpAcgYzfkYRZRl7iQ5zChKI0qjc4pdaUo2pleH4WSzDiwRyxmVAAKIODYKvxXz6t5XiLba+48w5b4h4G7xrIvG8nw-H85svXz+TRjlYb24GMwNnlOx5JQyTJOuaxFMVcYlJVHOG3xg4wj7eMAdHRPnOEn3k8qria3NeRBOV3icRSLvWYd175h8me8-jYFeOtKwbm9zjFZGzjeGSUxTG4a0HDXNXp8hzUYU3dYfoTyaZbkrg7EuvjbmEy7uCxwRuOsZxdsne2pzZdXCaJZ0Xc6M8LociZRz4i+ZSvcTW0UhW0zM23FUnu1nsfdeCSnkFEKLUpLTzFGNZuxIpozQ2osUy65K6MRzuXWmq8chUjHvIOGvBepdAoLga+CU4zpBYqpaIUtUEzVylsck8wWzkjcFLVIvhaZYP7AAnBCMxyYwIOAz0qtXzhEoMXSuG9AgrBYi-WheRlwUnYt9aOMwk6lCAA */
  createMachine(
    {
      id: 'purchase order',
      predictableActionArguments: true,
      tsTypes: {} as import('./PoMachine.typegen').Typegen0,
      schema: {
        events: {} as
          | { type: 'getSavedPo'; data: Record<string, string> }
          | { type: 'goToFirstStep'; value: string }
          | { type: 'addImages'; value: any }
          | { type: 'deleteImage'; value: number }
          | { type: 'inputSph'; value: string }
          | { type: 'addMoreImages' }
          | { type: 'searchingSph' }
          | { type: 'backToAddPo' }
          | { type: 'searching'; value: string }
          | { type: 'onChangeCategories'; value: number },
      },
      context: {
        poImages: [{ photo: null }],
        sphNumber: '',
        searchQuery: '',
        sphCategories: '',
        routes: [
          {
            key: 'first',
            title: 'Sph',
            totalItems: 3,
            chipPosition: 'right',
          },
        ],
        sphData: [
          {
            name: 'PT Guna Mandiri',
            location: 'Grogol ',
            paymentType: 'CBD',
            sph: [
              {
                no: 'SPH/BRIK/2022/11/0021',
                totalPrice: 5000000,
                products: [
                  {
                    display_name: 'BETON K 250 FA',
                    unit: 28,
                    price_per_unit: 1700000,
                  },
                  {
                    display_name: 'BETON K 100 NFA',
                    unit: 29,
                    price_per_unit: 1600000,
                  },
                ],
              },
              {
                no: 'SPH/BRIK/2021/19/0022',
                totalPrice: 5100000,
                products: [
                  {
                    display_name: 'BETON K 250 FA',
                    unit: 28,
                    price_per_unit: 1700000,
                  },
                  {
                    display_name: 'BETON K 100 NFA',
                    unit: 29,
                    price_per_unit: 1600000,
                  },
                ],
              },
            ],
          },
          {
            name: 'PT Kujang nusantara',
            location: 'Sumedang',
            paymentType: 'CREDIT',
            sph: [
              {
                no: 'SPH/BRIK/2022/11/0021',
                totalPrice: 5000000,
                products: [
                  {
                    display_name: 'BETON K 250 FA',
                    unit: 28,
                    price_per_unit: 1700000,
                  },
                ],
              },
            ],
          },
        ],
      },
      states: {
        checkSavedPo: {
          invoke: {
            src: 'getSavedPo',
            onDone: {
              target: 'enquirePOType',
              cond: 'isHasSavePo',
            },
          },

          on: {
            addImages: {
              target: 'firstStep.addPO',
              actions: 'assignImages',
            },
          },
        },

        Exit: {},

        enquirePOType: {
          on: {
            goToFirstStep: [
              {
                target: 'openCamera',
                cond: 'isPOProvidedByCustomers',
              },
              'firstStep.SearchSph',
            ],
          },
        },

        firstStep: {
          states: {
            addPO: {
              on: {
                searchingSph: 'SearchSph',
                addMoreImages: '#purchase order.openCamera',

                deleteImage: {
                  target: 'addPO',
                  internal: true,
                  actions: 'assignDeleteImageByIndex',
                },

                inputSph: {
                  target: 'addPO',
                  internal: true,
                  actions: 'assignValue',
                },
              },
            },

            SearchSph: {
              states: {
                inputting: {
                  on: {
                    searching: {
                      target: 'searchingSph',
                      actions: 'assignSearchQuery',
                    },

                    openingModal: "#purchase order.firstStep.openModalChooseSph"
                  },
                },

                searchingSph: {
                  invoke: {
                    src: 'GetSphList',
                    onDone: 'inputting',
                  },

                  on: {
                    onChangeCategories: {
                      target: 'inputting',
                      actions: 'assignIndexChanged',
                    },
                  },
                },
              },

              initial: 'inputting',

              on: {
                backToAddPo: 'addPO',
              },
            },

            openModalChooseSph: {
              on: {
                addChoosenSph: "addPO"
              }
            }
          },

          initial: 'addPO',
        },

        openCamera: {},
      },

      initial: 'checkSavedPo',
    },
    {
      services: {
        getSavedPo: async () => {
          try {
            const savedPO = await bStorage.getItem(storageKey.savedPo);
            return savedPO;
          } catch (error) {
            console.log(error);
          }
        },
        GetSphList: async (context, event) => {
          console.log(event.value);
        },
      },
      guards: {
        isHasSavePo: (context, event) => {
          return event.data === undefined;
        },
        isPOProvidedByCustomers: (context, event) => {
          console.log('ini event', event.value);
          return event.value === 'yes';
        },
      },
      actions: {
        assignImages: assign((context, event) => {
          return {
            poImages: [...context.poImages, ...event.value],
          };
        }),
        assignDeleteImageByIndex: assign((context, event) => {
          const newPoImages = context.poImages.filter(
            (val: any, idx: number) => idx !== event.value
          );
          return {
            poImages: newPoImages,
          };
        }),
        assignValue: assign((context, event) => {
          return {
            sphNumber: event.value,
          };
        }),
        assignSearchQuery: assign((context, event) => {
          return {
            searchQuery: event.value,
          };
        }),
        assignIndexChanged: assign((context, event) => {
          return {
            sphCategories: context.routes[event.value].title,
          };
        }),
      },
    }
  );

export default POMachine;
