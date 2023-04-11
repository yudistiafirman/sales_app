import { bStorage } from '@/actions';
import { uploadFileImage } from '@/actions/CommonActions';
import {
  getCreatedSphDocuments,
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
  isProvidedByCustomer: false,
  lessThanSixValue: '0',
  lessThanFiveValue: '0',
  checked: 'second',
  customerType: 'COMPANY',
};

const POMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EAJmcAWZ5QCsbgGwAOAEYvAHZDAE5-EN8QgBoQAE9EEJDPAGZ-Z38053CcoLSvAF8i+MkcfCJScioaeiZWCA5uPgENMQkMCplq+TrlRo51EWItW14zfUDzJBBkKxs9XnsnBFcc7z8g0IiomPikhB9AyjC0wLS3P0CPQ2cSsq7pKrkqADNBdFhtBm0wZE4ACNcPQACrEABCYCgwl4wigvx0YDM9nm1nGK2SbkMlDSMUC-jcgRCXnOhjcB0Q2TclHCvl8gWcqQZNzyDzmT0qshqlA+Xx+fwBUGI4IYtD4EF+-wAYuhiABbKXIADy-DY6DgBAgKNmaMWdlmqwJzl8lAJITc-l8GS8rl8XkpCEC5Jpl2chi8hkM-h8ISt7PKz258j53yVnGF4NB2E+EFlCqVqrA6s1kB1lnRS0xCFSIVxMXcdzSl184Udzq9tILIQuwWcjIDnJ6r15nzDgsouAgTWVnAIuCk8IYyGw6bmCwxhpcXi8p3tvlybi8gQXhjxjv8-nCuMZgRueOy1rcjakXN67zbAv+ne7bF75AANmA-gBJeW4GBjvWT0CrK5pU5zTcaJol8L0KUSRBnUtM1S3cZc3UuY9Sg5U9mx5UMr2QG8e04YQ0B+EcvwnLMpwQS080uNILTScJ3RCPITUdcJl0AhlsR9W1DECE9uheDDLyVHC704LsIAAWVIMA3w-OBiMzA1f2SNIcTxGtCWJUloMdJlZ2ZLwAhyE1Ch4lDAzPFtMKEsSRMjYgxUwCUlXk-VljI41-EoBc3HCHzwnCPcsnLC5PAM5wEJ9JlfCuXig3PVt+SEsUBxwYdsCBEE6HBABBW9iBcn9HBcQpKCLK4V09LIFzSZjaMoIJ3TpC1nDSWKLIExKO2SqQ0tE7sAGFsGIKwwF4NKCtIpS1hKsqiXtO4rRa5jwlU3cVz3bEQja9D5AcpzBQjSFMvBaVBMFCbFKKtYWO3dTUmLK1aIM8tlxxbJCWZK5S1o7b+N28VeElA67OjWNnJMVESMu1Y6J06kzXJFcvR8aiLl+4MqD2wHw2BMFIWhWEh20JF40VAGgf+C63Kmk0WNOIlIjCLcTWcZislKn0WOotcvH89H4qximhRFezBSTUmlVBAB3YgU1gLUqezLI8UAqIWoya0WN8YLbVOFjAnCMI7j9EJWrMps-sx8nwzsyXsA1MAJcFaXZY1eW0wh3Uoepq7ldNO71cerXywC006PKt0Zx9M3HjQy3KEFoSYG0XReAREcABFRlQeVRu0WAWn4IQRnEShzJ2q3HOxjtk9T9PsCzzAc7z2Bhk0HQlkmT2M1c7MMhuM1wqXf86RqyCnSyHFGKZcluLuXz+ZbROa+fOu0sb5veHzzgKDlKhkAfHQ3lIeUy4tjGE+tleU6HTPs9zrfW-aMZO5MRWyOLcK515-c-Bu8tJ60iMmEbEzpFyLx5Mva869755wADLEC7JATgqAD6IIgPCd+U1sT0nqpaYIfhuJXFNgA7ilAlwGXOB4KKED-pVyFpQXepAADiq94QbwftvDU2h0AJFYTfNOHC85YKujkFWakVJ0h9OSOI48LgWlxNHQy84wJbXNnHC+UDsKCAgE+CMz4YFN04SI1YYjTQSIiAET0wFgrFlpAxVwhgLReGZmo2OfFNFX2vDovRydDGb20FMGYPdCqmJauYmIkirEyOCoSchDEVwMnrP5XwtCqCgzIDbI6eMtEmKpKzceuRQjeGgk4gKa4rjIXcXFFsGShaHXBBwb4HA8lHAKYccJOJ5qRGJAxfEaTKB1JxsdfGMJeBwjToiP4pMhnnW7uOBSPtViuFcJsAIwQwiM32HIw2Yd3BEkji40kAzZn-AaaLf44s5SKmdvbMAyY3YK3md+SaV0rjbgqsuIIpsiyyI6TWE4JItyFBWsWRk9x1EePiqc4WopnYyydv8aMDs5ZPOCQs3uZFKlzhYu8q0NwIgQQ6VuTyc9lyBRUpxE5MZMkdh8WAPsYAnyYG0OqYgEBUAstaRkdIILsQuPVsBMehwqEnFHh4UsFxPTkmpWDOluiGV8EGrgNOYAACKqAVW6G0AkVp-LKDunOD4NwGQTWG0dCpJcJS1x0mtNxS4AziDIFGv1XAud0C4D6hAGSMBYCtIXOWDYXovTrWyHuaOjrnW8Fde6z1uM6CkxjRQXArTbQbhOH5FJQQLiWiJJGl1brk0ZRySoJoxBE2Fo9a0lZoUtgbN2CBR0DNyFaVyAChkAzpANFUOcrREtS3VtLHpBmURvR0QDXIqKBqtyGHtP5VwQRO34G7WW85ML+2NEHXTC0BtR3MwnYcEkeYcHhQYlEG44Ul2wBXc0TAGokQADkwBSxac872SsZx5hWqkLIVxvQej+YgBcpo-CELEdRS4xRIU1J5E01lFtlSvGLVlYgL44S6FwA+KZyI32LOzASAkXl3C+X8gFRk-haoZoNiaaO-huIuIGXBtgCGWxom0D6uAhc2gl06Bo+KTGWM8jYxxp+IwX4GDfrhzFU0VIgYCCSYsfTZ1lkKcp8hwEtykgiKSJkjGrDwbjohoT+mRNceLqIUu5d44CcM6xkz75fVt1GB3CTphpiQzwx-Wd5D5OkmonSZT5Z7qlXmkcvItFXB6eaYJ+QwmHOcaYfvQ+2hj7oFPlZi+Nm+JGdi-Z2Son27jC7uil50MgPtMQDkGcVZCj4ukf+KLBnst2e+KdJ8BceBF3aJZ8+-H9PMds8Z1rgh2tOfExMSTJX31kQ+hzFxYaQKkh0h6WcBs-TvWCDaqpqEoUtiy88HL+99NtYS+gPeZdkupfS71vb-WYtHeG6N5+LmJumCk6EqCmRPLeRI-5QKFHVPRDNIbTc-dPS0W2xlvr0XBu5eabLXACQHzoLM913ju3YN3dhw91lCOkfoLGy94rHnpNXVrOkXmuRonRRIXIqININK8yajkMIplqntXkPtyoh2y79bx8jrsO8zukAu0fE+Z8+O3Zh81obuO2CI4FxAQnRXJsk4+wgWb3p5vnEW8Kz79oDWhycaEHY-hGsDZlyGXAI3+r3r+Ku7hvCucEEO60zXPpQfEhiEtnZLj6bARW9iYsLEBmjQAI6oE+MmEUCRnWcCdaNeESaq3vdecslI24x2RFnT4HwPpHQzgzdkA8yMLR3FlbS7xCq+xSxsDgeEklAQjcEAALxewANUw6gHDU3PPYKuDinTK3oiEgtZ-WkuR4J7HC24nbMH5AwqENXpVeBVWN+b238Y6pBCYB72rtPxU9J7mJHiW0Jqh5j9SN4Xm9qoi8xyKk9kvB2VwFRDdmo++ysIAALQqcON-00YNcCaIPEckQvAZfoG9YgT-JZFwbiQFUIEkFxIkZGPXBAUOHccKCIA2KOcIAZKyQUGA7MHyDcMhBqcNbEbEd0KDdnCuBKdsa8GyZUIgsiT0TyC4AsckEHfBYKHyIjFqK0IkPcbiCFWg+OAg6BMAFKbANKFgqac1cePIPMBqSxZqGOOfDnSufaf4OQ32LWVWe6DWJ6bWORckEDBJM9W1UsM3aDTQy+ehJONhSZO+IxFuXQ0xE3A1Dwbwlkc4YsABBichb0TIAkQ2WfKHJeLxbCfxThBBJBCAdwxAIPKeaIQ2OiBiSIAHQ4C4O4WkYIyxQ2QhNnDQugrRRhYXdAfhOuIRR+RIhAFSckAwwOTWZ6ORDIW6P0aqFxFIEkUQko+OMo+lOoqhZQ-EUHBcIIEw7I90E4UkUFK0OjT+PA2wugmFOo80QCPcU2e0dwKrIlFwFiUlZ0Wic0AKaiSHd-BfGlBhIYr2PvN5BkUqHAlSUIGIaKQIC1GechIpQlMCNkFY+OBPaNStXAOorIAyA1Z0TcUIXyPwKYyrQI2dY2V6TmCHK9KAsEnwD5TcO4GcJcU2QDDXD0LyJxGnKnFSNGAEzLLHS3dAYYv-KCa0WcAyV6EkC4OiZYsQ6k6XA7FrdjeLeAO40nVYKIILDwWkRJYI-IKlKk6HJrXk2XE7QUkJA-BAaKZk7yaEtcCIdcVTGICfP9bPQ8EPWUqXeU7nPkjgeXfHLsdY+Rb4r3TIaqaiB0OnU2HcIITcFcHojwc3e7SgWATlXfeWW3KQ+3DgdYynLyFicKe-UIq0csLcU0T0zSJqUkX000zHHki0jCa3B8UMpEMtOogIbcc4liSxO4eCRMuieqZcJcPYTcP0UPXgCPKPDgUEWPMATEumVGH5RiYeC1GCekOCSIUIDIDIEoEoIAA */
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
          | { type: 'goToStepTwoFromStepThreePressed'; value: number }
          | { type: 'openingCamera'; value: boolean }
          | { type: 'switchingMobilizationValue'; value: 'first' | 'second' }
          | { type: 'onChangeMobilizationPrice'; value: string; index: number },
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
              'enquirePoType',
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

                switchingMobilizationValue: {
                  target: 'idle',
                  internal: true,
                  actions: 'assignMobilizationValue',
                },

                onChangeMobilizationPrice: {
                  target: 'idle',
                  internal: true,
                  actions: 'assignMobilizationPrice',
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
              target: 'enquirePoType',
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

        enquirePoType: {
          on: {
            openingCamera: {
              target: 'openCamera',
              actions: 'assignCustomerType',
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
            const photoFiles = context.poImages
              .filter((v) => v.file !== null)
              .map((photo) => {
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
              .filter((v) => v.value !== null)
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
          if (context.customerType === 'INDIVIDU') {
            return hasFileNotUploadedBefore.length > 0;
          } else {
            if (context.paymentType === 'CREDIT') {
              return hasFileNotUploadedBefore.length > 0;
            } else {
              const hasUploadedNpwpBefore = context.files.filter(
                (v) => v.isRequire === true && v.projectDocId === null
              );
              const hasUploadedKtpBefore = context.files.find(
                (v) => v.isRequire === false && v.projectDocId === null
              );
              return (
                hasUploadedNpwpBefore.length > 0 ||
                JSON.stringify(hasUploadedKtpBefore) === '{}'
              );
            }
          }
        },
      },
      actions: {
        assignMobilizationValue: assign((context, event) => {
          return {
            checked: event.value,
          };
        }),
        assignCustomerType: assign((_context, event) => {
          return {
            isProvidedByCustomer: event.value,
          };
        }),
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
            customerType:
              event.value.QuotationRequests[0].Visitation.customerType,
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
              poNumber:
                context.customerType === 'INDIVIDU' ? '' : context.poNumber,
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
        assignMobilizationPrice: assign((context, event) => {
          const filteredValue = event.value.replace(/[^0-9]/g, '');
          if (event.index === 0) {
            return {
              lessThanSixValue: filteredValue,
            };
          } else {
            return {
              lessThanFiveValue: filteredValue,
            };
          }
        }),
      },
    }
  );

export default POMachine;
