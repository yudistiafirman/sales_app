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
import { uniqueStringGenerator } from '@/utils/generalFunc';
import { assign, createMachine } from 'xstate';

const purchaseOrderInitialState = {
  poImages: [{ file: null }] as LocalFileType[],
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
  stepsDone: [],
  postPoPayload: {} as PostPoPayload,
  isUseExistingFiles: false,
  isLoadingPostPurchaseOrder: false,
  isFirstTimeOpenCamera: true,
};

const POMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EAJmcAWZ5QCsbgGwAOAEYvAHZDAE5-EN8QgBoQAE9EEJDPAGZ-Z38053CcoLSvAF8i+MkcfCJScioaeiZWCA5uPgENMQkMCplq+TrlRo51EWItW14zfUDzJBBkKxs9XnsnBFcc7z8g0IiomPikhB9AyjC0wLS3P0CPQ2cSsq7pKrkqADNBdFhtBm0wZE4ACNcPQACrEABCYCgwl4wigvx0YDM9nm1nGK2SbkMlDSMUC-jcgRCXnOhjcB0Q2TclHCvl8gWcqQZNzyDzmT0qshqlA+Xx+fwBUGI4IYtD4EF+-wAYuhiABbKXIADy-DY6DgBAgKNmaMWdlmqwJzl8lAJITc-l8GS8rl8XkpCEC5Jpl2chi8hkM-h8ISt7PKz258j53yVlFwECays4BFwUnhDGQ2B1lnRS0xay8XlO9t8uTcXkC+cMeMd-n84VxjMCNzx2WtbgDnJ6r15nzDgojUbYMfIABswH8AJLy3AwVNzBYYw2IK5pU7mtzRaK+L0UxKIZ2Ws2+cLuItuy5N0ocqRc3rvDsC-7d6OcYRoH7Jyd6megVaWkK4txpC1pfdDBCPITUdcIi0XBlsR9W1DECZtz1bHlQxvZA717ThIwgABZUgwFHcc4FfacM1nBAQjSHE8RCAkiRJMkN0OJkc2ZLwAhyE1Cng09AwvNsUPDLCMOFUVxV4SVBWI9MDQ-LdMn8Sh8zccJlPCcJayyR1aw2NjnEPH0mV8K4EO6F5kOvcMxXjHAk2wIEQTocEAEEe2IKT9WWMjnEKSg7mPYtPSyfM0jAgDKCCd06QtbyTKDS9235SywGs7BbMwqMAGFsGIKwwF4Wz3PfRwXB8vyrgCu4rW8sDwiomti1rbEQlivieTFTAJSVThhQhBzwWlCzJJMVESJk4q1nAqsaKibyMmtcDfC0oscWyQlmSuPcAJapD5HazrBW6kURWwT4JP+QrSNkhB90dLJLjNcliy9Hw-wubazN2sSzoBYEwUhaFYUTbQkVlBU9vEpULrG1YTXA04iUiMJKxNZwwKyXyfXAv9Sy8NT3uDKhwe+ygYG0XReARZMABFRlQeU8u0WAWn4IQRnESheJ2wmvvDUnycp7AacwOmGdgYZNB0JZJmG3VRs8q6MhuM09MLec6RCzcnSyHEQKZck4LuFT8fioneaHfnbKFkXeEZzgKDlKhkH7HQ3lIeUOZbD7uY6iGuz5xNqdp+mbbF9oxilkwofl8a0hyFj7XU38-EmrTtdpDiwmxZ0C2NttTa7S2g4ZgAZYhI0gThUCdsuIHhKPM2xelwstYI-Dgq4KNTuDKELNjzg8Qzc7anmu3t0gAHFzfhK3g9tjVtHQBJJ7J6ei5t+uyJyPFcRiSi6R9ck4k1i4LVxH16zxNi12anjPYJyh89vQQIEHbqh0L4XZ43hXvNNai94CJ6ZcWkLgLnCMBVwQFCzIxvo8RCXsH4jyfi-MAb9nyCzXtoKYMw0weUzFvP+u8IiAMPiAwkPdgLFgZM4QIalfBD3kKCE6ZAuo9T6sQR+yBv7jUyLdcC35lpNXUqWK4J44GmXvkw06rCjocG+BwbhqxbS3TxDie0uxiTAXxAwqgUiWEHV+o5f6MJeBwgpoiP4oN5R6O+oolwrhPA+ACMEMIiN9jH3Aaafc5U3TZnPjoygNjwzP1fgQQcmBtDqmIBAVAES7EIAyOkQoKkPSZFjsuDWhx+4nHVh4PcFxPTkgCUErsITUF8CyrgCmYAACKqAqm6G0AkeJ2IczunOD4X8hIAJHyyeSHMy0AL0kohcMRZ4JHxWIMgPKGVcD03QLgdKEACIwFgPE-MWkNhei9A1bItZ-G33gffKZMy5kUEWYYqxsz5m4HicozWQQe5qToUEUZhJuLiLim2E5vBrnnPsn9BoqgrlnIWfEhxjitguN2CuR0CMe6kkZOA2sDIAnSCBU0LgIkOFIOQFYjF4K9wsQRlEb0+4NnH0MpQLItUE77iyB88ZXyeTopUJiw64ISkyjlIqNlhK4YWloaS5GFLDgkm-I3PSwEog3D0mi-AGLmiYA1EiAAcmAAA7gomWuCiowyJfDIVSNyWo01vSHWiLCiRVoSaAJcjIme2VK8AFRjhxwl0LgfsFjkQ6qnNJaORoggKSUipZ5Gl-ChROAjE059-BwS8P4O1VgHXwKdTyNE2gVlwGZm0NmnQjnxXtWwR1bYM1ZtDiMcOBhI6+rfJdGOhhTRbHon+Okjbwi3XbT3ZclZSQRFJEyJN8iS3puTeWnNrNRDs05ggotI75BlrHKs8WoxJbVtMNMEa-r8GNp7gEFtWj21aVSAuRtnoE241jvSodKbTJpoXWOpd2ax6O2dtoV26B3YzvvnO1NpbH2EQrRLcY0scF+rwWRUViA445nVgmhkB95w3uLX+0d3wBqDiZjwFm7Rp130LcmlDd7-3ocEJhldVaJg1rA3W6GVJlwYwTXslcpJO3ZjNOAisitPQATGd+gjw7UMPtI5hu26AHYczfR+r9+G2y-uI2h7QGG4AUbXVR0wta5aZmNMG9woa1Lhs7dEDjfpVrBFLEbQ5Ey5OEfnY7QjxA2C4ASP2GuE7cP5uszyeTzx732fkY55zrnIyqZA9RrdEGroXEZLiXGuQSFGU7sfKINJ3m4yijkMIjL+M2cEwp4TkTAsubcy+yTLs3YewLbl29vmSOFac8VkLYc1OgYi3q+j35vRMfOCxzJcl7TUvUtfUIOxE1WeZfIHzlQ-O8lwGRjKKq-jsvnovKbBA-PxLWoxrjxIYisY8Qm+Gy4PQ+FLABYo43WohkGv8Dlx1Tr4sFKqMA6pNSQHiakb81F3B+UuHuLS2zaQxCZNF20jIAmcLu0qZ7j3-igg1Y5jUsAtTgobIuGascrTncWsfYInhgJFnAV6JkUQ0gQ9xVDwUTCNRgFh8geHiO3vak09uryaPponrmtjrSQ3aTuCJL4i9ZPLtc0Ccw76lP-gw55UqanYAXtI5RyzyL40rhVgCkWIIFE-K9JcDRE4JJKzJLO4ye4IuEFcqFEdWXCO6dy4V0zlpVxczgTV1aG4ERGIuErApA2RYNKURgiUU8vBolwFRLJmobX62rAALQds1rH2DzzwGUSJPSQ8AT+iKuINHujaw4IG9CCSBNRJnp9eusWasekIi0L8eEAJAlBR54DXOBPhw40nAioyO4tpCT+nN-fJvt4hLKhb5mT0CkLjA-JJxluIDlKKXWFaIktY4Jm8+Vdq8iUC7JSkLZcfZFwGhW-BFYh0Vheb9F5ww-V1chsXR5zrHC0Ad+AoSa7I5w1JjavwgzhJMp5zFA5P5RZb8Y4RtqUPAoCWRzhY5U5gIe5vRMgCRwFYEmUt9EEfZiYP5rZtBS5y4IAwDPxSwdZohwF9xgJIgI1j5KJPBaoKxiFwE25stI9PosDwwX1l5+YZ5QDZZWcFZ1xH9Zpn82JNlKxTg-RgoE0UgSQN90Dr9cUhAUEiDoMbhT98QuN8wggcdDge8ThSRao5o41Y5chilxclQVCEl7pY5cZWk0lLgksmJwJfdnR-dGRA9swzDpFSllC+CVdPwGRfI697QKIaF3RqCsl3AFx081xNdMgvRL95CEEfk-kFlLCsgH8aEkDQgVI-AdDoMEDG07gSRnRMZeN5VYAc90jsxPAmQcgGRrRchIh8jyIVJYs8hapUhtDG1kM7NLCAItJrQBl1EshmITteihN-NM0n14A-D2sEAohj0PBaQqEkD8gg9B8BMatps6tlNZjdUY9EAjJhj3AKweMIgyxNZ3QYg+crhdhvQ8RwIJj8spiOAGtgtCC5jDinQT4e4aFohMhgo-wHRksKJqwg1tCZCPBnjaseRYBYlMBNQFtkolsOBLDgh9xFJwI9JL0UCrQtJKxTQg1iRcY9s3QYSdjkI5t+xkSkRMVLCAgqw-xlJPQ21XBCwCTMSfQbhpCAgogxsSggA */
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
          | { type: 'backToSavedPoFromCamera' }
          | { type: 'backToBeginningStateFromSecondStep' }
          | { type: 'backToBeginningStateFromThirdStep' }
          | { type: 'goToSecondStepFromStepOnePressed'; value: number }
          | { type: 'goToThirdFromStepOnePressed'; value: number }
          | { type: 'goToStepOneFromStepTwoPressed'; value: number }
          | { type: 'goToStepThreeFromStepTwoPressed'; value: number }
          | { type: 'goToStepOneFromStepThreePressed'; value: number }
          | { type: 'goToStepTwoFromStepThreePressed'; value: number },
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
                  actions: 'assignSecondTimeUsingCamera',
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
                  target: 'addPO',
                  actions: 'closeModalSph',
                },
              },
            },
          },

          on: {
            backToBeginningState: {
              target: 'checkSavedPo',
              actions: 'resetPoState',
            },

            goToSecondStepFromStepOnePressed: {
              target: 'SecondStep',
              actions: 'assignPressedStep',
            },

            goToThirdFromStepOnePressed: {
              target: 'ThirdStep',
              actions: 'assignPressedStep',
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

            backToBeginningStateFromSecondStep: {
              target: 'checkSavedPo',
              actions: 'resetPoState',
            },

            goToStepOneFromStepTwoPressed: {
              target: 'firstStep',
              actions: 'assignPressedStep',
            },

            goToStepThreeFromStepTwoPressed: {
              target: 'ThirdStep',
              actions: 'assignPressedStep',
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

            backToBeginningStateFromThirdStep: 'checkSavedPo',

            goToStepOneFromStepThreePressed: {
              target: 'firstStep',
              actions: 'assignPressedStep',
            },

            goToStepTwoFromStepThreePressed: {
              target: 'SecondStep',
              actions: 'assignPressedStep',
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
            backToSavedPoFromCamera: 'checkSavedPo',
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
            isFirstTimeOpenCamera: false,
          };
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
            stepsDone: [...context.stepsDone, context.currentStep],
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
        assignPressedStep: assign((context, event) => {
          return {
            currentStep: event.value,
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
          const productsData = [
            ...context.choosenSphDataFromModal.QuotationRequests[0].products,
          ];

          const newSelectedProducts =
            productsData.length === 1 ? productsData : [];

          return {
            selectedProducts: newSelectedProducts,
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
