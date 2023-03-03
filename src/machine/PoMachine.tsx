import { bStorage } from '@/actions';
import { storageKey } from '@/constants';
import { CreatedSPHListResponse } from '@/interfaces/CreatePurchaseOrder';
import { LocalFileType } from '@/interfaces/LocalFileType';
import { customLog } from '@/utils/generalFunc';
import { assign, createMachine } from 'xstate';

const POMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EAJgAsAdkruAHAE5DAKwAzABsAYEhvu7uADQgAJ6IAIxJIZ7eSc4B7mEh3q5B7gC+RXGSOPhEpORUAGaC6LDaDNpgyJxQxAAqxAy0fBAtbWb2yFY2erz2TgiZhkGUQd7O7gG+oUnr3gFxiQghaZQZIUk5IYZJF4a+JWUYFTLV8vWNza3IlLgQEGwA8pwEXBSYRQBjIbAjJAgMbWWxTKEzKK7FzuQxecIXLJBIIXALeW7Q+7SKpyOoNJpDD5fH7-cgAGzArQAkgBbXAwSGWWGTaaIKIhLxBApBFLuXwrXy+ZH7U6LEI4yLRQwhVy+AIE8rE2Q1SgvCnvT7fP6cYRoZrgznQ8Zw3mzQzONFBNZBZxRdzOJLeFXSgIOyj+SXYsKolLq0qEqSVbXPclvNqGmmcakAWVIYFZ7LglphEzsCOSDoWSxWzpOWx2CUQ7k9i1SmzW0SiASSGqJUaeZNelMofSBODB2E4ACNcPQegBBI3EbPWnn5hCrbyUeb+ZwnYupZzS6to3wHTbnD0BVwpVuRx6k3Wx7u9qQDoS8M26XhQAFgPvYEEz7l50AzZxeosyzeIYrjeDiaqSrElb7PM-rBKc9rnJcARhnc54kjqepxh8t79uCD5PiCnDEMgYC8CCqYQLgdLfrm8J-i4gHFiBYEQWsSIwWKArbL4riuG43juEsqRng8mExl2Bp4dg96AsCL4DtwfACBoYgSG2F5Yde0nvneBHyTgIIDuoIjEFocJmHRNrzi6AquMqbiGKiYSXM4QQ+gE9kISEa7bDi7piVqHZXlJ8YyXJelGYp4IkbwADCeAvmA8U6GAnToIIWYmKMs6-o4TECixoHgdcHHQXsrjnMuhi1Wu2SpJEzhBe2l7YTeUWyQRpHkVRNGJcQVhgEpmB0kNfW0TlUI5jZjEIEK9muMEtXKmEqEFNutWUA58rKoUhQFGhEbidGnb6uFnX3j1vATQNQ1KdSd0ELwA7WXOc0ZJ4AFCl6SRgSk0ogQElAeucGRLXuAFHZqrU6n0mADJSHTEAAQqOdA9AAYjpwxTVy9G2r6gNJNtkq+H4vnOUkQQtVp8jw4j7zIz0XSfmQlJvflMyejWjnCsqhjePk3jSmkjp1mcVyXDc4Yw3TVAM7wgwGoIEAMpwqDIGNXxfnjVo-gxBWzOEvgg0KIpbAJHkwSqps5Ce9oeJKO20xJCv9Er3aa9rEDY+rnOG9zqFLn4gR4k6IqoRViCHiDKrXKqgR-e5runZQrMNMrbTI2jY69B7WfIAHto80ufPYgLQtgT6vgkwczZuK6TXNqnIUZ+zKtq2Ab4Mpg2hsOgxAQKgffF-OR6m9ieJrPX8qnKLvpxw5e7ZLX8rFLLmlu+nbOF5QyCD8Pfd9L3rQQJwY9ze5lyUKK1xC+KXnYqLoFePHoegaEqGt5e12pSyFBcBJm+BmGAsBL5GyJjBS4W08TIUCPxB0zkSjhl4EPOAowt6nVygbW0ABaQ4f0lqbGrD4QoFxpQEJqnVasmwtj+BCD-HUNB6BMFYD8YgOCCbzjwZsW+-FmxRFOOBEMrhpSZAckcT0TofD5ECG4Jh8gACiDgbBcNmkbJazhb61VWG4asS1p7iKWK4SgeQ8iqmPHiZyNNN4YTTu1d46j3pG1COI8CINVSSlXu5eUMt0InRCo4+M1I-jOK5skWqJMki+ldLXF0QR-BJG3DWY4Do8T5AAjkRRZ0cI9kuuCcJgdED5GlIUbRGJ7QrjOKqHJoVzq4QKdgQiqBtDPigEUkuLppSqiKtccUIEhQFEanU4JjSPyRQ-MZQp008rFIQOEBY3FtgxN8SVEIPohTbR8h4YRSTRk43GfpZp11brYEGgQAcnT5yoW0eTVEywrHuFVGIritd-TU2yHkL0bgvJ1MVoXa5c1qbukFMM2RztSkwWbKY+2ZVoioUiPiOxgTLwAu7KrBkQKjbJzRMJcFD8+JQr2OcHiHgCiC3CFiWxATgpooLl7LWxAvh+zANi7mYQFj8lVMsAo-FBYv0nuSl0pxpbQywW3XelJ2UuHtNo8C09PqfJ9LKNcDlgI4g2DS46dKdTtz3pitlszcHj2cmiBV2wlVOkFYsclbg+J8RyOK+xkrM7dgPkPEezQwCn0gDKhATlgaFnmEJYCYENk2xSEcYV9oXT5BFHUv+uAAHoFwP66mHj42RBxI3ZyEa9huVMY5LymTpGBBQUUIAA */
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
          context.choosenSphDataFromModal.sph[0].productsData.map((v, i) => {
            if (i === event.value) {
              return (v.isSelected = !v.isSelected);
            }
          });
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
