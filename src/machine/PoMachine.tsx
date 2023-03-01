import { bStorage } from '@/actions';
import { CompanyData } from '@/components/organism/BCommonCompanyList';
import { storageKey } from '@/constants';
import { customLog } from '@/utils/generalFunc';
import { assign, createMachine } from 'xstate';

const POMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EAJgAsAdkruAHAE5DAKwAzABsAYEhvu7uADQgAJ6IAIxJIZ7eSc4B7mEh3q5B7gC+RXGSOPhEpORUAGaC6LDaDNpgyJxQxAAqxAy0fBAtbWb2yFY2erz2TgiZhkGUQd7O7gG+oUnr3gFxiQghaZQZIUk5IYZJF4a+JWUYFTLV8vWNza3IlLgQEGwA8pwEXBSYRQBjIbAjJAgMbWWxTKEzKK7FzuQxecIXLJBIIXALeW7Q+7SKpyOoNJpDD5fH7-cgAGzArQAkgBbXAwSGWWGTaaIKIhLxBApBFLuXwrXy+ZH7U6LEI4yLRQwhVy+AIE8rE2Q1SgvCnvT7fP6cYRoZrgznQ8Zw3mzQzONFBNZBZxRdzOJLeFXSgIOyj+SXYsKolLq0qEqSVbXPclvNqUPpAnBg7CcABGuHoPQAgkbiJaYRM7AjEKtvJR5v5nCclh6Qs5pe5Lv6Dptzh6Aq4UhqiVGnmTXpSE2Ak9gU0JeGbdLwoACR8CZwXrTySwhnF7FstvIZXN4cWrJbEEohzgs1SLUdWrgEw3dI49SbrY0PE1Jx6bUNpp7PiMgwLwQQAWWICBcDpJduWLUAZnXAVa23Xd9zWJFjwQMUBW2XxXFcNxvHcJZUh7e8SR1PU4w+V9k3BShAQXUFwW4PgBA0MQJF7B9SOfA1KLHajaJwEEU3UERiC0OEzAgot4WgxAXQFVxlTcQxUTCS5nCCH0Ank4JUmrbYcXdIiHhImNB24+cqOwGiLOwQSGL4ABhPAZzABydDATp0EEOBJJtVdYM3dcdz3a5kKPPZXHOCtDBi6tslSSJnCMrV+yfMz4x48df3-YDQLpJziCsMAU04TA6SK3KwN8lcZIQIV5NcYIYuVMIbwKRsYsoBT5WVQpCgKW8I2M6MB31DKbKyv9eEq-LsEKggSupAqit4FNqqgxxSzxCsgirGtll0xsTi6g4O127ZAiCZK+0fPpMAGSkOmIAAhTM6B6AAxLjhhMUZlw2mZfWlDIuslXw-HrZSkiu8NNRunU7oe94np6LpbLISl1ukzbZgyctFOFZVDG8fJvGlNJHVSU4DiuS4blh9iTKoRHeEGA1BAgBlOFQZByq+EEsdtJJwl8Sh1IKTYlhwjTUJVUWci7e0PElbrro4+QWbZ+Meb5iAvq5wXV2F7a-ECPEnRFG9wpPe0xZVa5VUCJJpbVpnKDRhotfaTpXqzXp+lZzHfqhQs-Nqz1PQretCfOEndx9XwkkoA4AkyHDfES1PXZG930a9oRObAOcGUwbQ2HQEDUFLw3ao7UXsTxNYU-lU5yd9O2FIz7JE-lYoGeInOPYxg1kAriAq+aMAS9aCBOBrnH1ObUVrhJ8UtOxcmdy8e3TZ3UIb2z1Lst4NyWQoXBOGpVl2R84OuSk20gdQy5Orxc5Lk7HCYr7u9htSsihzUmNNSYC6AwDXxgLAeeMw5gLFrKsdYJwtg7FQk2csIokFrGiFELOBJeAgTgKMRmI0-qQWxjMAAtJkaUFCBTNVigUbYOFohJX7n-R8NB6BMFYD8YgpCH6rhwtKFIBRFiZGyF6WmGdD6PgAKIOBsPwsOOMhHP1wkccRB1LhhHUjIzi6VkBKJqjjUIwi9xiwxKFHc9o1T4jYSlR8ACDRAN+EYgGyQYpJ2Fs4V0icXS7QuI2SOxwHR4nyOuHIejTJjQohNcEbjyGIHyNKQozhKCWJ8T452UQsJRNGuRYco53yTk-N+BJQsXTSlVHBa44ptxCglgcPJaUYmFLfHxGydlsDlNXOEBY6FtjeNCMFEIPohRdR0iqJsPh-BJGaU48aRTqLHxmstBa8SQ7-USQgPpXgM6DN9MM3cozUEihbPWFIeFUhdmaZrSkPTw6pMFBLHwfgsLJNQqnVw29uqBgOGqOZ9j4YawDvnDmDIHk42dn6fCLzV7vNcJvDCHgCjE3CFiGGv8HEI1BUOHWxAvj6zAJCmBYQzwK3Bm4BpxNN71xRS6U4dNBpw3VlQIeXsSUuHtGkvcjcMhNidD6WU1ZuoKSdInPczT2VDnBcSzZZDbQOlREcJ02x+XQxQXsc4dL3A4VVPqnIzLiGpWlSPMeE8+jT0gJytcCkAhi3mPMPCW5jnkxSEcel9oXT5BFM04+p9z42uhuYn1kQcRuCVScvYalvmKS0uEz0OIwwlCAA */
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
        poImages: [{ photo: null }],
        openCamera: false,
        sphNumber: '',
        searchQuery: '',
        sphCategories: '',
        choosenSphDataFromList: {} as CompanyData,
        choosenSphDataFromModal: {} as CompanyData,
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
          console.log('ini event',event.value)
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
