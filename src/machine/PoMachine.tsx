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
import { customLog, uniqueStringGenerator } from '@/utils/generalFunc';
import { assign, createMachine } from 'xstate';

const purchaseOrderInitialState = {
  poImages: [] as LocalFileType[],
  openCamera: false,
  poNumber: '',
  sphCategories: '',
  choosenSphDataFromModal: {} as CreatedSPHListResponse,
  isModalContinuePo: false,
  loadingDocument: false,
  errorGettingDocMessage: '',
  selectedProducts: [] as Products[],
  files: [] as any[],
  paymentType: '',
  currentStep: 0,
  postPoPayload: {} as PostPoPayload,
  isUseExistingFiles: false,
  isLoadingPostPurchaseOrder: false,
  isFirstTimeOpenCamera: true
};

const POMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EAJlfPKAVgAsANgDsAIwAzIZ+Ps4hXgA0IACeiF4AnEGUABweyekBzqlBQV5eHgC+RTGSOPhEpORUNPRMrBAc3HwCGmISGBUy1fJ1yo0c6iLEWra8ZvoB5kggyFY2erz2TgiuXqmUQd6hhqmpiV7BMfEIAT5efpSFXoaG235BruclZV3SVXJUAGaC6LDaBjaMDITgAI1w9AAKsQAEJgKDCXjCKBAnRgMz2ebWcYrFxuTy+QIhMIRQzROKIAJHRKUZweDyBVJHR4BRKvObvSqyGqUX7-QHA5CUXAQJoAeU4BFwUhRDGQ2Exs2xizss1WzgKPi22S820SAT8iR8Hh8Jyp5K81xu4WSziNAQ55Q+PPk-IBQJBIrFbEl5AANmBgQBJAC2uBgSssOKWeLWPnydJNer8qR8hh8AXNZ1ctJC9tNiUSoW8xVKnKk3N6Pz+HqF3olnGEaEBCqjcwWuPVLn8VwOlvyhoyl2zAWC7mZxr8HjuhnZ5edVa+fNrgq9osbG4AsqQwGGI3B2yqu6ANYlnNrzn5fA9U4YPKOgrlKIkZ3r6YznNkgk6uT1l+6a7ChuvqcFAxAwgwtB8BAnrIEenaxt2azFoYL7BKkqZBAEDLEqOmpoV+BqPMW3g+D4v6Vv+vKAXBlBQTKODytg4KQnQMIAII+sQCExmqp4uF49KeH4hiGqk9ypGyvijnOVqHN4r6XBsuRlm8VGfDRq50QxUjMZwG4AMLYMQVhgLwzG8aqyzIZqwmMmJd5PtJZqUmc1IeNaDI5GJPiJGElHdJp8hQZgMFwWBcJsTCABi2lClZJ6OPiQmEv4wShOEkTZo8nlhKavhJMORaBS61b0dBvCwUKkUwlC2B-NVIKJUhAkIAUiZjv4JrbCa3iyRJ1rGq4PipPShx+KVS68qF4X1jA2i6LwqIKgAIqMqChuZ2iwC0-BCCM4iUIu1EhZVTXCgtS0rdg62YJt22wMMmg6EskwmFiiH8clCBBP5aGpgEdznB4X4bA+bljkalC2vqBrnkEfjOFNp1ULNVV0VdcprRtW28DtnAUOgpDHf6OjfKQobHX+wVo+dmNBtdzF3Q9+NPe0YxvSYLXfas+RjdcX4miWRZBKOhq0rDGTwxESMo7TFVhRj9bM7j20ADLEKKkCcKgyD+lrEAojzNltUJESePcHjnPsYmuOLdyUDhF5hFD2yGMjC4066dNKxdlBE6QADijMoizeME+gQboLEIeLWHav4ybcZ5MklAe08FznuOhz4Y86djUV5ISTkk1expPuK3NXqCBAgZgUGqv3RHyfIanKQZxeSRfk8ueQ-c7jdX9k4uz+5dBZX6P+7X9cLU3rPaFMMzRtZKd-R3ERd9nvcUqcQPPoa4R+EaziZGP6kT+V9WNRF4GwtFxBT3Brdm3qVpdflvUMrvVLOPcaQMkSPsDIfU5bjzKsua+ZBb4QWIBwAEHAX4-VBtmKSltZx-1EnkK88tK5QOnnXMAUowCBkwNoNgxMICoDIUg1YylaT7E1KmNwyREijnTIPfI-kCLbCSLgq+DVoH1hnkQvgxlcDLTAAARVQBI3Q2hYi0ISMfdw15jTpCwcyVIo4ZyXikv2I4QQ-IFH4cuYgyBzKGVwFtdAuADJin3DAWASi1j0ncGRYkmUyQ-wQLkdwX5MI5HBhJEx4DpryHMZY6xFA7EQnoDFYmoYrE2NwC4zUSQXx3H8JlOcjJHyYUoKmV8gQ2T3ifGXC+EDeTSAaKoWqj96ZCgScQUMtSIBpP8HlISlp0w4SLNmbuWwMiI3yGDRkvhTHVPwG05o4E6qCIus01pKh2kfWVF9U2P0XZdL-lqMS0tsxGM2K+bC6ZMyl1ypM+QNSVnNEwFHdEAA5MAAB3RBayV5JQ1J0wp3S9l9LYW5Dw+w0jZA8NhY0tx7hXKoPA8hNNxRfFYtCYgwZkS6FwP6NEwIXEBH0TDTUhwQh3HBqOGkdJcJ4pZBCmFlA4VsARcubE2hHFwD2m0Q6nQK7lXpYy3kzLWXsxGJzAw3MPkdj4psvmGZrijWnBeZIeQjj4QFvaA09pyQGiOJ7Sp4TYVWHhRpRF-KDWCvZQdUQR0ToK15UaplprwxOOeqMV6orTDTE+pKlOMrfCYVBn5PIg5szJE8gcBMf10zknHLS21QVjXyAFY6tlgcqD63JpTam3Llyxo+PG1NDqDxCpeuMd6y8JWr2QnivFBKkh6lnKSyGo0UiPCIgaEIvSKkVkvtmg1DK7UmoBHFQMu0eD7XaFa72PLe18oTQaodcBnUiomGKstx5Wo-WZFcPYGRxKXH8tsfCo106n11DkfIZEY3Tv7bOwdghh2E3QMTVNZNtAU3QFTa1lcc2VDzcdOdd6F0c1dcu0w4q128ypPi8ItbiXFwhqcEahSLzDOLhsc4Oqu1VPkN+ggv7mUcDYLgWIBtRTmvHVy7tvIcNgDw72uBRGSMQEXcB0tnqK1tWCNkIZyQNhIzUXigaVx-Cnz2IXVwoRL0IJnfmhB9HiOGwfU+0m6b32Zso9hq9cb7WycI-J0UzGS0rrY18xAm6C47tTHu3KslUxO1zKEc4Gw5yScNVpmiuA72GQecCJoXAo7aBjtRvNLizPbuIpu-d8GqSGgCCJdM5tkgUTCajSgkTeDJJici9ij9bnECWRl2xaSwh9ieKEIxM50gHshqadwr4GTnEiK+YIJRyy8GIOQeAypJ1fGM+u1YABaQFpx+valnFkzM9x7zWww5+8q-QZnEF6xBtYYlYvTjCE1o4b8yVsjpE8ekY4cJ4s7bNgC8UQRLalfiP6aVPGkmym5V82oFI3DcThJ8tLaL1hAuKS7cYFWbCbYjcLBpjiQzyADBkuQDgSXTPsT753hS6SYgqP7tlS63Yyvd8kslzwvhuEpa8+xti0qfkKNHbVsLBC2NeVMAbyJ3D8MGwoTswg0jBsaNkpPGleixsteeEdOufL64gEZsWYfiWPteaD4tbNAx3QaNMjIPvJYVmTr0AuNaG0gBTn6RwCkJk1KaDR0v8JiRhveUHX56RplSNzv2dEU1x2uuHR6uu+bnFi4jS4aZEuRqZ5DHImxLjG6BtSA4hR7fV2FCI93ovIieE3uRc8Cr6QO0IkYpP2CTvdd5PguCcf2qiXF4XZhuY-o7cB-oqSjwQjK9pfn4RhDC8bByJ4BnqEDT3izJDUSVpROYKSJhdIdvVeVzSwV3AhfsJfhpz7+n-udFcZPqEZkdxcKj91Slm5gxFvrK9bZcF-iW0lO6YfbM1tQ36iMUJG2XgXN9rcxQafQ3TMbC2Mac94RvwGgf9Jv9AIgqhemEwaDIvyRok26GRo58mGeqdKmmua2m2g86Qu5aJmCAFwnkNW3cLIwQQCKqkOxuCYjmUuf+16Mm5CcmjGheY4iMgsVKRYhwXiA0l4tao0c4OEjIZBT+VAsA1CmAcAsAXmYA6IvmNBGQg8r4F4hovCQsDsksbBq262Hs3BiB7mnm3mqgheo0eYaipImY+Qrke88uMMY0RoSMR2jwZcJQQAA */
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
          | { type: 'backFromCamera' }
          | { type: 'backToSavedPoFromCamera' },
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

                addMoreImages: {
                  target: '#purchase order.openCamera',
                  actions: "assignSecondTimeUsingCamera"
                },

                goToSecondStep: {
                  target: '#purchase order.SecondStep',
                  actions: 'increaseStep',
                },
              },
            },

            SearchSph: {
              on: {
                backToAddPo: 'addPO',

                addChoosenSph: {
                  target: "addPO",
                  actions: 'closeModalSph',
                }
              }
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
                  actions: 'handleRetryDocument',
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
            backToSavedPoFromCamera: "checkSavedPo"
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
        }
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
        assignSecondTimeUsingCamera: assign(() => {
          return {
            isFirstTimeOpenCamera: false
          }
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
        assignDocument: assign((_context, event) => {
          const requiredFileInput =
            event.data?.QuotationRequest?.ProjectDocs?.map(
              (val: ProjectDocs) => {
                return {
                  projectDocId: val?.projectDocId,
                  documentId: val?.Document?.id,
                  label: val?.Document?.name,
                  isRequire: val?.Document?.isRequiredPo,
                  titleBold: '500',
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
        handleErrorGettingDocument: assign((_context, event) => {
          return {
            loadingDocument: false,
            errorGettingSphMessage: event.data.message,
          };
        }),
        handleRetryDocument: assign((context, event) => {
          return {
            loadingDocument: true,
            files: [],
          };
        }),
        closeModalSph: assign((_context, event) => {
          return {
            choosenSphDataFromModal: event.value,
            isUseExistingFiles: false,
            selectedProducts: [],
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
          const { QuotationLetter } =
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
                context.selectedProducts.length > 0
                  ? context.selectedProducts?.map((val) => {
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

          const productsData = [...context.choosenSphDataFromModal.QuotationRequests[0].products]

          const newSelectedProducts = productsData.length === 1 ? productsData : []

          return {
            selectedProducts:
              newSelectedProducts
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
