import { getAllPayment } from "@/actions/FinanceActions";
import {
    getAllDeliveryOrders,
    getAllPurchaseOrders,
    getAllSchedules,
    getAllVisitationOrders,
    getTransactionTab
} from "@/actions/OrderActions";
import { BatchingPlant } from "@/models/BatchingPlant";
import { uniqueStringGenerator } from "@/utils/generalFunc";
import { createMachine } from "xstate";
import { assign } from "xstate/lib/actions";

const transactionMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QBcBOBDAdrdBjZAlgPaYAEAtngBYGZgB0MyAKhtnoSfQDZHoS0orLDnzFMAYggkGtAG5EA1gzQiO4itVoMmw9mK69+gvaM6YE8ornTmA2gAYAuo6eJQAByKwC59yAAPRABmYIA2egB2MIBWMIAmAA4ATniHVMTggBoQAE9EABZEgvpkmOCHMODI0MSqgEZggF8mnNV9c01cGjpGMBY2M3EePgFMIUH1EgkwVFQiVHoPblsAMwXyenahki6enX7TKcwR43GjgwsrG3tnV38vHz8kQJC4qNiElLSM7LzENL1egFZKg2KRAqRNIxMotNqTS57bR9AZqS5bXIeMAAGVGkBRF3MsAAQuhYGAAPKYZiYsBSGT0KzKLYIzqUbrI3Ss4bIWm4-j4rloomk8lUmlYyyYBQ3cSue4vR6+cT+IIIYoReKfArBRIOSI1Ar1HL5BAxeLBehhSLJML1eJQyL1ZL1MJwkDbY5I3pCjo8vl4iAE7kkElkynU2kzOYLJYrZDrVCbT2I9n7YPC-1Y-kQQWHEPYUURiVgKUy2xyu7OB7eZUkVWIeoFIr0Bz6xpai1hEF-U31BzxeL0epQ0IFGIxfthW3ulNsrQ+-OZri87OBlnLzA5yASEgAUUwEAASmBqJAFZ5a89QGrMg5h4lIpP7WE267IibEHbIsPgg7+06upFJEs4Ft6Byon6K4BgKQZzuI24QLumAAMJUFgMAlheIBKterzqhUD5PvUL5vtan4IIB9AxIkNFpHUEI6jEoGbuBGZQScq44uu8EkIhEioGAqyCbAPRQNiBCwMg2G4SqLy3oR9SPs+WpkR+-zqv2ra6skwT9vE-a6sxrQemBaackuHEYmusEbhx-EAEZ4IozBEAA4pZOzYDJV5yTeIQFBE0RxEkqTpEkvYBUOg6xA4dQxJElRxG6Jm8WQ5mLpBXnWdxtmzPMqAecghDnLShLiLAAn9KguRFSVQhlQWsA+U8fn4U2NFWt2+qpDUwRlGEFF2iUDh-k66ROiRmQsRxbG+tl+ULHVJiNZulWCWgtX9PV5Whi1daYA2CDBO8wVfGFvwUfUMT3qCoJ1IkSkASkLQmZgRC5vALxpeBNatfW8mIAAtPEBQUSDI1tg4zp6pUrrWjNXlzZ5xx-QdR2g0NlogmCiSg82Rq2il8KsRlEG7ScRhjBMm5o3hapQld5TDjjT41NdCWxIjXpk+x2VcYhdNtWq5Q-gZI5486oNKfEFE6hEI62qDYSS6E3Opgu5MFjliF88cYZipGWJCwD-nqu8ML9RU0RGgayQUckT70BUunRKEjvxMZJOzbz83HDrPEFoLiq+ab+E0TE9Di5EkupEaeMUTCkdxWEsQWmk440er84cplFMB3lMaFdtK1YhTX2Xv9h2AwgI7mvQtG6WUyS0ROA5DeO1GpK+JG9Uk2caL7KPootxfFaXYDlyb1dm6+Q5-qNL4VC7TPJNRmR6an-UJAUFqvU0QA */
    createMachine(
        {
            tsTypes: {} as import("./transactionMachine.typegen").Typegen0,
            id: "transaction machine",
            predictableActionArguments: true,

            schema: {
                services: {} as {
                    getTransactions: {
                        data: { data: [] };
                    };
                    getTypeTransactions: {
                        data: any[];
                    };
                },
                events: {} as
                    | {
                          type: "onChangeType";
                          payload: string;
                          selectedBP: BatchingPlant;
                      }
                    | {
                          type: "assignSelectedBatchingPlant";
                          selectedBP: BatchingPlant;
                      }
                    | { type: "onEndReached" }
                    | { type: "refreshingList"; selectedBP: BatchingPlant }
                    | {
                          type: "backToGetTransactions";
                          selectedBP: BatchingPlant;
                      }
                    | {
                          type: "retryGettingTransactions";
                          payload: string;
                          selectedBP: BatchingPlant;
                      }
                    | { type: "retryGettingTypeTransactions" }
            },

            context: {
                routes: [] as any[],
                size: 10,
                page: 1,
                selectedType: "SPH",
                transactionData: [] as any[],
                loadTab: true,
                loadTransaction: false,
                isLoadMore: false,
                refreshing: false,
                errorMessage: "" as string | unknown,
                totalItems: 0,
                batchingPlantId: undefined as string | undefined,
                isErrorType: false,
                isErrorData: false
            },

            states: {
                getSelectedBatchingPlant: {
                    on: {
                        assignSelectedBatchingPlant: {
                            actions: "assignSelectedBP",
                            target: "getTransaction"
                        }
                    }
                },
                getTransaction: {
                    states: {
                        loadingTransaction: {
                            invoke: {
                                src: "getTypeTransactions",
                                onDone: [
                                    {
                                        target: "typeLoaded",
                                        actions: "assignTypeToContext"
                                    }
                                ],
                                onError: {
                                    target: "errorGettingTypeTransactions",
                                    actions: "handleError"
                                }
                            }
                        },

                        errorGettingTypeTransactions: {
                            on: {
                                retryGettingTypeTransactions:
                                    "loadingTransaction"
                            }
                        },

                        typeLoaded: {
                            states: {
                                getTransactionsBaseOnType: {
                                    invoke: {
                                        src: "getTransactions",
                                        onError: {
                                            target: "errorGettingTransactions",
                                            actions: "handleError"
                                        },
                                        onDone: [
                                            {
                                                target: "transactionLoaded",
                                                actions:
                                                    "assignTransactionsDataToContext"
                                            }
                                        ]
                                    },

                                    entry: "enableLoadTransaction"
                                },

                                transactionLoaded: {
                                    on: {
                                        onEndReached: {
                                            target: "getTransactionsBaseOnType",
                                            actions: "incrementPage",
                                            cond: "hasNoDataOnNextLoad"
                                        },

                                        onChangeType: [
                                            {
                                                target: "getTransactionsBaseOnType",
                                                actions: "assignIndexToContext"
                                            }
                                        ],

                                        refreshingList: [
                                            {
                                                target: "getTransactionsBaseOnType",
                                                actions:
                                                    "refreshTransactionList"
                                            }
                                        ],

                                        backToGetTransactions: {
                                            target: "#transaction machine.getTransaction.loadingTransaction",
                                            actions: "resetProduct"
                                        }
                                    }
                                },

                                errorGettingTransactions: {
                                    on: {
                                        retryGettingTransactions: {
                                            target: "getTransactionsBaseOnType",
                                            actions:
                                                "handleRetryGettingTransactions"
                                        }
                                    }
                                }
                            },

                            initial: "getTransactionsBaseOnType"
                        }
                    },
                    initial: "loadingTransaction"
                }
            },

            initial: "getSelectedBatchingPlant"
        },
        {
            guards: {
                hasNoDataOnNextLoad: (context, _event) =>
                    context.page * context.size < context.totalItems
            },
            actions: {
                assignTypeToContext: assign((_context, event) => {
                    const newTypeData = event.data?.map((item) => ({
                        key: uniqueStringGenerator(),
                        title: item.name,
                        totalItems: item.totalItems ? item.totalItems : 0,
                        chipPosition: "bottom"
                    }));
                    return {
                        routes: newTypeData,
                        selectedCategories:
                            newTypeData?.length > 0
                                ? newTypeData[0]?.title
                                : undefined,
                        loadTab: false,
                        isErrorData: false
                    };
                }),
                assignTransactionsDataToContext: assign((context, event) => {
                    if (event.data.data.length > 0) {
                        const transactionsData = [
                            ...context.transactionData,
                            ...event.data.data
                        ];
                        const newTypeData = context.routes?.map((item) => ({
                            key: item.key,
                            title: item.title,
                            totalItems:
                                context.selectedType === item.title
                                    ? event.data.totalItems
                                        ? event.data.totalItems
                                        : 0
                                    : item.totalItems
                                    ? item.totalItems
                                    : 0,
                            chipPosition: "bottom"
                        }));
                        return {
                            loadTransaction: false,
                            isLoadMore: false,
                            refreshing: false,
                            totalItems: event.data.totalItems
                                ? event.data.totalItems
                                : 0,
                            transactionData: transactionsData,
                            routes: newTypeData,
                            isErrorData: false
                        };
                    }
                    const newTypeData = context.routes?.map((item) => ({
                        key: item.key,
                        title: item.title,
                        totalItems:
                            context.selectedType === item.title
                                ? 0
                                : item.totalItems
                                ? item.totalItems
                                : 0,
                        chipPosition: "bottom"
                    }));
                    return {
                        loadTransaction: false,
                        isLoadMore: false,
                        refreshing: false,
                        isErrorData: false,
                        loadTab: false,
                        routes: newTypeData,
                        totalItems: 0
                    };
                }),
                assignIndexToContext: assign((_context, event) => ({
                    selectedType: event.payload,
                    page: 1,
                    batchingPlantId: event?.selectedBP?.id,
                    loadTransaction: true,
                    transactionData: []
                })),
                incrementPage: assign((context, _event) => ({
                    page: context.page + 1,
                    isLoadMore: true
                })),
                refreshTransactionList: assign((_context, _event) => ({
                    page: 1,
                    refreshing: true,
                    loadTransaction: true,
                    transactionData: [],
                    batchingPlantId: _event?.selectedBP?.id
                })),
                enableLoadTransaction: assign((_context, _event) => ({
                    loadTransaction: true
                })),
                handleError: assign((_context, event) => ({
                    loadTransaction: false,
                    refreshing: false,
                    isLoadMore: false,
                    transactionData: [],
                    loadTab: false,
                    page: 1,
                    totalItems: 0,
                    errorMessage: event.data.message,
                    isErrorData: true
                })),
                resetProduct: assign((context, event) => ({
                    transactionData: [],
                    page: 1,
                    totalItems: 0,
                    loadTransaction: true,
                    batchingPlantId: event?.selectedBP?.id
                })),
                handleRetryGettingTransactions: assign((context, event) => ({
                    transactionData: [],
                    page: 1,
                    loadTransaction: true,
                    selectedType: event.payload,
                    batchingPlantId: event?.selectedBP?.id
                })),
                assignSelectedBP: assign((context, event) => ({
                    batchingPlantId: event?.selectedBP?.id
                }))
            },
            services: {
                getTypeTransactions: async (_context, _event) => {
                    try {
                        const response = await getTransactionTab(
                            _context.batchingPlantId
                        );
                        return response.data.data as any;
                    } catch (error) {
                        throw new Error(error);
                    }
                },
                getTransactions: async (_context, _event) => {
                    try {
                        let response;
                        if (_context.selectedType === "PO") {
                            response = await getAllPurchaseOrders(
                                _context.page.toString(),
                                _context.size.toString(),
                                undefined,
                                undefined,
                                _context.batchingPlantId
                            );
                            response = response.data;
                        } else if (_context.selectedType === "SO") {
                            response = await getAllPurchaseOrders(
                                _context.page.toString(),
                                _context.size.toString(),
                                undefined,
                                "CONFIRMED",
                                _context.batchingPlantId
                            );
                            response = response.data;
                        } else if (_context.selectedType === "Deposit") {
                            response = await getAllPayment(
                                _context.page.toString(),
                                _context.size.toString(),
                                _context.batchingPlantId
                            );
                            response = response.data;
                        } else if (_context.selectedType === "Jadwal") {
                            response = await getAllSchedules(
                                _context.page.toString(),
                                _context.size.toString(),
                                _context.batchingPlantId
                            );
                            response = response.data;
                        } else if (_context.selectedType === "DO") {
                            response = await getAllDeliveryOrders(
                                undefined,
                                _context.size.toString(),
                                _context.page.toString(),
                                _context.batchingPlantId
                            );
                            response = response.data;
                        } else {
                            response = await getAllVisitationOrders(
                                _context.page.toString(),
                                _context.size.toString(),
                                _context.batchingPlantId
                            );
                        }
                        return response.data as any;
                    } catch (error) {
                        throw new Error(error);
                    }
                }
            }
        }
    );

export default transactionMachine;
