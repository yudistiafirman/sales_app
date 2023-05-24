import bStorage from "@/actions";
import { uploadFileImage } from "@/actions/CommonActions";
import {
    getCreatedSphDocuments,
    postPurchaseOrder
} from "@/actions/OrderActions";
import {
    CreatedSPHListResponse,
    DocumentsData,
    PostPoPayload,
    Products,
    ProjectDocs,
    UploadFilesResponsePayload
} from "@/interfaces/CreatePurchaseOrder";
import LocalFileType from "@/interfaces/LocalFileType";
import { PO } from "@/navigation/ScreenNames";
import { uniqueStringGenerator } from "@/utils/generalFunc";
import { assign, createMachine } from "xstate";

const purchaseOrderInitialState = {
    poImages: [{ file: null }] as LocalFileType[],
    openCamera: false,
    poNumber: "",
    sphCategories: "",
    choosenSphDataFromModal: {} as CreatedSPHListResponse,
    isModalContinuePo: false,
    loadingDocument: false,
    errorGettingDocMessage: "",
    selectedProducts: [] as Products[],
    files: [] as any[],
    paymentType: "",
    currentStep: 0,
    stepsDone: [],
    postPoPayload: {} as PostPoPayload,
    isUseExistingFiles: false,
    isLoadingPostPurchaseOrder: false,
    isFirstTimeOpenCamera: true,
    isProvidedByCustomer: false,
    fiveToSix: "",
    lessThanFive: "",
    checked: "second",
    customerType: "COMPANY"
};

const POMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QAcCuAnAxgCwIazAAIB7dCMdAOhzEwGsBlXAN0gAViBiCYgOzEoBLXs2J0BaLHgIkyFatlqMW7YgmGjMuAC6C+AbQAMAXSPHEKYrEG6+FkAA9EAJgCMhygBYArAE4AzAAc7s6B3oGeroEANCAAni4AbK6ulM4A7K7pvr6eYene6YkAvsWxkjj4RKTkVDT0TKwQHNx8AhpiEhiVMjXy9cpNHOoixFq2vGb6ruZIIMhWNnq89k4Iic6xCQj+iemBXoneiZ6+zmeBhuml5d3S1XJUAGaC6LDaDNpgyJwARrj0AAqxAAQmAoMJeMIoJ8dGAzPYFtYJqtEAVvGlgv5QntPG50p4tohkv5KN5DN5wqFnKFXNibvM7lVZLVKC83h8vj8oMRgQxaHwIJ9vgAxdDEAC2wuQAHl+Gx0HACBAEXMkUs7HM1ujMXScQT8YT4ogsZQQoF0gTXIVnN5-AyKvcWfJ2e9pZwecDAdhXhAxZLpXKwAqlZBVZZkctUQgCRjadjArjDUSEK5zr4vAVAudXJ5EkF7WVGVJmX1nq83VzKLgIM0ZZwCLgpNCGMhsOH5osUVqXOkPEVbVd-P4oolDL4U8cM3ncsO-IZ-D5C7cS71HmyK5zvtXa2x6+QADZgL4ASQluBgHfV3dAax8B0SiQt2T22dcOW8KfS-gzoXHT-8dJqWuItHVLddXS3ZAdzrThhDQD42yvLsox7BByWcNJfEMR9fD8bxnF2GJjXWPFKF8DZCMItNQkTB0mTXVlIOlGC904GsIAAWVIMAzwvOBkMjTVb0QfxvE8LwAn2XCnwtVwU2HXxUlzJ8ijTRNnApejVweJjNxYji2M9Yh+UwQVpUEjUVjQnV431PEsiNbZsOnNwjgpbIlPHbSel0l19KrfkmxwVtsD+AE6GBABBXdiEsm9HBcclKEMHDnFwyIHOSFNkgzXJPE8ccCoyEcQJXXznXLDkWKCqRQvY2sAGFsGIKwwF4UL4tQkSEEHFK0oy3M3Pkki9g8SIAjCc5vBSbMfKdMtKFM8yuQ9UEIuBEUAu+LrhMShACsSSgIkSC5AjwmaJxItwInIu1DBSNTUoiebwNZZbeCFVbjO9X0LJMREUL2tZc0MCSHuOQq9iGqIUzpM4yTTIICoIikglexj5A+r7vnCoFQXBSEW20OF-SlAVPv+2YIys6N-ApDEznJK1CiiJzEFnShALCVLjjtXxvwxvyqGx91jMDfgyelQEAHdiBDWBlV26yeqAhT0rNRNAkCIIjjOZwhcqpaKZx7leRMrlvUVMApctuWFaVgG1SBlX9rpAkUutE4cMyBziO2FIFzJY4cNOPxTkfQ3FtFqsYG0XReBhNsABExlQCV2u0WBWn4IRRnESgwMxkWTZYuOE6T7BU8wdPM9gEZNB0ZYpidmmErWW0BcoPZyR8Dzwiu5zzq5vxToiSlCjBqP1xj7dy5bFO04z3gs84ChxSoZADx0J5SAlQuGOF42zMp2Pjwr0Lq9rlf646cZm5MZXozcccuYtSkBbcEcKRTXxh7Eiif8fCUj7J4ae71S6BUXjXZe2gAAyxAayQE4KgLeiCIDQifmhUIyVhxZjOLiQwmwSIuTumJd8BDswlFAofI2s9oLr1IAAcXPtCK+sDs6Km0OgOILD45sKXpnLBPVNKaRSouQq+xxJSM-CRdw2Zu77B8BsVw7kTjgKxpA7cggIBHg9MeS+giV7CP2qIjwC4CpXDCJ4GRKYIiYWOGOChADQhgJoTpOhWjoI6L0XHQxMChEzEBkJV2HciHmIkVY6RYRZHbHOqSMG45bQ5mRoEDRVBfpkDFutfG9CTEg2Rp7SGPsYb+0QCkHIx0CQ62CIRJ86V0mUEyabNawIODvA4Pk8puxwZeyhr7G6KZNLa27ouEcf5IhZEac07JbSrDaE6UE52ITozu16cU6Gfs4aJlSNrPEuQ9mZEKNMn0WTvrm3aQsuKzhqadhWWhOkuw0iqLyPTICtI4YAX6kcfCYMeneBOX9Va-x8ZgghLwKEidYRfDJjMrkXTUw9KKd7TZgy5FoxSsEB6OzsWArObjcWXIgy22+FbMAwZFSKzDK3O5tMbLEIDp4EcZIfwCyAtmTSlo8UtMJaSuWJLkBkopaGFUNLrzdTdj+dZKKBmwzkecI675dgpFCNJOa7iKqLThdo3RYAGxgCPJgBZ4oICoCNQi9w2QR7WnCAUM4uR0hw2OAcGapw3A2PShENJGqFrrm1d43VnA+DNVwInMAABFVAobdDaDiBakIaR0qnXfPsNMeQ4YerNBRXMOtDARD-suYsmq-WnNNkIQNsAZY2BwNCbivxBAHkEAALybnwAAargA8qB4Ripdqsq4ylsL5kAnhE4g9ukFCqd+AouYmVpjKkW31rJ-Xlr0cGvAYa60Nuba23gCpBCYB7bc8VwNylXA8ARGamkZr3UTHDDIGZKSJgen-B66UF1FyPsQZA7VGq4AzugXADUIB8RgLABFSLTjcxktrTI6sbFeAtHkPCeYCKCx9W9eQ37f3-ooEBkFdAyZ-oA7gBFBEhlnHMWmudn9HqNOw7wYjeG8aRRMioZoxAiO4cAxB8SkloOnVknBkiYlCiUHZWmZIURcy+EadIRoqhWkmS8VLdjCKX5eD8EEc04RIhlN6j4VIqaUg+Hec4Aqcn8AKY40p-1qmmjqdSppyaOmIhyu2FRB8SNkiEVyOJSzsBrMtEwIqOEAA5MAMtOm9vuSIpzPgXNELCG5-TGQ7ReBHEqzlT4LMYeLpQS5bBD4ykeCx4EJ4oS6E7dCo9wS6U9VExJIo4RhyEWAeJIZNiMyWjZoBc4hFtaNMK8V9cSJtCgbgDndo+cugeMWsNnSJXWRjYm7fUY98DCPxi-V0xb7jojnplkbI5I7RwwOcdPN5nzrPv83lo+C3fJLfkCt88YGpt51EAXT9RsHv3Ce5veZq2G5jF3VMJZbcJVhLTPtukD1LR4TRkM8cHg6R4h1oVTSs4hvzKK4t0bgPXuTcYZvbe2hd7oH3t9+bOORvLYJ-xNbjcJgt2PX2h5BRSSFVSoVQCybcxOpOGSfEA8-nOuxx02nz35lbSPNnHgucOhfdodTiXeO6fvBl3AYHG3JhbdZ7F0xlJSQjm1oJ0GuQzsIYFqcMGBFVHpQBXdn7NO1dS41w2on6AN6F1J+Tynyv1y-aqP9wu0uPeM5B8zvXdX27lI514VKiTedKX53Io46RjqFRmo+I4-XZNO5VwsyXAOOny1wHEA86D3uK9m8W1kQeCAh7GxwNg5fK81m16D6PyydtrHpkEMkkjEwbFtYkIZ5wM9SOHMqnZdEC+B5d49-HpfW8V6r8Tn3O894Hzmwv1XS-1dXNX+3iAneo+mG27H3qRuuZRETNmwqFvrpUSwrsSi2ZjihHF0X13zxcANsalCy+Bsy4R4QbzAH+3UxvxN3v2SEf3Zl6mxAxB8zxG50XALUaXagAEdUBXhgxeQ4gf0g0f1IUoAmMeNL9IdEACJMJhw6RZp6k7cFIjgjpxJAJU0dYCQgJMDeAcC8COBARCC9UGNoRyDSNwdaUr8NhtkHEMhTh2UghzhSgixeBiByB4A1QA9agY8qCDpf4MQFwchEw-BLgcgP0tD+hFAGh2MOAdDT0dgCgM8wgUMfwdZChYliQyIZ1IhkhChMhzNGlmIuQ7DQlPCUw8hUg-53waRsI8xrRchAjtpoJDIZQQjowCIEkCgKQnw0xL0ECIgL0zDIg7Q+w6REjqpAowBgpsBQo0iHk0wcoshyIxJEkespF89yol1NET5TY6iepHJxpE8ecigU8ECdQok00ghswEj58IEeiy5WEoVoFr4s4+jTExIDh0cR00ZmZ-Bf4LRxMpFbR3xyQxJGl6ElpljYEEEkEIA1iO5ggJIEsJpLRbQdY4YHpUgMgYj6YvIUhHdOjMMS55iqxic+EK52E657i48Rkuck8RiTMPi-5+pn1HxvxHIDZZjuiVodUjxoTUwAgviZx6ZyRtZCg9iSF3BxFLQ8RMpMgAhuVpR8SQhZCr0KRrR6Y705FoiUpMhxw0xZwBZC0qcS0gVcSwBmTrQnCig9hsJzMwYIhPlTp9tdhch8xVIp4sSqAGMxD8Tc00hAJxIMg818w1YRMSoDTkYcIKI8hvVAT8t5MbDiB8TyNroIiUomUhwswFUATF0gSCtF8-tHhmSdQ4Thi+cEC2YJI9Z0oQgmVQhhSLCqBwCm96cwNmTLhOchiFwETU8PM80XV7oAFFx0o8Rv9ccD83dtBNcNCId7DCIZpjo79ToX0iETgztsQzQ8w2j3APJzDd969Azg9l8j8290F8ScRSQNhpjTgC0aQECYijpNJJFYcAhzhEyBz5AUz1xYAzVD1FZACqjgDbCe8r86DNiMI0wHpryFyRwMxTp9gfxr16ZqF7T7shzG8IJ-8DxDy4QOMJyfxkDBxHxsimUKSPNFwPBchSyaRhw9kNy695BsDcDFQBChD8SAF+NpJBNYMRpthdgrVR1CIihMgetCxSggA */
    createMachine(
        {
            id: "purchase order",
            predictableActionArguments: true,
            tsTypes: {} as import("./PoMachine.typegen").Typegen0,
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
                    | { type: "getSavedPo"; data: Record<string, string> }
                    | { type: "goToFirstStep"; value: string }
                    | { type: "addImages"; value: LocalFileType }
                    | { type: "deleteImage"; value: number }
                    | { type: "inputSph"; value: string }
                    | { type: "addMoreImages" }
                    | { type: "searchingSph" }
                    | { type: "backToAddPo" }
                    | { type: "searching"; value: string }
                    | { type: "onChangeCategories"; value: number }
                    | { type: "openingModal"; value: CreatedSPHListResponse }
                    | { type: "addChoosenSph"; value: CreatedSPHListResponse }
                    | { type: "closeModal" }
                    | { type: "goToSecondStep" }
                    | { type: "goBackToFirstStep" }
                    | { type: "goToThirdStep" }
                    | { type: "goBackToSecondStep" }
                    | {
                          type: "uploading";
                          idx: number;
                          value: any;
                      }
                    | { type: "selectProduct"; value: number }
                    | { type: "onChangeQuantity"; value: string; index: number }
                    | { type: "retryGettingSphList" }
                    | { type: "retryGettingDocument" }
                    | { type: "gettingBackDocuments" }
                    | { type: "goToSecondStepFromSaved" }
                    | { type: "goToThirdStepFromSaved" }
                    | { type: "createNewPo" }
                    | { type: "goToPostPo" }
                    | { type: "backToBeginningState" }
                    | { type: "getSphDocument" }
                    | { type: "retryPostPurchaseOrder" }
                    | { type: "backToInitialStateFromFailPostPo" }
                    | { type: "backToInitialState" }
                    | { type: "backFromCamera" }
                    | { type: "backToSavedPoFromCamera" }
                    | { type: "backToBeginningStateFromSecondStep" }
                    | { type: "backToBeginningStateFromThirdStep" }
                    | {
                          type: "goToSecondStepFromStepOnePressed";
                          value: number;
                      }
                    | { type: "goToThirdFromStepOnePressed"; value: number }
                    | { type: "goToStepOneFromStepTwoPressed"; value: number }
                    | { type: "goToStepThreeFromStepTwoPressed"; value: number }
                    | { type: "goToStepOneFromStepThreePressed"; value: number }
                    | { type: "goToStepTwoFromStepThreePressed"; value: number }
                    | { type: "openingCamera"; value: "COMPANY" | "INDIVIDU" }
                    | {
                          type: "switchingMobilizationValue";
                          value: "first" | "second";
                      }
                    | {
                          type: "onChangeMobilizationPrice";
                          value: string;
                          index: number;
                      }
            },
            context: purchaseOrderInitialState,
            states: {
                checkSavedPo: {
                    invoke: {
                        src: "getSavedPo",

                        onDone: [
                            {
                                target: "hasSavedPo",
                                cond: "hasSavedPo",
                                actions: "enableModalContinuePo"
                            },
                            "enquirePoType"
                        ]
                    }
                },

                firstStep: {
                    initial: "addPO",

                    states: {
                        addPO: {
                            on: {
                                searchingSph: "SearchSph",

                                deleteImage: {
                                    target: "addPO",
                                    internal: true,
                                    actions: "assignDeleteImageByIndex"
                                },

                                inputSph: {
                                    target: "addPO",
                                    internal: true,
                                    actions: "assignValue"
                                },

                                addMoreImages: {
                                    target: "#purchase order.openCamera",
                                    actions: "assignSecondTimeUsingCamera"
                                },

                                goToSecondStep: {
                                    target: "#purchase order.SecondStep",
                                    actions: "increaseStep"
                                }
                            }
                        },

                        SearchSph: {
                            on: {
                                backToAddPo: "addPO",

                                addChoosenSph: {
                                    target: "addPO",
                                    actions: "closeModalSph"
                                }
                            }
                        }
                    },

                    on: {
                        backToBeginningState: {
                            target: "checkSavedPo",
                            actions: "resetPoState"
                        },

                        goToSecondStepFromStepOnePressed: {
                            target: "SecondStep",
                            actions: "assignPressedStep"
                        },

                        goToThirdFromStepOnePressed: {
                            target: "ThirdStep",
                            actions: "assignPressedStep"
                        }
                    }
                },

                SecondStep: {
                    states: {
                        gettingSphDocuments: {
                            invoke: {
                                src: "getSphDocument",
                                onDone: {
                                    target: "SphDocumentLoaded",
                                    actions: "assignDocument"
                                },
                                onError: {
                                    target: "errorGettingDocuments",
                                    actions: "handleErrorGettingDocument"
                                }
                            }
                        },

                        SphDocumentLoaded: {
                            on: {
                                uploading: {
                                    target: "SphDocumentLoaded",
                                    actions: "assignFiles",
                                    internal: true
                                }
                            }
                        },

                        errorGettingDocuments: {
                            on: {
                                retryGettingDocument: {
                                    target: "gettingSphDocuments",
                                    actions: "handleRetryDocument"
                                }
                            }
                        },

                        idle: {
                            on: {
                                getSphDocument: [
                                    {
                                        target: "SphDocumentLoaded",
                                        cond: "useExistingFiles"
                                    },
                                    {
                                        target: "gettingSphDocuments",
                                        actions: "enableLoadingDocument"
                                    }
                                ]
                            }
                        }
                    },

                    initial: "idle",

                    on: {
                        goBackToFirstStep: {
                            target: "firstStep",
                            actions: "decreaseStep"
                        },

                        goToThirdStep: {
                            target: "ThirdStep",
                            actions: ["increaseStep", "assignSelectedProducts"]
                        },

                        backToBeginningStateFromSecondStep: {
                            target: "checkSavedPo",
                            actions: "resetPoState"
                        },

                        goToStepOneFromStepTwoPressed: {
                            target: "firstStep",
                            actions: "assignPressedStep"
                        },

                        goToStepThreeFromStepTwoPressed: {
                            target: "ThirdStep",
                            actions: "assignPressedStep"
                        }
                    }
                },

                ThirdStep: {
                    on: {
                        goBackToSecondStep: {
                            target: "SecondStep",
                            actions: "decreaseStepFromThirdStep"
                        },

                        goToPostPo: [
                            {
                                target: "PostPurchaseOrder.postImages",
                                actions: "assignPoPayload",
                                cond: "isChoosenCustomerCompany"
                            },
                            {
                                target: "PostPurchaseOrder.postFiles",
                                cond: "needUploadFilesIndividu",
                                actions: "assignPoPayload"
                            },
                            {
                                target: "PostPurchaseOrder.postPoPayload",
                                actions: "assignPoPayload"
                            }
                        ],

                        backToBeginningStateFromThirdStep: "checkSavedPo",

                        goToStepOneFromStepThreePressed: {
                            target: "firstStep",
                            actions: "assignPressedStep"
                        },

                        goToStepTwoFromStepThreePressed: {
                            target: "SecondStep",
                            actions: "assignPressedStep"
                        }
                    },

                    states: {
                        idle: {
                            on: {
                                selectProduct: {
                                    target: "idle",
                                    actions: "setSelectedChoosenProduct",
                                    internal: true
                                },

                                onChangeQuantity: {
                                    target: "idle",
                                    internal: true,
                                    actions: "assignNewQuantity"
                                },

                                switchingMobilizationValue: {
                                    target: "idle",
                                    internal: true,
                                    actions: "assignMobilizationValue"
                                },

                                onChangeMobilizationPrice: {
                                    target: "idle",
                                    internal: true,
                                    actions: "assignMobilizationPrice"
                                }
                            }
                        }
                    },

                    initial: "idle"
                },

                openCamera: {
                    on: {
                        addImages: {
                            target: "firstStep.addPO",
                            actions: "assignImages"
                        },

                        backFromCamera: "firstStep.addPO",
                        backToSavedPoFromCamera: "checkSavedPo"
                    },

                    entry: "enableCameraScreen",
                    exit: "disableCameraScreen"
                },

                hasSavedPo: {
                    on: {
                        goToSecondStepFromSaved: {
                            target: "SecondStep",
                            actions: "setNewStep"
                        },

                        goToThirdStepFromSaved: {
                            target: "ThirdStep",
                            actions: ["setNewStep", "assignSelectedProducts"]
                        },

                        createNewPo: {
                            target: "enquirePoType",
                            actions: "resetPoState"
                        }
                    }
                },

                PostPurchaseOrder: {
                    states: {
                        postImages: {
                            invoke: {
                                src: "uploadPhoto",

                                onDone: [
                                    {
                                        target: "postFiles",
                                        actions: "assignPhotoToPayload",
                                        cond: "needUploadFiles"
                                    },
                                    {
                                        target: "postPoPayload",
                                        actions: "assignPhotoToPayload"
                                    }
                                ],

                                onError: {
                                    target: "#purchase order.ThirdStep",
                                    actions: "disableLoadingPostPurchaseOrder"
                                }
                            }
                        },

                        postFiles: {
                            invoke: {
                                src: "uploadFiles",
                                onDone: {
                                    target: "postPoPayload",
                                    actions: "assignFilesToPayload"
                                },
                                onError: {
                                    target: "#purchase order.ThirdStep",
                                    actions: "disableLoadingPostPurchaseOrder"
                                }
                            }
                        },

                        postPoPayload: {
                            invoke: {
                                src: "postPo",
                                onDone: {
                                    target: "successCreatedPo",
                                    actions: "disableLoadingPostPurchaseOrder"
                                },
                                onError: {
                                    target: "failCreatedPo",
                                    actions: "disableLoadingPostPurchaseOrder"
                                }
                            }
                        },

                        successCreatedPo: {},
                        failCreatedPo: {
                            on: {
                                retryPostPurchaseOrder: {
                                    target: "postPoPayload",
                                    actions: "enableLoadingPostPurchaseOrder"
                                }
                            }
                        }
                    },

                    initial: "postImages",

                    on: {
                        backToInitialState: {
                            target: "checkSavedPo",
                            actions: "resetPoState"
                        }
                    }
                },

                enquirePoType: {
                    on: {
                        openingCamera: [
                            {
                                target: "openCamera",
                                actions: "assignCustomerType",
                                cond: "isCompany"
                            },
                            {
                                target: "firstStep.SearchSph",
                                actions: "assignCustomerType"
                            }
                        ]
                    }
                }
            },

            initial: "checkSavedPo"
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
                            .map((photo) => ({
                                ...photo.file,
                                uri: photo?.file?.uri?.replace(
                                    "file:",
                                    "file://"
                                )
                            }));
                        const response = await uploadFileImage(
                            photoFiles,
                            "Purchase Order"
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
                            .map((v) => v.value);
                        const response = await uploadFileImage(
                            docsToUpload,
                            "Purchase Order"
                        );
                        return response.data.data;
                    } catch (error) {
                        throw new Error(error);
                    }
                },
                postPo: async (context) => {
                    try {
                        const finalPayload = context.postPoPayload;
                        if (context.checked === "first") {
                            if (context.fiveToSix !== "")
                                finalPayload.fiveToSix = Number(
                                    context.fiveToSix
                                );
                            if (context.lessThanFive !== "")
                                finalPayload.lessThanFive = Number(
                                    context.lessThanFive
                                );
                        }
                        const response = await postPurchaseOrder(finalPayload);
                        return response.data;
                    } catch (error) {
                        throw new Error(error);
                    }
                }
            },
            guards: {
                isCompany: (context, event) => event.value === "COMPANY",
                isChoosenCustomerCompany: (context, event) =>
                    context.customerType === "COMPANY",
                hasSavedPo: (_context, event) => event.data !== undefined,
                useExistingFiles: (context) =>
                    context.isUseExistingFiles === true &&
                    context.files.length > 0,
                needUploadFiles: (context) => {
                    const hasFileNotUploadedBefore = context.files.filter(
                        (v) => v.projectDocId === null
                    );
                    if (context.paymentType === "CREDIT") {
                        return hasFileNotUploadedBefore.length > 0;
                    }
                    const hasUploadedNpwpBefore = context.files.filter(
                        (v) => v.isRequire === true && v.projectDocId === null
                    );
                    const hasUploadedKtpBefore = context.files.find(
                        (v) => v.isRequire === false && v.projectDocId === null
                    );
                    return (
                        hasUploadedNpwpBefore.length > 0 ||
                        JSON.stringify(hasUploadedKtpBefore) === "{}"
                    );
                },
                needUploadFilesIndividu: (context) => {
                    const hasFileNotUploadedBefore = context.files.filter(
                        (v) => v.projectDocId === null
                    );
                    return hasFileNotUploadedBefore.length > 0;
                }
            },
            actions: {
                assignMobilizationValue: assign((context, event) => ({
                    checked: event.value
                })),
                assignCustomerType: assign((_context, event) => ({
                    customerType: event.value
                })),
                resetPoState: assign(() => purchaseOrderInitialState),
                assignSecondTimeUsingCamera: assign(() => ({
                    isFirstTimeOpenCamera: false
                })),
                assignPhotoToPayload: assign((context, event) => ({
                    postPoPayload: {
                        ...context.postPoPayload,
                        poFiles: event.data.map((v) => ({
                            fileId: v.id
                        }))
                    }
                })),
                assignFilesToPayload: assign((context, event) => {
                    const files = context.files.map((v, i) => ({
                        documentId: v.documentId,
                        fileId: event.data[i]?.id
                    }));
                    return {
                        postPoPayload: {
                            ...context.postPoPayload,
                            projectDocs: files
                        }
                    };
                }),
                enableLoadingPostPurchaseOrder: assign(() => ({
                    isLoadingPostPurchaseOrder: true
                })),
                enableCameraScreen: assign(() => ({
                    openCamera: true
                })),
                enableModalContinuePo: assign((_context, event) => {
                    const newPoContext = {
                        ...event.data.poContext,
                        isModalContinuePo: true
                    };
                    return newPoContext;
                }),
                enableLoadingDocument: assign((context, event) => ({
                    loadingDocument: true
                })),
                increaseStep: assign((context, _event) => ({
                    currentStep: context.currentStep + 1,
                    stepsDone: [...context.stepsDone, context.currentStep]
                })),
                decreaseStep: assign((context, _event) => ({
                    currentStep: context.currentStep - 1
                })),
                decreaseStepFromThirdStep: assign((context) => ({
                    currentStep: context.currentStep - 1,
                    isUseExistingFiles: true
                })),
                assignPressedStep: assign((context, event) => ({
                    currentStep: event.value
                })),
                setNewStep: assign((context) => {
                    const newStep = context.currentStep === 0 ? 1 : 2;
                    return {
                        isModalContinuePo: false,
                        currentStep: newStep,
                        isUseExistingFiles: true
                    };
                }),
                disableCameraScreen: assign(() => ({
                    openCamera: false
                })),
                disableLoadingPostPurchaseOrder: assign(() => ({
                    isLoadingPostPurchaseOrder: false
                })),
                assignImages: assign((context, event) => ({
                    openCamera: false,
                    poImages: [...context.poImages, event.value]
                })),
                assignDeleteImageByIndex: assign((context, event) => {
                    const newPoImages = context.poImages.filter(
                        (_val: any, idx: number) => idx !== event.value
                    );
                    return {
                        poImages: newPoImages
                    };
                }),
                assignValue: assign((_context, event) => ({
                    poNumber: event.value
                })),
                assignDocument: assign((_context, event) => {
                    const requiredFileInput =
                        event.data?.QuotationRequest?.ProjectDocs?.map(
                            (val: ProjectDocs) => ({
                                projectDocId: val?.projectDocId,
                                documentId: val?.Document?.id,
                                label: val?.Document?.name,
                                isRequire: val?.Document?.isRequiredPo,
                                titleBold: "500",
                                type: "fileInput",
                                value: val?.File,
                                disabledFileInput: val?.projectDocId !== null
                            })
                        );
                    return {
                        files: requiredFileInput,
                        paymentType: event.data.QuotationRequest?.paymentType,
                        loadingDocument: false
                    };
                }),
                handleErrorGettingDocument: assign((_context, event) => ({
                    loadingDocument: false,
                    errorGettingSphMessage: event.data.message
                })),
                handleRetryDocument: assign((context, event) => ({
                    loadingDocument: true,
                    files: []
                })),
                closeModalSph: assign((_context, event) => ({
                    choosenSphDataFromModal: event.value,
                    isUseExistingFiles: false,
                    selectedProducts: []
                })),
                setSelectedChoosenProduct: assign((context, event) => {
                    let newSelectedProduct;
                    const isExisted = context.selectedProducts.findIndex(
                        (val) => val.id === event.value.id
                    );
                    if (isExisted === -1) {
                        newSelectedProduct = [
                            ...context.selectedProducts,
                            event.value
                        ];
                    } else {
                        newSelectedProduct = context.selectedProducts.filter(
                            (val) => val.id !== event.value.id
                        );
                    }
                    return {
                        selectedProducts: newSelectedProduct
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
                                    name: `PO-${uniqueStringGenerator()}-${
                                        event.value.name
                                    }`
                                }
                            };
                        }
                        return { ...v };
                    });
                    return {
                        files: newFilesDataValue
                    };
                }),
                assignPoPayload: assign((context) => {
                    const { QuotationLetter } =
                        context.choosenSphDataFromModal.QuotationRequests[0];
                    const totalPrice = context.selectedProducts
                        .map((v) => v.offeringPrice * v.quantity)
                        .reduce((a, b) => a + b, 0);
                    return {
                        isLoadingPostPurchaseOrder: true,
                        postPoPayload: {
                            quotationLetterId: QuotationLetter.id,
                            projectId: context.choosenSphDataFromModal.id,
                            poNumber:
                                context.customerType === "INDIVIDU"
                                    ? ""
                                    : context.poNumber,
                            poProducts:
                                context.selectedProducts.length > 0
                                    ? context.selectedProducts?.map((val) => ({
                                          requestedProductId: val.id,
                                          requestedQuantity: val.quantity
                                      }))
                                    : [],
                            totalPrice
                        }
                    };
                }),
                assignSelectedProducts: assign((context) => {
                    const productsData = [
                        ...context.choosenSphDataFromModal.QuotationRequests[0]
                            .products
                    ];

                    const newSelectedProducts =
                        productsData.length === 1 ? productsData : [];

                    return {
                        selectedProducts: newSelectedProducts
                    };
                }),
                assignNewQuantity: assign((context, event) => {
                    const filteredValue = event.value;
                    const newQuotationRequest = [
                        ...context.choosenSphDataFromModal.QuotationRequests
                    ][0];
                    const newproducts = newQuotationRequest.products.map(
                        (v, i) => {
                            if (i === event.index) {
                                return { ...v, quantity: filteredValue };
                            }
                            return { ...v };
                        }
                    );
                    const newSelectedProduct = [...context.selectedProducts];
                    const newQuantitySelectedProducts = newSelectedProduct.map(
                        (v, i) => {
                            if (i === event.index) {
                                return { ...v, quantity: filteredValue };
                            }
                            return { ...v };
                        }
                    );
                    const modifiedQuotationRequest = {
                        ...newQuotationRequest,
                        products: newproducts
                    };

                    return {
                        choosenSphDataFromModal: {
                            ...context.choosenSphDataFromModal,
                            QuotationRequests: [modifiedQuotationRequest]
                        },
                        selectedProducts: newQuantitySelectedProducts
                    };
                }),
                assignMobilizationPrice: assign((context, event) => {
                    const filteredValue = event.value.replace(/[^0-9]/g, "");
                    if (event.index === 0) {
                        return {
                            fiveToSix: filteredValue
                        };
                    }
                    return {
                        lessThanFive: filteredValue
                    };
                })
            }
        }
    );

export default POMachine;
