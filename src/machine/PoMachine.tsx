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
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EAJgCMhygBYArAE4AzAAc7s6B3oGeroEANCAAni4AbK6ulM4A7K7pvr6eYene6YkAvsWxkjj4RKTkVDT0TKwQHNx8AhpiEhiVMjXy9cpNHOoixFq2vGb6ruZIIMhWNnq89k4Iic6xCQj+iemBXoneiZ6+zmeBhuml5d3S1XJUAGaC6LDaDNpgyJwARrj0AAqxAAQmAoMJeMIoJ8dGAzPYFtYJqtEAVvGlgv5QntPG50p4tohkv5KN5DN5wqFnKFXNibvM7lVZLVKC83h8vj8oMRgQxaHwIJ9vgAxdDEAC2wuQAHl+Gx0HACBAEXMkUs7HM1ujMXScQT8YT4ogsZQQoF0gTXIVnN5-AyKvcWfJ2e9pZwecDAdhXhAxZLpXKwAqlZBVZZkctUQgCRjadjArjDUSEK5zr4vAVAudXJ5EkF7WVGVJmX1nq83VzKLgIM0ZZwCLgpNCGMhsOH5osUVqXOkPEVbVd-P4oolDL4U8cM3ncsO-IZ-D5C7cS71HmyK5zvtXa2x6+QADZgL4ASQluBgHfV3dAax8B0SiQt2T22dcOW8KfS-gzoXHT-8dJqWuItHVLddXS3ZAdzrThhDQD42yvLsox7BByWcNJfEMR9fD8bxnF2GJjXWPFKF8DZCMItNQkTB0mTXVlIOlGC904GsIAAWVIMAzwvOBkMjTVb0QfxvE8LwAn2XCnwtVwU2HXxUlzJ8ijTRNnApejVweJjNxYji2M9Yh+UwQVpUEjUVjQnV431PEsiNbZsOnNwjgpbIlPHbSel0l19KrfkmxwVtsD+AE6GBABBXdiEsm9HBcclKEMHDnFwyIHOSFNkgzXJPE8ccCoyEcQJXXznXLDkWKCqRQvY2sAGFsGIKwwF4UL4tQkSEEHFK0oy3M3Pkki9g8SIAjCc5vBSbMfKdMtKFM8yuQ9UEIuBEUAu+LrhMShACsSSgIkSC5AjwmaJxItwInIu1DBSNTUoiebwNZZbeCFVbjO9X0LJMREUL2tZc0MCSHuOQq9iGqIUzpM4yTTIICoIikglexj5A+r7vnCoFQXBSEW20OF-SlAVPv+2YIys6N-ApDEznJK1CiiJzEFnShALCVLjjtXxvwxvyqGx91jMDfgyelQEAHdiBDWBlV26yeqAhT0rNRNAkCIIjjOZwhcqpaKZx7leRMrlvUVMApctuWFaVgG1SBlX9rpAkUutE4cMyBziO2FIFzJY4cNOPxTkfQ3FtFqsYG0XReBhNsABExlQCV2u0WBWn4IRRnESgwMxkWTZYuOE6T7BU8wdPM9gEZNB0ZYpidmmErWW0BcoPZyR8Dzwiu5zzq5vxToiSlCjBqP1xj7dy5bFO04z3gs84ChxSoZADx0J5SAlQuGOF42zMp2Pjwr0Lq9rlf646cZm5MZXozcccuYtSkBbcEcKRTXxh7Eiif8fCUj7J4ae71S6BUXjXZe2gAAyxAayQE4KgLeiCIDQifmhUIyVhxZjOLiQwmwSIuTumJd8BDswlFAofI2s9oLr1IAAcXPtCK+sDs6Km0OgOILD45sKXpnLBPVNKaRSouQq+xxJSM-CRdw2Zu77B8BsVw7kTjgKxpA7cggIBHg9MeS+giV7CP2qIjwC4CpXDCJ4GRKYIiYWOGOChADQhgJoTpOhWjoI6L0XHQxMChEzEBkJV2HciHmIkVY6RYRZHbHOqSMG45bQ5mRoEDRVBfpkDFutfG9CTEg2Rp7SGPsYb+0QCkHIx0CQ62CIRJ86V0mUEyabNawIODvA4Pk8puxwZeyhr7G6KZNLa27ouEcf5IhZEac07JbSrDaE6UE52ITozu16cU6Gfs4aJlSNrPEuQ9mZEKNMn0WTvrm3aQsuKzhqadhWWhOkt0Ibe02YMuRwRUiFTOHkO0-M8InL+qtf4+MwQQl4FCROsIvhkxmVyLpqYelFJeQM2Gci0YpWCA9HZWKAVnNxuLLkQZbbfCtmAYMipFZhlbnc2mNliEB08COMkP4BZAWzJpS0uKWkEpJXLYlyBSXktDCqal15upux-Os5FpS4bnCOu+XYKRQjSTmu4iqi1YXaN0WABsYAjyYAWeKCAqADXwvcNkEe1pwgFDOLkdIcNjgHBmqcNwNj0oRDSWqha65NXeO1ZwPgzVcCJzAAARVQMG3Q2g4hmpCGkdKp13z7DTHkOGbqzQUVzDrQwEQ-7LmLOqn1pzTZCH9bAGWNgcDQm4r8QQB5BAAC8m58AAGq4APKgeEoqXarKuMpbC+ZAJ4ROIPbpBQqnfgKLmRlaYyoFu9ayX1pa9GBrwCGmtdbG3Nt4AqQQmAu23LFcDcpVwPAERmppGa91EyyotZSRMD0-4PXSnOouR9iDIHao1XAGd0C4AahAPiMBYDwsRacbmMltaZHVjYrwFo8h4TzARQWXq3ryA-V+n9FB-3AroGTb9v7cDwoIkMs45iU0zs-o9RpGHeAEew3jSKJkVDNGIPhrDf7QPiUkhB06sloMkTEoUSgbK0zJCiLmXwjTpCNFUK0kyXipYsfhS-LwfggjmnCJEMpvUfCpGTSkHwQEaQFWk-gWTrH5O+qU00FTqU1OTU0xEVF2wqIPiRskQiuRxJmdgBZlomBFRwgAHJgBlp07t9yRH2Z8I5ohYRnM6YyHaLwI4FUcqfKZ1DxdKCXLYIfGUjxGPAhPFCXQ7aoUHuCbSnqQmJJFHCMOQiwDxJDJsRmS0bNALnEItrRpeWCvriRNoIDcAc7tHzl0Dxi0Bs6UK6yYbo3b6jHvgYR+kWaumOfcdEc9MsjZHJHaOGBzjo5ucAhh9PnstH1m75eb8hFvnmA+NvOogC5vqNrd+493N7zKWw3MY26phLLbuKsJaYdt0gepaPCaMhnjg8HSPEOtCqaVnP1+Z+W5tDb+09sbjDN7b20LvdA+8Pszcx4NhbuP+LLcbhMFuh6e0PIKKSQqqVCqAUTbmB1JwyT4gHmDMST4McdKpw9+ZW0jzZx4LnDo73aEU7F9j6n7wpdwAB6tyY62mdRdMZSUkI5tZ8dBrkY7sGBanDBgRVR6VvCi4WeL37au634-QBvQuROSdk8V+uL7VQfuF0l67ungOGc6+q+3cprOvCpUSVzpSPO5FHHSMdQqM1HxHB61J67n3Kcq4lx0+WuA4gHnQS9+XU3C2sn9wQQPw2OBsBL2XmsmugcR+WZttY9MghkkkYmDY1rEhDPOKnqRw5FU7LornpXjuC-O6uU30v5eCee53nvA+02-f57uzjovS+W8QDb+H0wG2o+9QN1zKIiZM1fPZr1KiWFdiUWzMcUIDuse76YrgOtjUgtfEsy4R4VrzAB+xU0vyNxv2SDvyGWxAxE8zxA50XDzUaXagAEdUBXhgxeQ4hP0A1P0IUoB6NOMz8wdEACJMJhw6RZp6kbcFIjgjpxJAJk0dYCQgJUDeAMCsCOBARcCdVaNoRiCiMQcaVz8NhtkHEMhTg2UghzhSgixeBiByB4A1RfdahI8yCDpf4MQFwcgcgrR0R7cZ91wBh-NiANDj0dgChU8whEMfwdZChYliQyIp1IhkhChMhztGlmIuQLDQlnCUw8hUg-5r8M9E1PVyoF1-JqoqxDIZQ-DowCIEkCgKQnw0xz178Igz19DIg7Q+w6RvDtpoJaoQo2wEiHk0wcoshyIxJElOspEc9Ii0MS4T5TZyiepHJxo49OcihE978dQokaQfwghxJGj51mjj4Vo55WFIVoFr4s52jTExIDgUch00ZmZ-Bf4LQRMpFbR3xyQxJGl6Elo5jYEEEkEIBFiO5ggJJYsJpLRbQdY4YHpUgMgaQAhxx3AUgjCmictjiCc+EK52E64rjo8Rl2d49ejDNni-5+oH1HxvxHIDZjCIFWiWIfEwBQTUwAhXiZx6ZyRtZChNiSF3BxFLQ8RMpMgAguVpQsSQhJCL0KRrR6Yb05F3xMI+13AZwNgBYxjyci1AUtUjw6TrQbCig9hsJzswYIg4ZcIdtdhch8xVIp4UT0MCChCsTs00hAJxIMgc18w1ZBMSptTkYcIKI8gIjxicsZMWMOAsSSNrogiUpGUhwsw5UfirSbsd9vtHg6SdQISejud782YJI9YsgpTkNI5VSqAQD68adgM6TLg2duiFwoSk9XMc0nV7oAFFx0o8QP8ncg8XdpcsTCIZpjpr9TpH0iEThjtsQzQ8x6j3APJX01D5BYy99F9m90FSzExSQNhsxcgcgdYTMR8KI0g6iocAhzh81+Sa9vSA91xYATV91FY-8wA4RWMsSqCViMI0wHoDz79qIMxTp9gfxL16ZqFfivTlcv8XQf8Dx1zNy7TO9z8vN4DBxHxUjGViTXNFwPBcg8yhiggIhZy2yqB0DMDFQeC+Dty-AeNpI+MoMRpthdgLVh1CIihMhOtCxSggA */
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
          | { type: 'openingCamera'; value: 'COMPANY' | 'INDIVIDU' }
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

            goToPostPo: [
              {
                target: 'PostPurchaseOrder.postImages',
                actions: 'assignPoPayload',
                cond: 'isChoosenCustomerCompany',
              },
              {
                target: 'PostPurchaseOrder.postFiles',
                cond: 'needUploadFiles',
              },
              'PostPurchaseOrder.postPoPayload',
            ],

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
            openingCamera: [
              {
                target: 'openCamera',
                actions: 'assignCustomerType',
                cond: 'isCompany',
              },
              {
                target: 'firstStep.SearchSph',
                actions: 'assignCustomerType',
              },
            ],
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
            console.log('company masuk sini');
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
            console.log('individu masuk sini kalau docsnya kosong');
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
            console.log('ini payload', context.postPoPayload);
            const response = await postPurchaseOrder(context.postPoPayload);
            return response.data;
          } catch (error) {
            console.log('ini error', error.message);
            throw new Error(error);
          }
        },
      },
      guards: {
        isCompany: (context, event) => {
          return event.value === 'COMPANY';
        },
        isChoosenCustomerCompany: (context, event) => {
          return context.customerType === 'COMPANY';
        },
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
            customerType: event.value,
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
