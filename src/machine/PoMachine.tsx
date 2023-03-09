import { bStorage } from '@/actions';
import {
  getCreatedSphDocuments,
  getSphByProject,
} from '@/actions/OrderActions';
import {
  CreatedSPHListResponse,
  DocumentsData,
  ProjectDocs,
} from '@/interfaces/CreatePurchaseOrder';
import { LocalFileType } from '@/interfaces/LocalFileType';
import { PO } from '@/navigation/ScreenNames';
import { customLog } from '@/utils/generalFunc';
import { assign, createMachine } from 'xstate';

const purchaseOrderInitialState = {
  poImages: [] as LocalFileType[],
  openCamera: false,
  poNumber: '',
  searchQuery: '',
  sphCategories: '',
  choosenSphDataFromList: {} as CreatedSPHListResponse,
  choosenSphDataFromModal: {} as CreatedSPHListResponse,
  isModalChooseSphVisible: false,
  isModalContinuePo: false,
  loadingSphData: false,
  loadingDocument: true,
  errorGettingSphMessage: '',
  errorGettingDocMessage: '',
  selectedProducts: [],
  files: [] as any[],
  routes: [],
  sphData: [],
  paymentType: '',
  currentStep: 0,
};

const POMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EAJgAsAdkruAHN4Cc7n4AjAF+hu5BADQgAJ6I-pSuQQBsye4AzEFB6a7p7slBAL6F0ZI4+ESk5FQ09EysEBzcfAIaYhIY5TJV8rXKDRzqIsRatrxm+kHmSCDIVjZ6vPZOCG6ePv6BIYHhUbGIId7plMmGKYZh3uHu7sWlndKVclQAZoLosNoM2mDIlLgQRoAeU4BFwUmEUAYyGwZnsc2sY2WiHShmcXl8oW2YQi0TiCD8hMomTc3gArLkCmTvHdZg8KrJqpQ3h8vj8-gDgdwwAAbMA-ACSAFtcDA4TMEQs7DMVkFvEFPP5DAU3ClQsk8QdnAFKFl3M5Ua4yVk-DSSnSpAyeq93p9vr9-oC2CDhGgvjDxZZEYtkQg5QVKMayac-BT3MbDK5NX7nIZDCdkklnEFnGlU4YybSyo9GfIWXb2Y6uZyALKkMDC0VwT2zeZImUuSOuQPpMJkwzpVHkzLRoKuSOJbzuOPJfym1LJLP07rPZm2tkOznOzhQYgAFWIDFofAg9uQNcl9dAK1jrmbZNbGY7XYve3xKt17jPFNcyT8r-SU8tM6Z+YXfy3cEcGhbBOAAI1wegNwAQSdYgDzrH0Gz9ak-F1UN0mcZwyRuNJlV7dIh0HYcM2HPJCK-Lonl-ec90oQCpBAoReDdXReCgThiGQMBeEhMsIFwHkEO9aVj0QQlFWcK5gnSZJZL8VICKuQM-DybxR3IslCUonNrTnVk6IY4CYWY1jIVBMAgOwSFhKlJZkIkyhvCki5sjkt9FP2P0PE8SNRwUtEUwCTNzWzK1Zz-QzLMYkywQhdiQOafhmNEcRKDCn881owsjOwJi4pwSEQKGTQdEWCYTHhRDRMcRAcPRZNDCualOwKPJew8Zs-GTdTsIiC8Ox08KaIMnLouM7BKAK6yEphTgKHQUh0p5HQXlIIV0unaistGh1cvy8aZqhGESpGMqDBMWyj1qhB6soRrmqOWTsncXspLJSgzmDSltVSYMhsym1doAw6Dqsoq5r4ABhPB2LAKGdDAVd0EEatKolar7LE279XuoImozJ62teryXu8RJR3DTshy01MAe2oGCz20GTK4nj+MEmHiCsMBEswHkeY5oT0a9OzfT1TxTiCYM4zcM5wje7xmz7ZUTWw98ilCrbc0Z-96JZya2d4IWuZ5xLOVNgheBAq6kOx6WEhCC8sJw-Jhw1Unck8U0SO67qUzyemdf0pmQassGpAANUE1AwAAGWIAFIE4BxPkR-4Xh+dAAApUUMABKTgMoZkO9f22LDujnlY4TpOIFtmrZUOQNXyHcIkjfPxe0TeMU3bdItPDcNwiDvTIrG8OTIW0gAHF+TY47sDjwRPk4dB+XQGI5+0BeQOXz4G6xm7qXRJUpZyUMSfxLJfEDZJsK++UfdcUfZy3TAdz3FdiAAIUgugNwADFsq-EPr6U855Lz9xvD2LyPhfLkmCImbqZIyTalfkyd+n92Tfw3GuayZA9xgOQqiVMTlTSvlTDkdsUYvLtnjFhbIUluzJDDLcLW34S5YN4LuQsMAd4Q2wAAERGKgIUPFtCwCSq0YYaVi7B24bwh0-Dd4whEZgMREjYCnVGOVS6ItawiSPieNB8Ybg5C9kgxM0Z2xoTSApZw+RThHFjOw+4nCFHbh4XRFRgj1GaN4JI+a6BFpUGQCtbQa10AbXkXpRRPj55+NEeIwJ2i2i6IuqYAxh47Y3WwrGLwGQzx5CsbQ+8F4TiYSuGkHI99JwcKop4j+3icpqOSRI2u5AICcFQOExOEAbLZMxuA6pupkx9giO+HCHZoxe0SLeK8BpXymgwfIeJhZp7oG3gvfxKSgnr20JvbZkJdkSOIdjbCuRHwKUCEs-I6RoynGOEwq4mRKH9k1u4xpel8HvCUcgb+f8oKbi8f885N0FJdVOPqOSeRlSjmjC7e6qZgz+EpBmZwqyqC-MIYWQQEA+QWT5JgbQbBFoQFQCS8FKxMJkLIm5OSOElYe3xCiygGEsikmdmET8DTdKzhxf8oQBKwCcV4DDXAcMACKqBJW6G0DEalKI3BoWmYRD8WFUhXwOG+QMcY4ydjOK2FMmK+XDXkEbBG4j0C4E4JySsMBYBKtWDhDEmxgihF2L2eUH1WxK3MaQ5M9Svn8qZNIeoqhcEguaf8wBi0hQRvrkMoxvoSLsqVgqJ8zkgplLqtLLwyYSSuGTD4M8WLKDhpUI0Lgq48EENjfGxNzq00UMza4bN2pc0IHlIkQkEkPVOOVOWytAwuCYHXojAAcmAAA7hwZ1IQ3AtjbNeJqt5ewZHIZhQiss0EyWKOaXgxByDwAlNra0VUU3IQALQssQLez6+rsj+C1cOcM5a+iJo4JesWyFi29jRLqXIBoChHHfJkNxFpvkRRAcgH910TxJDdViT1uIvLBCCE5FMHh8ZKzQSkct49FxOiBPB3JsolbohvK80MwZ74EVNIGMirZGXZBwoR2D+tJ7YDI43FwCQNgoZ2Gh6++NMPKlJPqVEA9PlQdDTtUOXGYqTVdKgAR7FePGPiJ2dlCo+zjI7ArT2CRExKw8P7AIb4OPAyUxNKah1BGad9J2dYmItiobvAcak3sWo4XcsqF+ZrAalyitxygRsTbYG5gQECTnkLZByOy28WRlTBjYwx8m7aSJqoyGaEN5rdaheU-ZqyVca79MgHF+2nYurJfxqwtqZJu6ZE+kkYcBpMg5HyNZxT5dJqbOObNJeK9tBVZuj4OxKqjijnbO2TzfpUSYf7L4e+PhpPqXLes34Y2Tw9XIarWMiZchdovklkkI4rgjyC1w0FCT1OL1OaknbLhUzJH2yqALx2bGogxCmTlNxHEUWu007Be02kaL2Z0yrGMr0XJuAw+hKZpIfLvbdQi7KJP6fbuEEK+Xgtbb+ANxJ7FHuSOe6seH91EcuXfGcVHBRMMRGJtcOSPhy2Cr3OTiD5N6WyUZaW1HzlH2yzlNkVwoYPDs-rXRfFfIueol9epKmbhcjdWjLJTw-Z75BrfK9xM5bLW4GtbgcnWEl19tNLT004RvDesA3kfupo5s3Fx3JgrFb8BfuIOT1BnggzAYKKGPTvYsjElUkspIkfMIhWKEAA */
  createMachine(
    {
      id: 'purchase order',
      predictableActionArguments: true,
      tsTypes: {} as import('./PoMachine.typegen').Typegen0,
      schema: {
        services: {} as {
          GetSphList: {
            data: CreatedSPHListResponse[];
          };
          getSphDocument: {
            data: DocumentsData;
          };
        },
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
              idx: number;
              value: any;
            }
          | { type: 'selectProduct'; value: number }
          | { type: 'onChangeQuantity'; value: string; index: number }
          | { type: 'retryGettingSphList' }
          | { type: 'retryGettingDocument' }
          | { type: 'gettingBackDocuments' },
      },
      context: purchaseOrderInitialState,
      states: {
        checkSavedPo: {
          invoke: {
            src: 'getSavedPo',

            onDone: [
              {
                target: 'hasSavedPo',
                cond: 'hasSavedPo',
                actions: 'enableModalContinuePo',
              },
              'openCamera',
            ],
          },
        },

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

                goToSecondStep: {
                  target: '#purchase order.SecondStep.gettingSphDocuments',
                  actions: 'increaseStep',
                },
              },
            },

            SearchSph: {
              states: {
                inputting: {
                  on: {
                    openingModal: {
                      target: 'openModalChooseSph',
                      actions: 'triggerModal',
                    },

                    searching: {
                      target: 'searchValueLoaded',
                      actions: 'assignSearchQuery',
                      cond: 'searchValueLengthAccepted',
                    },
                  },
                },

                searchingSph: {
                  invoke: {
                    src: 'GetSphList',

                    onDone: {
                      target: 'inputting',
                      actions: 'assignSphData',
                    },

                    onError: {
                      target: 'errorGettingSphList',
                      actions: 'handleError',
                    },
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

                searchValueLoaded: {
                  after: {
                    '300': 'searchingSph',
                  },
                },

                errorGettingSphList: {
                  on: {
                    retryGettingSphList: {
                      target: 'searchingSph',
                      actions: 'handleRetry',
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
        },

        SecondStep: {
          states: {
            gettingSphDocuments: {
              invoke: {
                src: 'getSphDocument',
                onDone: {
                  target: 'SphDocumentLoaded',
                  actions: 'assignDocument',
                },
                onError: {
                  target: 'errorGettingDocuments',
                  actions: 'handleErrorGettingDocument',
                },
              },
            },

            SphDocumentLoaded: {
              on: {
                uploading: {
                  target: 'SphDocumentLoaded',
                  actions: 'assignFiles',
                  internal: true,
                },
              },
            },

            errorGettingDocuments: {
              on: {
                retryGettingDocument: 'gettingSphDocuments',
              },
            },
          },

          initial: 'gettingSphDocuments',

          on: {
            goBackToFirstStep: {
              target: 'firstStep',
              actions: 'decreaseStep',
            },
            goToThirdStep: {
              target: 'ThirdStep',
              actions: 'increaseStep',
            },
          },
        },

        ThirdStep: {
          on: {
            goBackToSecondStep: {
              target: 'SecondStep',
              actions: 'decreaseStep',
            },
          },

          states: {
            idle: {
              on: {
                selectProduct: {
                  target: 'idle',
                  actions: 'setSelectedChoosenProduct',
                  internal: true,
                },

                onChangeQuantity: {
                  target: 'idle',
                  internal: true,
                  actions: 'assignNewQuantity',
                },
              },
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

        hasSavedPo: {
          on: {
            goToSecondStepFromSaved: {
              target: 'SecondStep.gettingSphDocuments',
              actions: 'setNewStep',
            },

            goToThirdStepFromSaved: {
              target: 'ThirdStep',
              actions: 'setNewStep',
            },

            createNewPo: {
              target: 'openCamera',
              actions: 'resetPoState',
            },
          },
        },
      },

      initial: 'checkSavedPo',
    },
    {
      services: {
        getSavedPo: async () => {
          try {
            const savedPO = await bStorage.getItem(PO);
            return savedPO;
          } catch (error) {
            customLog(error);
          }
        },
        GetSphList: async (context) => {
          try {
            const response = await getSphByProject(context.searchQuery);
            return response.data.data;
          } catch (error) {
            throw new Error(error);
          }
        },
        getSphDocument: async (context) => {
          try {
            const sphId =
              context.choosenSphDataFromModal.QuotationRequests[0]
                .QuotationLetter.id;
            const response = await getCreatedSphDocuments(sphId);
            return response.data.data;
          } catch (error) {
            throw new Error(error);
          }
        },
      },
      guards: {
        hasSavedPo: (_context, event) => {
          return event.data !== undefined;
        },
        searchValueLengthAccepted: (_context, event) => {
          return event.value.length > 2;
        },
      },
      actions: {
        resetPoState: assign(() => {
          return purchaseOrderInitialState;
        }),
        enableCameraScreen: assign(() => {
          return {
            openCamera: true,
          };
        }),
        enableModalContinuePo: assign((context, event) => {
          const { poContext } = event.data;
          const newPoContext = { ...poContext, isModalContinuePo: true };
          return newPoContext;
        }),
        increaseStep: assign((context, _event) => {
          return {
            currentStep: context.currentStep + 1,
          };
        }),
        decreaseStep: assign((context, _event) => {
          return {
            currentStep: context.currentStep - 1,
          };
        }),
        setNewStep: assign((context) => {
          const newStep = context.currentStep === 0 ? 1 : 2;
          return {
            isModalContinuePo: false,
            currentStep: newStep,
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
            (_val: any, idx: number) => idx !== event.value
          );
          return {
            poImages: newPoImages,
          };
        }),
        assignValue: assign((_context, event) => {
          return {
            poNumber: event.value,
          };
        }),
        assignSearchQuery: assign((_context, event) => {
          return {
            searchQuery: event.value,
            loadingSphData: true,
          };
        }),
        assignSphData: assign((_context, event) => {
          return {
            routes: [
              {
                key: 'first',
                title: 'Perusahaan',
                totalItems: event.data.length,
                chipPosition: 'right',
              },
            ],
            sphData: event.data,
            loadingSphData: false,
          };
        }),
        assignDocument: assign((_context, event) => {
          const requiredFileInput =
            event.data?.QuotationRequest?.ProjectDocs?.map(
              (val: ProjectDocs) => {
                return {
                  projectDocId: val?.projectDocId,
                  documentId: val?.Document?.id,
                  label: val?.Document?.name,
                  isRequired: val?.Document?.isRequiredPo,
                  type: 'fileInput',
                  value: val?.File,
                  disabledFileInput: val?.File !== null,
                };
              }
            );
          return {
            files: requiredFileInput,
            paymentType: event.data.QuotationRequest?.paymentType,
            loadingDocument: false,
          };
        }),
        handleError: assign((_context, event) => {
          return {
            loadingSphData: false,
            errorGettingSphMessage: event.data.message,
          };
        }),
        handleErrorGettingDocument: assign((_context, event) => {
          return {
            loadingDocument: false,
            errorGettingSphMessage: event.data.message,
          };
        }),
        handleRetry: assign((_context, _event) => {
          return {
            loadingSphData: true,
            errorGettingSphMessage: '',
          };
        }),
        assignIndexChanged: assign((context, event) => {
          return {
            sphCategories: context.routes[event.value].title,
          };
        }),
        triggerModal: assign((_context, event) => {
          return {
            isModalChooseSphVisible: true,
            choosenSphDataFromList: event.value,
          };
        }),
        closeModalSph: assign((_context, event) => {
          return {
            isModalChooseSphVisible: false,
            choosenSphDataFromModal: event.value,
          };
        }),
        closingModal: assign((_context, _event) => {
          return {
            isModalChooseSphVisible: false,
          };
        }),
        setSelectedChoosenProduct: assign((context, event) => {
          let newSelectedProduct;
          const isExisted = context.selectedProducts.findIndex(
            (val) => val.id === event.value.id
          );
          if (isExisted === -1) {
            newSelectedProduct = [...context.selectedProducts, event.value];
          } else {
            newSelectedProduct = context.selectedProducts.filter(
              (val) => val.id !== event.value.id
            );
          }
          return {
            selectedProducts: newSelectedProduct,
          };
        }),
        assignFiles: assign((context, event) => {
          const newFilesData = [...context.files];
          const newFilesDataValue = newFilesData.map((v, i) => {
            if (i === event.idx) {
              return { ...v, value: event.value };
            } else {
              return { ...v };
            }
          });
          return {
            files: newFilesDataValue,
          };
        }),
        assignNewQuantity: assign((context, event) => {
          const newQuotationRequest = [
            ...context.choosenSphDataFromModal.QuotationRequests,
          ][0];
          const newRequestedProducts =
            newQuotationRequest.RequestedProducts.map((v, i) => {
              if (i === event.index) {
                return { ...v, quantity: event.value };
              } else {
                return { ...v };
              }
            });
          const modifiedQuotationRequest = {
            ...newQuotationRequest,
            RequestedProducts: newRequestedProducts,
          };

          return {
            choosenSphDataFromModal: {
              ...context.choosenSphDataFromModal,
              QuotationRequests: [modifiedQuotationRequest],
            },
          };
        }),
      },
    }
  );

export default POMachine;
