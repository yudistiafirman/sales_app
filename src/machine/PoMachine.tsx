import { bStorage } from '@/actions';
import { CompanyData } from '@/components/organism/BCommonCompanyList';
import { storageKey } from '@/constants';
import { customLog } from '@/utils/generalFunc';
import { assign, createMachine } from 'xstate';

const POMachine =
  /** @xstate-layout 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-TCXBffPiUK9jnB4h4Ao-NwhYkpjs-xtNUUGi9sQL4vswCYs5mEBY-JVTLAKPxfmz9J6kpdKcSWR1qZQyoDvSkrKXD2h0eBaeGRqxOh9LKNcDkvSnHcqEKpkrO4YuuTg8ezk0Tyu2IqimFYiXXEWKStwfE+I5FFZgtuLNd77yHiPZoYAT6QGlQgJyAQTbzHmEJYCSzhYpCOIK+0Lp8giiqb-XA-90C4D9XQhYcbIg4kbs5N5ew3Kwscl5ehMjAjIKKEAA */
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
            QuotationLetters: [
              {
                id: '1',
                number: 'SPH/BRIK/2022/11/00022',
                QuatationRequest: {
                  totalPrice: 45000000,
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
          console.log('ini event', event.value);
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
