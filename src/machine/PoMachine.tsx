import { bStorage } from '@/actions';
import { uploadFileImage } from '@/actions/CommonActions';
import {
  getCreatedSphDocuments,
  getSphByProject,
  postPurchaseOrder,
} from '@/actions/OrderActions';
import {
  CreatedSPHListResponse,
  DocumentsData,
  PostPoPayload,
  Products,
  ProjectDocs,
  UploadFilesResponsePayload,
} from '@/interfaces/CreatePurchaseOrder';
import { LocalFileType } from '@/interfaces/LocalFileType';
import { PO } from '@/navigation/ScreenNames';
import { customLog } from '@/utils/generalFunc';
import uniqueStringGenerator from '@/utils/uniqueStringGenerator';
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
  loadingDocument: false,
  errorGettingSphMessage: '',
  errorGettingDocMessage: '',
  selectedProducts: [] as Products[],
  files: [] as any[],
  routes: [],
  sphData: [],
  paymentType: '',
  currentStep: 0,
  postPoPayload: {} as PostPoPayload,
  isUseExistingFiles: false,
  isLoadingPostPurchaseOrder: false,
};

const POMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EAJmcAOAIyUPhgJwBmABZA30C-AFYANgAaEABPREjfX0p-NzCPfwB2Z39nEMCAX0LYyRx8IlJyKhp6JlYIDm4+AQ0xCQxymSr5WuUGjnURYi1bXjN9D3MkEGQrGz1eeycEV09vPyCCiJj4xF83N0pDrI9w52TIoI9nYtLO6Uq5KgAzQXRYbQZtMGROACNcPQACrEABCYCgwl4wig3x0YDM9jm1jGy0QHnSRyy4UMeKC-gCSX8sQSCFOzm8QUMhLcuVchg8d1mDwqsmqlDeHy+P2QlFwEEaAHlOARcFJYQxkNgkTMUQs7DMVr4sqTEP48pRnEkshrAllIpFTkUSiypGyeq93p9vr9+YK2CLyAAbMA-ACSAFtcDBZZZUYt0QgPJEbhszm5IoYslkwoZwmqEFdDJRo2EAvHI-5Isyyo92fIuTbefbhZxhGgvtK-bN5milRjIuFwpQck3fIYm4EPJlE+ENZRIs4IgbfB4sqFc6zus9OdaeXaBWWlwBZUhgL0+uA1+X10ArTGBbG4-GBQnZgKJnudwfZZy4-tRwwm+7mmccosLvlLx2cKDEUEGFoPgIFtZAdzrQMG2DLFWxPGkzyJS89lWK5WyScIskMTxqUZcIpzfJ4P3nMDKCA8UcClbAASBOhQQAQQdYgIIDRV9wxNJ-EoMIrmCGMcmbBMUJyFNgkJGNCXCEILgIroiMLEiS3IqQqKEXhK10XgoE4YhkDAGEtLXCBcGdFiFSWaCJ0pGkx0xfJwkOcIPETU4uObTtQn8Z9XN8WT80tOduVI5TKOlNSNNhUUwAo7BYTMvdHEQKzU0JHs6UCBy3CcxNPBTfE6V8I0zmbXzTTzC1Z0-YLopUsKxQlLSqOafg1NEcRKHK98FKCpSatC7BKHqnBJWlIZNB0RYJhMZFILYxKEGzSJuOcTEAnOTE0lVFC3GjY4sjcA0DpDZszj8iriJ6u0QuwVShtixrpU4Ch0FIDrnR0F5SE9Drp3kq1Lr5a7br6+64VGtpRkmkx4qg9iFsNZbVv8da3E2xNQyySgVXvWN8lcG43DOrr-uLK6QeBmKRuovgAGE8C0sAaYRf90EEbdprlWaLLhxbEbcNaVtRg6XJ7Zaog1IIVQiIm-sC0nAfJsLdP0oyTLp4grDAJrMGdTXVdMjn-XMoMVS8Tx7w8btPH2o10fHVMVWbfnsgO1wZYLEmvzIxWBuV3h9fVzWmqXQOCF4KiYbmg9OO4zstn4+9mxcrCscQ593GCKJ3YCqrepiimpAANRM1AwAAGWIAVIE4BxPgRfkXh+dAAAovMMABKThOtl3OyfzuqQeL51S4rquIEj7n5uSSkcX2i4Akk-JExVLjsOHaNIkjXF3GzyrFL72qBue0gAHE3U0sHsDLwRPk4dA3XQOIz+0C+qOvz4J6DbJMZ8EMMsCC4ADDSBD7CtSgTlCrSQuPzHEu8ORAUwCBMCf5wS0VBAAMX3uBQ2tZWKTxWOcK8w5UxnnxDcZIE5oxwPkAgpBvIUGgmBLFMgYFP7QUIShEMvhrJniPNhaMY4VrUKoLQ3goESwwBflTAAIiMVAnp9LaFgM1Vowx2rdw9t7RBYjSKSNftKWRmB5GKNgGNEYE0DDQxwbuWG800jnEHAdHI6VdSGGcImLylIoxnECFcTEVlTplV+po0R4i7R6JkXIhRvAlFPXQC9KgyB3raE+ugb6GiAqhN0efSJRjolKLMZDSxphrFcy-sjQIqR3AanjAA7M7iUL3msniZ8wQnGRG7EyIJhEQnAR0UpAxUTFGj3IBATgqAkmVwgHFUpeCgzdnjNxHwaQjQdKuL4RMrguI3BCDGTsNxxxdNfHJXp2iwl8mPugZ+F9DHGJico++2hH7XNhLc-JbCebakqdwlUho0yHJJChIILYMr+GWeEXw5wowHWEVouhdpBAQFdH+N0VE3mKI+XYr5WMLgGijLGAFmzGTgJaSEKIElYz4W6SczJfTzlCCRWAFFVZsDopiZMaYRsEorDyB0nFvz8XdlcleJyqYWlSQ6TGHwRpYVMPeOclBYI0HECybyTFKwhwisheAjswLgg+Cwrcal-lZxypYfQ-8oIOCfA4OqxADkWwdOwvqZM7ZnKcM3tZQ0HZuF2SCLK5h9LEXIoIK6TA2g2AvQgKgcNdqFqW1bLqM8zg55jm4bsMk45XCtgCGeQ1FxLYBvlaRYNTLab0xgAARVQLgGJNg4hxo1JjJ1TZtRGmSL2D12pUhhC8sdfFQjjXnXkH7JmCj0C4E4EuTcMBYBxo4Zm1wmNNorVpM+LKVLjkmo5KO3A47J2AnoOgl6nox0UFwHG6BS0aQHKuKjPEtthLrFDPGSFW8hyTiHcTSg0h6iqAYSqulYFj3EE9H+8eszjbQRTUEVI3lciMlytkRMYRMYhFDGkdDdIjlmhpbOX9KhGhcEtQBQNwGT3gcvUmuD+oEOYmWVtMkOpjjpDcZ4Okw5UawoIwMLgmB74IgAHJgAAO62sg9ylw1GvK0b7UhxjiA6Qpk3mEI8BzMKBK3cOqg1qI2-SFM8GiIJiDuhhLoEy8IfhxsyLkFKXyMK-0tkQ9IWojyRhDH83xpUtPft02wfTs4UTaBnXAFRrV2g-R6QFPzAWORBZC6YiGFjxhWM5bgqDcM1rcSlkdfUCz3WZqjFxGM6VhwANCIVWFMXCIGbi1YYL3pZ1hbaOo4J0X6v+Zq4F+rCXCnJYmFMGaczoJS0HLkPLNTLYaivFlLiPyLjI38ZhfwVWOuxfkPFxroXLlvQ+l9SLeGOTVbkrVjbPWtuJeGEUlLJS0s2KjklKS3h+a2SU2eVGM2OyDikgUbULTNO4e3fIY7jxTuJPq5g10yieAtRax0KLs4QcVDBx1CHggod9bGFNO7ZToKWxDNxTxTYci7KTpwtsWpc2uHFpCpyq2bXrfB58SH234mvSSXttJB2gc6bW11urzP0dwEx1DW7Q2MvzRuJhQcKnQwdgnOcDZnDPBeAW0EJsfhN6bsB9pygSOCAo6CxwNguA4i6wFM1tR8PDvA75yd7rNriAm7N1MkXxTrNYS8H4Z10Y8j7TPDNg03EIUUkxJ2OkhMv2y312AQ3HWnem-N2MnbHOUn7YyYju3oOHcRoTy7gUbubvWeRktbeBxMgTkhU2GbSQtTpCTfzBZ6R6d6f54WXA6OaYCZ+ERu+D84gx7B9ZpyKZPDBAOA+51RKdreBWh4A4gjV1UtNLwYg5B4Byja88cXkmEAAFobiJj37Z5IBwjRuIykugHGeOR9HAxwHftiVjDhxFUtjGc8SuBFpSa8mF7yoyjEwlhV7mQEfwe3hk2WCHQhVDbDCGbH1GAKwVLEdDAPwUbGzHAXn1xAyiciwhxBcjBXARTTWAASkhjG8x12-RAO9n7mwFQKDHSBQ1g0ZEKkOHPH2mjCyEQIBhoMPnClQCkS0noOgiHCOAJlyA7E3gqyVzJA40HFqRRjpCkm1xv26nll4P6kGhBipmELhhs2XmITHH7EyC8hU0qyj00WoKBiVj0n9jXzVmwA1gICol0Ml3IW8A6R7DODSl1AU3JEILEhgMkmkgoNUM9mqloK0JiiHhHimUgFcIPHcL-i8Kcn8WQxQkKjmwOBxGRiygXhwzCLli9msKPjZyuRyQeivhvm0ASPtVRmOGzEQyyjOCuAaSY1g2zAcnn2HA1G6NhVVV+FqNWAOBbHcBuC7CiAchARQjQnggCBVwhVpH6KAwkQqMvjZSUSGOzEyGOG8gn2fDODaPVGJWjDH1DG1EOhUK33gRWKukGTyWGTiIgCGJ4hSH7HTRsmULOA8XyHAX2h7Dxh2ghU7GWLOVIkuReS0g2I3y5Sf2OIHDGO1GUKbEYKBWyGOCSFRlxGRl1CNR81lgGL5FLS2PHCWnKwNGpyCEOCvG1Qcg1DfXOFRl1SLXNUGM5mGzhjbUTQJBTQKm6IzQxH7COFYxWk9RvS4IsICjNSDUZS2ICGD1OEpV8TpE1WV1+PyGJ1yBgSzklNnF3X3SGILUqQkgyn5kZCHD8PSC8BfQhQcibA-RfEoNlh41UENOBIaIhXyHjDOHEhcjAUaMwgODyCclDBb063t2qCGNjCWhg3lw1POH2hFQJ15LgOHElWv2uNtwZzbyZway3BhPS13wnEqVjOjHjN5KvE9xzWRlyDBTcWbBW11KOyz2RxzxZwLPuzQODBWm+U7BEhuFOG4TcErOJQnGuBwnnjxKdM0UHxz2N0TymSGJDFODG2HAOBCB8G1COODDxSxhDym3nyPH7DDMZ0GhjUwDgFgC72ih7wf3ZIlwPH2hSH2j1FciNAdSJSiGOHcENHSAAQfRPJzM5A72dGvIRCIyXIqQ2BLywP-jpCJX2j2gOXjGwjWkbOKCAA */
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
          getSavedPo: {
            data: { poContext: typeof purchaseOrderInitialState };
          };
          uploadFiles: {
            data: UploadFilesResponsePayload[];
          };
          uploadPhoto: {
            data: UploadFilesResponsePayload[];
          };
          postPo: {
            data: { success: boolean; message: string };
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
          | { type: 'gettingBackDocuments' }
          | { type: 'goToSecondStepFromSaved' }
          | { type: 'goToThirdStepFromSaved' }
          | { type: 'createNewPo' }
          | { type: 'goToPostPo' }
          | { type: 'backToBeginningState' }
          | { type: 'getSphDocument' }
          | { type: 'retryPostPurchaseOrder' }
          | { type: 'backToInitialStateFromFailPostPo' }
          | { type: 'backToInitialState' }
          | { type: 'backFromCamera' },
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
                  target: '#purchase order.SecondStep',
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

          on: {
            backToBeginningState: {
              target: 'checkSavedPo',
              actions: 'resetPoState',
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
                retryGettingDocument: {
                  target: 'gettingSphDocuments',
                  actions: "handleRetryDocument"
                },
              },
            },

            idle: {
              on: {
                getSphDocument: [
                  {
                    target: 'SphDocumentLoaded',
                    cond: 'useExistingFiles',
                  },
                  {
                    target: 'gettingSphDocuments',
                    actions: 'enableLoadingDocument',
                  },
                ],
              },
            },
          },

          initial: 'idle',

          on: {
            goBackToFirstStep: {
              target: 'firstStep',
              actions: 'decreaseStep',
            },
            goToThirdStep: {
              target: 'ThirdStep',
              actions: ['increaseStep', 'assignSelectedProducts'],
            },
          },
        },

        ThirdStep: {
          on: {
            goBackToSecondStep: {
              target: 'SecondStep',
              actions: 'decreaseStepFromThirdStep',
            },

            goToPostPo: {
              target: 'PostPurchaseOrder',
              actions: 'assignPoPayload',
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

            backFromCamera: 'firstStep.addPO',
          },

          entry: 'enableCameraScreen',
          exit: 'disableCameraScreen',
        },

        hasSavedPo: {
          on: {
            goToSecondStepFromSaved: {
              target: 'SecondStep',
              actions: 'setNewStep',
            },

            goToThirdStepFromSaved: {
              target: 'ThirdStep',
              actions: ['setNewStep', 'assignSelectedProducts'],
            },

            createNewPo: {
              target: 'openCamera',
              actions: 'resetPoState',
            },
          },
        },

        PostPurchaseOrder: {
          states: {
            postImages: {
              invoke: {
                src: 'uploadPhoto',

                onDone: [
                  {
                    target: 'postFiles',
                    actions: 'assignPhotoToPayload',
                    cond: 'needUploadFiles',
                  },
                  {
                    target: 'postPoPayload',
                    actions: 'assignPhotoToPayload',
                  },
                ],

                onError: {
                  target: '#purchase order.ThirdStep',
                  actions: 'disableLoadingPostPurchaseOrder',
                },
              },
            },

            postFiles: {
              invoke: {
                src: 'uploadFiles',
                onDone: {
                  target: 'postPoPayload',
                  actions: 'assignFilesToPayload',
                },
                onError: {
                  target: '#purchase order.ThirdStep',
                  actions: 'disableLoadingPostPurchaseOrder',
                },
              },
            },

            postPoPayload: {
              invoke: {
                src: 'postPo',
                onDone: {
                  target: 'successCreatedPo',
                  actions: 'disableLoadingPostPurchaseOrder',
                },
                onError: {
                  target: 'failCreatedPo',
                  actions: 'disableLoadingPostPurchaseOrder',
                },
              },
            },

            successCreatedPo: {},
            failCreatedPo: {
              on: {
                retryPostPurchaseOrder: {
                  target: 'postPoPayload',
                  actions: 'enableLoadingPostPurchaseOrder',
                },
              },
            },
          },

          initial: 'postImages',

          on: {
            backToInitialState: {
              target: 'checkSavedPo',
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
        uploadPhoto: async (context) => {
          try {
            const photoFiles = context.poImages.map((photo) => {
              return {
                ...photo.file,
                uri: photo?.file?.uri?.replace('file:', 'file://'),
              };
            });
            const response = await uploadFileImage(
              photoFiles,
              'Purchase Order'
            );

            return response.data.data;
          } catch (error) {
            throw new Error(error);
          }
        },
        uploadFiles: async (context) => {
          try {
            const docsToUpload = context.files
              .filter((v) => v.projectDocId === null)
              .map((v) => {
                return v.value;
              });
            const response = await uploadFileImage(
              docsToUpload,
              'Purchase Order'
            );
            return response.data.data;
          } catch (error) {
            throw new Error(error);
          }
        },
        postPo: async (context) => {
          try {
            const response = await postPurchaseOrder(context.postPoPayload);
            return response.data;
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
        useExistingFiles: (context) => {
          return (
            context.isUseExistingFiles === true && context.files.length > 0
          );
        },
        needUploadFiles: (context) => {
          const hasFileNotUploadedBefore = context.files.filter(
            (v) => v.projectDocId === null
          );
          return hasFileNotUploadedBefore.length > 0;
        },
      },
      actions: {
        resetPoState: assign(() => {
          return purchaseOrderInitialState;
        }),
        assignPhotoToPayload: assign((context, event) => {
          return {
            postPoPayload: {
              ...context.postPoPayload,
              poFiles: event.data.map((v) => {
                return {
                  fileId: v.id,
                };
              }),
            },
          };
        }),
        assignFilesToPayload: assign((context, event) => {
          const files: { documentId: string; fileId: string }[] = [];
          event.data.forEach((photo) => {
            const photoName = `${photo.name}.${photo.type}`;
            const photoNamee = `${photo.name}.jpg`;
            let foundPhoto;
            for (const documentId in context.files) {
              if (
                Object.prototype.hasOwnProperty.call(context.files, documentId)
              ) {
                const photoData = context.files[documentId].value;
                if (photoData) {
                  if (
                    photoData.name === photoName ||
                    photoData.name === photoNamee
                  ) {
                    foundPhoto = context.files[documentId].documentId;
                  }
                }
              }
            }
            if (foundPhoto) {
              files.push({
                documentId: foundPhoto,
                fileId: photo.id,
              });
            }
          });
          return {
            postPoPayload: { ...context.postPoPayload, projectDocs: files },
          };
        }),
        enableLoadingPostPurchaseOrder: assign(() => {
          return {
            isLoadingPostPurchaseOrder: true,
          };
        }),
        enableCameraScreen: assign(() => {
          return {
            openCamera: true,
          };
        }),
        enableModalContinuePo: assign((_context, event) => {
          const newPoContext = {
            ...event.data.poContext,
            isModalContinuePo: true,
          };
          return newPoContext;
        }),
        enableLoadingDocument: assign((context, event) => {
          return {
            loadingDocument: true,
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
        decreaseStepFromThirdStep: assign((context) => {
          return {
            currentStep: context.currentStep - 1,
            isUseExistingFiles: true,
          };
        }),
        setNewStep: assign((context) => {
          const newStep = context.currentStep === 0 ? 1 : 2;
          return {
            isModalContinuePo: false,
            currentStep: newStep,
            isUseExistingFiles: true,
          };
        }),
        disableCameraScreen: assign(() => {
          return {
            openCamera: false,
          };
        }),
        disableLoadingPostPurchaseOrder: assign(() => {
          return {
            isLoadingPostPurchaseOrder: false,
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
                  disabledFileInput: val?.projectDocId !== null,
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
        handleRetryDocument:assign((context,event)=> {
          return {
            loadingDocument:true,
            files:[]
          }
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
            isUseExistingFiles: false,
            selectedProducts: [],
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
              return {
                ...v,
                value: {
                  ...event.value,
                  name: `PO-${uniqueStringGenerator()}-${event.value.name}`,
                },
              };
            } else {
              return { ...v };
            }
          });
          return {
            files: newFilesDataValue,
          };
        }),
        assignPoPayload: assign((context) => {
          const { QuotationLetter, products } =
            context.choosenSphDataFromModal.QuotationRequests[0];
          const totalPrice = context.selectedProducts
            .map((v) => {
              return v.offeringPrice * v.quantity;
            })
            .reduce((a, b) => a + b, 0);
          return {
            isLoadingPostPurchaseOrder: true,
            postPoPayload: {
              quotationLetterId: QuotationLetter.id,
              projectId: context.choosenSphDataFromModal.id,
              poNumber: context.poNumber,
              poProducts:
                products.length > 0
                  ? products.map((val) => {
                      return {
                        requestedProductId: val.id,
                        requestedQuantity: val.quantity,
                      };
                    })
                  : [],
              totalPrice: totalPrice,
            },
          };
        }),
        assignSelectedProducts: assign((context) => {
          return {
            selectedProducts:
              context.choosenSphDataFromModal.QuotationRequests[0].products,
          };
        }),
        assignNewQuantity: assign((context, event) => {
          const filteredValue = event.value.replace(/[^0-9]/g, '');
          const newQuotationRequest = [
            ...context.choosenSphDataFromModal.QuotationRequests,
          ][0];
          const newproducts = newQuotationRequest.products.map((v, i) => {
            if (i === event.index) {
              return { ...v, quantity: filteredValue };
            } else {
              return { ...v };
            }
          });
          const newSelectedProduct = [...context.selectedProducts];
          const newQuantitySelectedProducts = newSelectedProduct.map((v, i) => {
            if (i === event.index) {
              return { ...v, quantity: filteredValue };
            } else {
              return { ...v };
            }
          });
          const modifiedQuotationRequest = {
            ...newQuotationRequest,
            products: newproducts,
          };

          return {
            choosenSphDataFromModal: {
              ...context.choosenSphDataFromModal,
              QuotationRequests: [modifiedQuotationRequest],
            },
            selectedProducts: newQuantitySelectedProducts,
          };
        }),
      },
    }
  );

export default POMachine;
