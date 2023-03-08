import { bStorage } from '@/actions';
import {
  getCreatedSphDocuments,
  getSphByProject,
} from '@/actions/OrderActions';
import { storageKey } from '@/constants';
import {
  CreatedSPHListResponse,
  DocumentsData,
  ProjectDocs,
} from '@/interfaces/CreatePurchaseOrder';
import { LocalFileType } from '@/interfaces/LocalFileType';
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
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EARgBMAVgDMlN14Bs7s6engDsnn6eADQgAJ4uriEALJQAnM5+iSmega6uie5+AL6F0ZI4+ESk5FQAZoLosNoM2mDIlLgQEGwA8pxQxAAqxAy0fBDNrWb2yFY2erz2Tgi5hgAcPiEphoaeKSHOzinu7tFxCO6JfpR+honbnquJzqtuicWlGOUyVfJ1DU0tNodLq9Ai4KTCKAMZDYKZIEAzay2BbwpYHQyuSjBCKGZyBTYXVanRDZEJYi47RK5ELuQxhd4Iz7SSpyWr1RoTIGdHrcMAAGzALQAkgBbXAwOGWJHzRYuFIpTF0wx+MKhHYK4kIEJ0yiue5+VwpTJ01auBllZmyaqUP4cwHtbm9YRoJowyUI2bI2XLHbua5HFU7VYhVwvTV+ZyGShJEMKlIvDLBc1MipW37sgGtB0gzjAgCypDAovFcHdiLmdlRiFyz2jh0MBQOeyymtWax8Xlpe1u+T8q2TUlTPzZ-05lBG4Jw0OwnAARrh6EMAILc4hlz0yqsIZwhCJYmlPDEq7FRWKITZk9zataHvx7AIDr4s622zNtCdSadCXgu3S8KCcMQyBgLwkIFhAuB8uu0qVqAaKGs4dZpDuR6PBErarN4lyeE8WxZHeuSPpaw42hmY4flOMLfr+kKcGCEL-tBFYonB8ShtGjy4jcOyGAqRJnlqniIasd7yhGYR5OkRFDqypGjvaFHYF+9E4JC07cHwAgaGIEgpt8smvuRYCTkpVEqdgakwuoIjEFoyJmExXpbkEQnRlShJCbxOyuOGiTeA2+yhHezj5EJ0n6S+ZEKcZn5mTFqn-upFDoKQlDIHyOg1KQIppXpz7pvJWaKcp8UWYlVnaXZ8wOSY0wbrBjguCG6y7oaKqRphNIhJqhI+LcGK8VeiQhKs-YlIyg4RQVdpFaVJUmZZM58AAwng-5gMtOhgP06CCKWtXwuWTmsduCFIQc2quH22E9Zc1zqnh4R0n54X5SOM3vnNVFASB4GQatxBWGA6mYHyQN-VBB1Ssx3pBIEHHpJGDZGp4dKaiNZK4riRzHDsd5FONFoyZFhWfSZX4-bwEMA0D6nAjTBC8NOjmbidO57qEFyRldqroQJjzrEq7MpBkhzuGNHyTW9ckfeOX3YJQ5kAGqQagYAADLEB0kCcA4jRbe0NQtOgAAUqOGAAlJwRNTe9b5y+TcUmSrfJq5r2sQCzDVovsmLHLSbajfsBThkalBoQU2SrFseQSxNT5pnbRmOwryWkAA4oKf5QjC6uCI0nDoIK6AxJn2jZ9OeeNF7LGNduuxkpkATY8NfYpD1DbXHqwT7CEwc3O4r2J3LmBjJyfTEAAQgudBDAAYlFkxQx6MG12iAVYuEqN4juRyJPxZyRik913BGiRNxkwZDyRIyj7w4yAhPQwDBZZCcjX3pZFGuS7JzWQPKaTU6Q7jRgVM8PuDZz6XGvrJW+Y97QwHLotAAIrZVAIoQLaFgBpfg35RDiFylLYecD75jkQRXGEqDMDoMwbAaymgdDVRMB-LchpsipGjq4AB4Rch+CAQkdYjwsg-zxJhN4hM8rENGKQhBWcUFoIwbwLBnA05UHSplbKhCE432kQ-LM5D5HUMUVg+htlGEGGYcvI6rM64JB1IabYzxo7uCujuIBQlMRI1COEXc2QpISKITou+ej3yUIUZg925AICcFQOlLWEBIQsJOkJEWlB95bD7JsAMJwBJuFxNGPUBpXBBBEqEEIMDrQkJCZQVRZds5UJoUo7BRdtAlzqZCBpxikm2IVN4A8jxAj7wEUAp4l4vCtxwnqAoFT5Av3qCEie09FzDF0e-Kx9U14uGVGSE8uJ8R7wPi4A0yQhJJCeDcB4gQZlUDmW-e0ggIACjovyWg2g2ApQgKgTA2hulojuOsG4ewgq7EwgkIB11UjANyFSDE0yAnaNkrc6pDynkrTWjAAAiqgXASibAxF+fEc+lAGymmKS8F4NIcmHy6sSvwGQMR7BGoSa5lBKabQwegXAuZOjFhgLAAl24N67J3gSfeQDIxkjbnvOkSReJjXGrwYg5B4CHUkcOOqq9vQiUQmEdmgQBrR01LkPqdwRq704aacRksEXWhoPQJgrAujEA1TDLceFoynICNzNY7dcmhmSOfEMHgPCiUNCywygIXXHTrpGJ4m8cQioOUau84cKRdivGELw4bF5chBFGmxSw9TpDSaNCMd59hUmcK2dsAQcKeAQl6sK8LiIGRzQ7WK2B83ey2dHeN299mEk1LsTEv8Lrs2VIPZtxNpr22KlRZ0qAkH-i7Zs7cQQdlbz2bvQdAlxaYjSA8I0ItRoDOzaTdtlEFbmUWiu2GXYfDBEOPvXcrxEjhmKcSq8vF97YQiGaKdtsZazvlqy4CVMlX-WwIDAg05b3OXvS5J9wYIx5DffzWsX70g+syFMs9ss51XtKi7N28TIBwbZscrECo6TFL1KaZU6NUYbDvPkAKRSUh4eAynGp6AUroHaeVbAVdtDkZjeLY+VItidQNCGPmZxhrH2jp5Hs4s1RWvji2ypqzI2HQ2d6K67hj4ONxKNI4rjuq5O2MfWkzwDQBC2AUSd1rNPyCqWQuRgnOm0NE4WvuVwXgeL8qEPygDLN7GJdjdI2opPqZttLNzCkwlGIiaRiAPmSQdV1G3FxEYtiHAs4fcIfpbgiQNCSrhOwWUJazLUjzUAvNNPS8sGkiF4zi1xHkFxV4RlhHDmkVq1JsIsqRZyJrTYrjlbJc8HcxwgHHADfKclRWFRwuc9Om5r9kWPLAGN+tUYj6bF2HSB49bwVxvlECtY82qSeBZWy3AHLcBNbyFw2l+xcR4l3I8fhkY0kxwSDcUMxzijFCAA */
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
            onDone: {
              target: 'openCamera',
              cond: 'isHasSavePo',
            },
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
        isHasSavePo: (_context, event) => {
          return event.data === undefined;
        },
        searchValueLengthAccepted: (_context, event) => {
          return event.value.length > 2;
        },
      },
      actions: {
        enableCameraScreen: assign(() => {
          return {
            openCamera: true,
          };
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
                  isRequired: true,
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
