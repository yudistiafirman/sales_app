import { bStorage } from '@/actions';
import { CompanyData } from '@/components/organism/BCommonCompanyList';
import { storageKey } from '@/constants';
import { assign, createMachine } from 'xstate';

const POMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EAJgAsAdkruAHAE5D7u4AzACsAGwhhiFBzgA0IACeiACM3s6U0b5Z3u6GycFBQa4AvsXxkjj4RKTkVDT0TKwQHJy4EBAAkgC2uDCwZvbIVjZ6vPZOCGHpQb6uIa6GYaEhzr5B7vFJk8mulIXOyYthAUHJISGl5RiVMjXyYLwAjqiC6GBsAPIAKgnIYJxQYhfYgAMVesG0DG0YGQAyQICG1lsY3hE2c6MoxzOYVy3hWgSimxSzhxXmSU1cbnJhmclwR12k1TkVAez1e72+v3+gOBYPQEKhMP0yXM8MRIzsqJcGKx4Vx+NyISJCDxIT2aV86JCOx2lLpFUZslqlAAZuDIdDkJQ2s0PpwCLgpMIoAxkNg4ZYkaNxoh3EtKIZA4GfIVDt4gsrgrslqtnKdks53PlvPqGVUjfIzfyLTDre1Pq12gBZUhgbq9OAehHDZE+hArZVnBaUA4UhOpHIxVNSdN3KhZgWWvO27hgAA2YGh5ZgVfFtalkzCyQDSZWQQiyUOS+VIV8nlxzkyeXJJO7NyZxoHOatNoLwjQkLds5r3oXFMoe4i2u8YRxEcSiDRIYlDeIcga+NqMw4rSZT0j2tzMqa5qClaDBgI6OCutgnAAEa4PQwIAIL5sQz5epKoATD4ngQfGhgaoUeLKmkaquL+ByFPRrjZGehp9kh2YoZQaEYdgWFCLwD66LwUD2uhToyWREoopRKSGGsK6zPkhRrj4yprMBOIRHkrihOiSy8b2iFXkJIlSOJ96oNo0mycQfy8M6JYQLgY5KfOqkIBBvggTMzg5Lu7izGE3j6Ri5K+N4P7OFEe45JZCGXshQ52ZhbqUA6Ckum63B8AIGhiBIaYZZmWW5jlYl5QVODOlh6giMQWjImYfmvgFyQxOkmo0gsQSGK4oHRbFwGJYcIThgsOI-ulF41YJ2Xybl2D5Rt2AtcVfAAMJ4DJYAHToYCAuggiViYgwvhRjhqaBAbJeGhyvd4ASRtxLZsWEmprNqgRhMtGb9rVqE7eJbkPF5PlHcQVhgFhnCYGOSNw75t1ivdKmPYFAQBku0SbuSIS5GEkZFJiMS+IcbGuAmfqg-xNnraJ0PuZjCNIyjNo8wQvBYT1D0TOcwW+F+4R4gcXHMec6qxrNYVhHMpSwbwxDkPAYpVSt6B3eReMTAAtJTAEICb6Sy3kEFjWNKzeGxLOIfUyhNBwhvKXWlKNqZXh+FkUWBEELvGgAog4Nhe-5+O+xbeItoH7jzNFCWRWH9xPC8byfD8fwx71+P5NG0VhingYzA2Fs7HklCbpLaxFHNcYlLBBpWZla0woXouAZuH5S9FKxhq4yquP7o1B+EMb2yD7d62DAmDrmt4fL3xuARBXj-SsG6JYeMUW+4YVklMUxuH9ByZ+D3eQxzbob3WeLBYsZzxmTFPKqrnj9WFktLkKKrNuVx4L62XteYSUM8qOWcs6J+C53q-x8GNXIjNxpxATtTGaUQZjAzmiAuC54l5szqtAraTVdoySwggvqYVlzJQBosUyksnbMQHkEUCURQLpypDfCBtlyGUBhrwbm2BEYEBoTjI2dYkH1xQR4MaOw0iNlJvXVYUwaQzHXMEfhIizpdAoLgWh+M4zpDYupaIqtOEJnoo2CIuxWxuFVqkOmUR1bFCAA */
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
          | { type: 'onChangeCategories'; value: number }
          | { type: 'openingModal'; value: CompanyData }
          | { type: 'addChoosenSph'; value: CompanyData }
          | { type: 'closeModal' },
      },
      context: {
        poImages: [{ photo: null }],
        isProvidedByCustomers: true,
        sphNumber: '',
        searchQuery: '',
        sphCategories: '',
        choosenSphDataFromList: {} as CompanyData,
        choosenSphDataFromModal: {} as CompanyData,
        isModalChooseSphVisible: false,
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
                productsData: [
                  {
                    name: 'BETON K 250 FA',
                    volume: 28,
                    pricePerVol: 1700000,
                    totalPrice: 58000000,
                  },
                  {
                    name: 'BETON K 100 NFA',
                    volume: 29,
                    pricePerVol: 1600000,
                    totalPrice: 58000000,
                  },
                ],
              },
              {
                no: 'SPH/BRIK/2021/19/0022',
                totalPrice: 5100000,
                productsData: [
                  {
                    name: 'BETON K 250 FA',
                    volume: 28,
                    pricePerVol: 1700000,
                    totalPrice: 58000000,
                  },
                  {
                    name: 'BETON K 100 NFA',
                    volume: 29,
                    pricePerVol: 1600000,
                    totalPrice: 58000000,
                  },
                  {
                    name: 'BETON K BO FA',
                    volume: 28,
                    pricePerVol: 1700000,
                    totalPrice: 58000000,
                  },
                ],
              },
              {
                no: 'SPH/BRIK/2022/11/0021',
                totalPrice: 5000000,
                productsData: [
                  {
                    name: 'BETON K 250 FA',
                    volume: 28,
                    pricePerVol: 1700000,
                    totalPrice: 58000000,
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
                productsData: [
                  {
                    name: 'BETON K 250 FA',
                    volume: 28,
                    pricePerVol: 1700000,
                    totalPrice: 58000000,
                  },
                ],
              },
            ],
          },
          {
            name: 'PDI Perjuangan',
            location: 'Cab Bandung Barat',
            paymentType: 'CREDIT',
            sph: [
              {
                no: 'SPH/BRIK/2022/11/0021',
                totalPrice: 5000000,
                productsData: [
                  {
                    name: 'BETON K 250 FA',
                    volume: 28,
                    pricePerVol: 1700000,
                    totalPrice: 58000000,
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
                actions: 'assignPoType',
              },
              {
                target: 'firstStep.addPO',
                actions: 'assignPoType',
              },
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

                    openingModal: {
                      target: 'openModalChooseSph',
                      actions: 'triggerModal',
                    },
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

                openModalChooseSph: {
                  on: {
                    closeModal: {
                      target: 'inputting',
                      actions: 'closingModal',
                    },

                    addChoosenSph: {
                      target: '#purchase order.firstStep.addPO',
                      actions: 'closeModalSph',
                    },
                  },
                },
              },

              initial: 'inputting',

              on: {
                backToAddPo: 'addPO',
              },
            },
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
        triggerModal: assign((context, event) => {
          return {
            isModalChooseSphVisible: true,
            choosenSphDataFromList: event.value,
          };
        }),
        closeModalSph: assign((context, event) => {
          return {
            isModalChooseSphVisible: false,
            choosenSphDataFromModal: event.value,
          };
        }),
        closingModal: assign((context, event) => {
          return {
            isModalChooseSphVisible: false,
          };
        }),
        assignPoType: assign((context, event) => {
          const isProvidedByCustomers = event.value === 'yes';
          return {
            isProvidedByCustomers: isProvidedByCustomers,
          };
        }),
      },
    }
  );

export default POMachine;
