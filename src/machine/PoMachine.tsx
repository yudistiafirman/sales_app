import { bStorage } from '@/actions';
import { CompanyData } from '@/components/organism/BCommonCompanyList';
import { storageKey } from '@/constants';
import { customLog } from '@/utils/generalFunc';
import { assign, createMachine } from 'xstate';

const POMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EAJgAsAdkruAHAE5DAGzuAKwB3s7urs7OADQgAJ6IAIzhlMEAzL5Z3h7p6YauAcEAvsVxkjj4RKTkVDT0TKwQHJy4EBAAkgC2uDCwZvbIVjZ6vPZOCAGxCYiu3t5pAemurr5JvgG+7ulJpeUYlTI18mC8AI6oguhgbADyACrxyGCcUMT3xABiV7DaDNpgZADJAgIbWWxjEETaLOSgBQxJYLuLKRNwrOKJBBJQrpOHOYK+YLOAKbKZ5Pagg7SapyKinC5XG4PJ4vN4fb7oX7-QH6JLmEFgkZ2KEuaJwhFIlFRFauDHJPK4pL4-zOdLOfxJdIBCkVamyWqUABmPz+AOQr3exAYtD4EG5QJMg2GEPGiGCwQW2OyfhWhj9vjlWKiAUovlW3mChWiyOcOqpVX18mNnNNgMobWat04BFwUmEUAYyGwwMs4NGroQkaSlHSwSS8LV0QC2O8gaVtZrRMKJPSfgCKzjUgTxyoya5ZvT7TurXaAFlSGBur04CXQc7yyLK9NMUkfLDDMiD4ZfBH0u5Y2VKUOjrSjSb7ZPM9wwAAbMAApcwVeCl2b7E7ShDG8eFnBSfEkXcQNfGJSg3EyXd6xCdZ3EHQ4aQNMdU2QR9p2ENA-iLb912FUAJmxSIvCSJICh2dZ1V8dJA3CXwvH8ZF5jrdx3Co1C9RHO8Uwfa1cxwQtsE4AAjXB6A+ABBKdiCIssSMcZJnEMWFMgPVVXB2E8AigokvFCJV60yLJQl44db0woSwBE7AxKEXh8N0XgoGzey83cpShUhUjEG2QwvGWXSQg05VZRmBAcmCLxdKAzJXAyEJvCsm8MPvCdhKkJy8NQbQ3I84hnl4fN5wgXAX1838AoQIKQpWM9ggigkop3QxezhVYz2PXc5jcdL0KTLK0xy0Si0oHNvILItuD4AQNDECR4wykbBOyryJuwKatuwfMxPUERiC0CEzBqjc6q44KQmRVxDFCTrvCSQN2NghLvG2eYmtcIbE1HUbsPGxzJumnADrmvgAGE8HcsAoZ0MA3nQQQV0dAViP81T6vyRqwpa6I2tehEvD8DY2OJMNfD+-jbM2hynJK04KqqmHiCsMAxM4TAXw5lnqvR0s-IrQ9WM2Yla2gj1t0QMNYXWKYIubJVdJpmzAcoYHGdK-m2Y5rmMz1gheDEi6VLI9TNIp5Y9OAts-VxfFlf7T61jWNWDWtTBbXtC0ACFpLodlAbNrGJm8PJKAjhElnxW6A2i7EjL8bw-Xcft1ObFDL11azPZtXg7TNC0PnufayHtUOK2o91KGS-E-XWSN1VbRPPuCoofHC5ZwnJHPVuGqgvZ9idBAgN9OFQZBebafMq83VOQzVLUaNVDiE53c9YRyFIGLCcy0v769B81gui7TKeZ4gb4J-nuq1g75qIi49TdxlrESW31xd61CPsg9+QZcrjn3NG8AOMkrRn0roLNcykw7JE1HFREu4UrATDM9NspIo6fXuikIo9ZIwAKoEAiuo9x4vAIG+TA2g2DoGIBAVA1C77Y0RB2UkdYaI5A3skN2oZ2xrC1M2JYh99jH3+pQEhIDKDIDoQw6h1oqEAggJwZhZFtjVgKAieYZ52LLDbFkRUUxv6amxJo3YFJeD0LgIMAe-0nRwIrAAWgMtFRxsJQIO17unLYvYthEIUEoRoqh7HC03FENsulSZZEJJ-DI-V-EAFEHA2BCbVbG4TooRlgmTeY0Qwzum2P4+klxrh3EeM8VJl1sZIgianOEEYfDkVyNqI+aFxF00BJU82sw6m1nrJ1GEzY5iBiJCGHwKJaxzHPEifxHTsIZjuF0+BQZa4tXug9cyQEXEdQiHCLYnVIwR2JBHWZGstZFiWRWIkCw+kNkGS2QMQzskTOiLpXJpyNpjT2nlFyBUiqXM3EiJedY7lNgedFL6gFshGMJuED544vkM1BntCG2AAX3zmJQFsGRAjNnCBgiF6d3r5ByFwk8nV4VYVPkinaTNeC62wOzAgYl0XY3QViuYOKSRgQJZiHxxlmygSWNEyyrS+K3jpQjLoFBcCsuhGqOu8JCTIRiVMtsfZALIk1MI3JBJ-HD0LvaOVgV1RpBBQ9DYoUI5tiRF-ZCVFtj3XSPqqBZC3zGpimKJEWoUgKnGdwj+8Iazf0+iCziB4XXe0NROS+xA2g3zAB6rinh3T9IJEsFY1q27qU7FReEJJM3nn8ZIo1GMHF-imXs-BnDVhtm8Xwtw+lHVkmLeXKRY93VltCXVREdZQyFBapEUIqxtjqqRHXFWGkSREmdWKvOgC20PhkfQxhfxXy0CUR63t1YwxFAPMlfsPj9FrAbfBQRZlD6lCAA */
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
        isProvidedByCustomers: true,
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

          on: {
            goToSecondStep: 'SecondStep',
          },
        },

        openCamera: {},

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
