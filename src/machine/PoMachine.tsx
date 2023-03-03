import { bStorage } from '@/actions';
import { storageKey } from '@/constants';
import {
  CreatedSPHListResponse,
  QuotationRequests,
} from '@/interfaces/CreatePurchaseOrder';
import { LocalFileType } from '@/interfaces/LocalFileType';
import { customLog } from '@/utils/generalFunc';
import { assign, createMachine } from 'xstate';

const POMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EAJgAsAdkruAHAE5DAGwAzAEAjACsPhHOADQgAJ6IoW4BlN7JrpHhbpmuAL55cZI4+ESk5FQAZoLosNoM2mDInFDEACrEDLR8EA1NZvbIVjZ6vPZOCMmhQZRB3s7u4a4BhqHec3GJCO7OvpRLvuFBrq5BR0FzBUUYJTLl8tW19Y3IlLgQEGwA8pwEuFLCKAMZDYAZIEBDay2Mbgia+dybRBBXaUNy+dHzILwiKLK4Qm7SMpyKo1Op9V7vT4-cgAGzAjQAkgBbXAwMGWKGjcaIXzeVLuY5BdxrbKnYWIhABdx7Qy+YLOAJy5J8gJ44qE2QVSiPMkvN4fb6cYRoeog9kQ4bQ7mTQxBQyzcK+ELePlOhVBCXheaUAKnZzhRVO7zhNZqgmlTUPUnPJr6qmcSkAWVIYGZrLg5shIzssKSzmms3mi2Wq3W3glPnthlcvg8QtCAUbRzDUgj9xJT3JlC6-xwwOwnAARrh6B0AIIG4iZy1c3PbL2UW2+UKGbzuGtzCIVxWUZYrVzpULL4Mt25ErU6mOvHtSftCXgm3S8KC-MC97CA6ecnOgCbOPmFv+EThKufjARKjbOLuRyrochyhKcp4au22rRl2N59iC96PoCnDEMgYC8ICyYQLgNJftmMK-i4AFzEB4QgS6y4MRKwbhA6QZBCujqGIESFtsSqGdnqGHYHefwAs+-bcHwAgaGIEjhncgmXuhb63lhEk4IC-bqCIxBaNCZgUVac7IqkriBCk0q7AeHoJIgYSuJQhxcas7i2o2Db8cpF5oSJ6mYdglBaR+UkgnhvAAMJ4M+YBRToYCtOgggZiYgwzj+jg0akdHpAxoHMeEnprLu6KHDWB7-gsPnnlGwmxqJd74YRJFkTFxBWGA0mYDSXVteR6XglmpnUQgxwWZkdrBq4CGLL4FYLv4YSOgG-pRLVkYdrqjWBWJWEtbwA0dV10mUidBC8P2JmzmNizeIuWIrmuG75axR4uV5lnwr61bOJtKFdJgPTki0xAAEIjnQHQAGL+f0Q0cpR1rZO9+y8YY-rLGsAq7ADglAyDLxgx0bQfmQ5I3VlEyow5kxSs5fInN4mTpGELP41qhO8L0eqCBAdKcKgyB9e8n6Ixa35UdlkwhnsziCjscGBAhFahKEZXruz8wNurnPyNzvOxsLosQHDgtU9LEwRAED1+IE0qY8s3jVhBwQufCdbog76L61QZM1EbzStJDo6dN0POUxLI23TLASxHTERyqi0yWQGDaGI6+SFPira+fIAcU3zAtgK+dKYNobDoMQECoBXlvWpZMwLIKYT5mu0oSg2AZpMkcy+siyyITn6oCVqhdB5QyDV7XFddOXjQQJwDdzgxzmZx4tohMuy4IonKx7FxCu8kssrrH7lCHQlTIULgCYfGmMCwCvY201sK7SvswbHrB7P-XivAa5wEGEpOq6AMpS2tAAWmSBKKB7FyqIKQbyVUI9QFbQUEoJgrBPjEAgcjOcrgE7v2cKQ2YGQYICguJEC+ABRBwNh8GjRlm-FwqxUQgS3jWAIIZZT-2uHnMBQkdrICYbHCYIQJRuA1uudEOx3AKJZikC+qk9SUm+GI6mSRVga2iFxJYRw9yhArC7fYG45S+H-DsCIKj4bXj2v2TRVtEAswlKcDWGNeLx3XGcC4tiGr2PfHeY0qBtBPigE4600xiGIDXmkM+XpeQrksb4fxIjuwOM0ntHSIJImr1tF4OUfhqFs3hHvLYjooKuUzi6L0kRvJoMERg1Ru0gkHQIkdGu7VsCdQII44amVnEIBAjMaUtsnRnFKQois-hdxeTRIYYU-5UmNLPBgw25I8ljWmN6AURDFg8MWW4GJwz3AWU9gebILpAioIEWswGEdJ78zpFsmWCE7ReGOAsAMIEdhELdg9L0q58wgSdKEC+Gy9Qm2IO8c2YBXnW0bDMH69SMhHlrBBYUi4XYKNtKEPZuJVnIUEhPTZAzIFzgVPyPZli5i1n-K4Lu2QNbpByCgjyRxbm53uSS8mTyS4IqRAhLwNKFZ+CIa4-eBY-ABlrHyM5vyL6kr1NPGudd6hgAXpAQVkoayUAQosms1ZMi8kZVK3KhwtaZyVMiC+V9cA33QLgHV0wnRpFOPKHY-pFldxufseOB4nLf1XAUAoQA */
  createMachine(
    {
      id: 'purchase order',
      predictableActionArguments: true,
      tsTypes: {} as import('./PoMachine.typegen').Typegen0,
      schema: {
        events: {} as
          | { type: 'getSavedPo'; data: Record<string, string> }
          | { type: 'goToFirstStep'; value: string }
          | { type: 'addImages'; value: LocalFileType }
          | { type: 'deleteImage'; value: number }
          | { type: 'inputSph'; value: string }
          | { type: 'addMoreImages' }
          | { type: 'searchingSph' }
          | { type: 'backToAddPo' }
          | { type: 'searching'; value: string }
          | { type: 'onChangeCategories'; value: number }
          | { type: 'openingModal'; value: CreatedSPHListResponse }
          | { type: 'addChoosenSph'; value: CreatedSPHListResponse }
          | { type: 'closeModal' }
          | { type: 'goToSecondStep' }
          | { type: 'goBackToFirstStep' }
          | { type: 'goToThirdStep' }
          | { type: 'goBackToSecondStep' }
          | {
              type: 'uploading';
              paymentType: string;
              fileType: string;
              value: any;
            }
          | { type: 'selectProduct'; value: number },
      },
      context: {
        poImages: [] as LocalFileType[],
        openCamera: false,
        sphNumber: '',
        searchQuery: '',
        sphCategories: '',
        choosenSphDataFromList: {} as CreatedSPHListResponse,
        choosenSphDataFromModal: {} as CreatedSPHListResponse,
        isModalChooseSphVisible: false,
        selectedProducts: [],
        files: {
          credit: {
            ktpDirektur: {
              isLoading: false,
              value: '',
              errorMessage: '',
            },
            skKemenkumham: {
              isLoading: false,
              value: '',
              errorMessage: '',
            },
            aktaPendirian: {
              isLoading: false,
              value: '',
              errorMessage: '',
            },
            nibPerushaan: {
              isLoading: false,
              value: '',
              errorMessage: '',
            },
            npwpDirektur: {
              isLoading: false,
              value: '',
              errorMessage: '',
            },
            suratKuasa: {
              isLoading: false,
              value: '',
              errorMessage: '',
            },
            bankGuarantee: {
              isLoading: false,
              value: '',
              errorMessage: '',
            },
            perjanjian: {
              isLoading: false,
              value: '',
              errorMessage: '',
            },
          },
          cbd: {
            fotoNpwp: {
              isLoading: false,
              value: '',
              errorMessage: '',
            },
            fotoKtp: {
              isLoading: false,
              value: '',
              errorMessage: '',
            },
          },
        },
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
            id: '1',
            name: 'PT Guna Mandiri',
            ShippingAddress: {
              id: '1',
              Postal: {
                City: {
                  name: 'Grogol',
                },
              },
              CityName: 'Grogol Kaler',
            },
            QuotationRequest: [
              {
                id: '1',
                totalPrice: 4500000,
                QuotationLetter: {
                  number: 'SPH/BRIK/2022/11/00022',
                },
                RequestedProducts: [
                  {
                    id: '1',
                    offeringPrice: 3400000,
                    quantity: 2,
                    Product: {
                      name: 'KBO',
                      unit: 'm3',
                    },
                  },
                ],
              },
              {
                id: '2',
                totalPrice: 50000000,
                QuotationLetter: {
                  number: 'SPH/BRIK/2023/02/00022',
                },
                RequestedProducts: [
                  {
                    id: '2',
                    offeringPrice: 7600000,
                    quantity: 3,
                    Product: {
                      name: 'K-100',
                      unit: 'm3',
                    },
                  },
                  {
                    id: '3',
                    offeringPrice: 7600000,
                    quantity: 5,
                    Product: {
                      name: 'K-300',
                      unit: 'm3',
                    },
                  },
                ],
              },
            ],
          },
          {
            id: '2',
            name: 'PDI Perjuangan',
            ShippingAddress: {
              id: '2',
              Postal: {
                City: {
                  name: 'Cimahi',
                },
              },
              CityName: 'Cimahi Wetan',
            },
            QuotationRequest: [
              {
                id: '3',
                totalPrice: 45000000,
                QuotationLetter: {
                  number: 'SPH/BRIK/2025/11/00022',
                },
                RequestedProducts: [
                  {
                    id: '3',
                    offeringPrice: 3400000,
                    quantity: 2,
                    Product: {
                      name: 'K-200',
                      unit: 'm3',
                    },
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
              target: 'openCamera',
              cond: 'isHasSavePo',
            },
          },
        },

        Exit: {},

        firstStep: {
          initial: 'addPO',
          states: {
            addPO: {
              on: {
                searchingSph: 'SearchSph',

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

                addMoreImages: '#purchase order.openCamera',
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

          on: {
            goToSecondStep: 'SecondStep',
          },
        },

        SecondStep: {
          states: {
            idle: {
              on: {
                uploading: {
                  target: 'uploadFile',
                  actions: 'assignFiles',
                },
              },
            },

            uploadFile: {
              always: 'idle',
            },
          },

          initial: 'idle',

          on: {
            goBackToFirstStep: 'firstStep',
            goToThirdStep: 'ThirdStep',
          },
        },

        ThirdStep: {
          on: {
            goBackToSecondStep: 'SecondStep',
          },

          states: {
            idle: {
              on: {
                selectProduct: {
                  target: 'productSelected',
                  actions: 'setSelectedChoosenProduct',
                },
              },
            },
            productSelected: {
              always: 'idle',
            },
          },

          initial: 'idle',
        },

        openCamera: {
          on: {
            addImages: {
              target: 'firstStep.addPO',
              actions: 'assignImages',
            },
          },

          entry: 'enableCameraScreen',
          exit: 'disableCameraScreen',
        },
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
            customLog(error);
          }
        },
        GetSphList: async (context, event) => {
          customLog(event.value);
        },
      },
      guards: {
        isHasSavePo: (context, event) => {
          return event.data === undefined;
        },
      },
      actions: {
        enableCameraScreen: assign(() => {
          return {
            openCamera: true,
          };
        }),
        disableCameraScreen: assign(() => {
          return {
            openCamera: false,
          };
        }),
        assignImages: assign((context, event) => {
          return {
            openCamera: false,
            poImages: [...context.poImages, event.value],
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
        setSelectedChoosenProduct: assign((context, event) => {
          const selected = [];
          selected.push(event.value);
          // const newSelectedProducts =
          //   context.choosenSphDataFromModal.QuotationRequest[0].RequestedProducts.find(
          //     (v, i) => i === event.value
          //   );

          // console.log(newSelectedProducts);

          // return {
          //   selectedProducts: [{ ...newSelectedProducts }],
          // };
        }),
        assignFiles: assign((context, event) => {
          return {
            files: {
              ...context.files,
              [event.paymentType]: {
                ...context.files[event.paymentType],
                [event.fileType]: {
                  ...context.files[event.paymentType][event.fileType],
                  value: event.value,
                },
              },
            },
          };
        }),
      },
    }
  );

export default POMachine;
