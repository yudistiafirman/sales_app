import { assign, createMachine } from "xstate";
import { getAllDeliveryOrders } from "@/actions/OrderActions";
import { OperationsDeliveryOrdersListResponse } from "@/interfaces/Operation";
import EntryType from "@/models/EnumModel";

const displayOperationListMachine = createMachine(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QHsAOYBOBDALgS2QDsACAGz1h2IFssBjACz0LADoAzMHR5qAGQo4AIriwBiCETbMAbsgDWbNJlwES5SjXpMWHLj0L9BInFgSzkdVUQDaABgC69h4lCpksPPiKuQAD0QARkCAVlYADjtIuwA2UIBOKJCAFmSAGhAAT0QAJhCc1hyY8NS88IB2EOCAZgBfWozlbG91QS0DNk5uHSNKE3FMDGQMVlRSXHZh6lYm61bNWg69bt4BPtFzQjkrFudnX3dPFt8AhABaYPDWGOTqkLuYm-DwwLtqjOyEPIKikuSyyo1eqNdDNNRkNqLHRsDQ4PjILAQSBiIgAJTA7AwcAYaxw+yQIEOXjUJ0Q1XK1WugXilXK4WqgUilQ+uRCdlY5WK-0CMVi1XiIRC4WBIFmLQhC20zBhgnhiORRAAooQIOjtJB8W4PMSfATTkVAhzBYFqnYcoFynzAiyENVzaw7I6csl4oy8skSiKxeDYe1oaxBsMAOJcfCGXFiLE4DCZEM4MO9PGOA7a456xBnHJ2MJ2UIxPI2nJFh155JxZ3JQKV+oNECEZBI+AE71ECVUKHSlNHEnp855Sm5kL5kI24IOx25wH0j00mJe0FzNt+6XLAyJ-pdnWEUkIXk2+JXNlO4IVquBHLzlTi30d3SwuVIiCbtOgU488qsU0u27hIf-eL-Da-xXKa5QWiE5TlAeloxCEl5gq2N5SrogYYHGCa4s+PavhmORXOerzxOSI5ZGSkSsPk1TJEK+apGeNa1EAA */
        id: "operation list machine",

        predictableActionArguments: true,
        tsTypes: {} as import("./displayOperationListMachine.typegen").Typegen0,

        schema: {
            context: {} as {
                operationListData: OperationsDeliveryOrdersListResponse[];
                isLoading: boolean;
                isLoadMore: boolean;
                isRefreshing: boolean;
                errorMessage: unknown;
                page: number;
                size: number;
                totalPage: number;
                userType: string;
                tabActive: "left" | "right";
            },
            services: {} as {
                fetchOperationListData: {
                    data: {
                        data: {
                            totalPages: number;
                            data: OperationsDeliveryOrdersListResponse[];
                            message: string | unknown;
                        };
                    };
                };
            },
            events: {} as
                | {
                      type: "assignUserData";
                      value: { payload: string; tabActive: string };
                  }
                | {
                      type: "retryGettingList";
                      value: { payload: string; tabActive: string };
                  }
                | {
                      type: "onRefreshList";
                      value: { payload: string; tabActive: string };
                  }
                | { type: "onEndReached" }
        },

        context: {
            operationListData: [],
            isLoading: true,
            isLoadMore: false,
            isRefreshing: false,
            errorMessage: "",
            page: 1,
            size: 10,
            totalPage: 0,
            userType: "",
            tabActive: "left"
        },

        states: {
            idle: {
                on: {
                    assignUserData: {
                        target: "fetchingListData",
                        actions: "assignUserDataToContext"
                    }
                }
            },

            fetchingListData: {
                invoke: {
                    src: "fetchOperationListData",
                    onDone: {
                        target: "listLoaded",
                        actions: "assignListData"
                    },
                    onError: {
                        target: "errorGettingList",
                        actions: "assignError"
                    }
                }
            },

            listLoaded: {
                on: {
                    onRefreshList: {
                        target: "fetchingListData",
                        actions: "handleRefresh"
                    },
                    onEndReached: {
                        target: "fetchingListData",
                        actions: "handleEndReached",
                        cond: "isNotLastPage"
                    }
                }
            },
            errorGettingList: {
                on: {
                    retryGettingList: "fetchingListData"
                }
            }
        },

        initial: "idle"
    },
    {
        guards: {
            isNotLastPage: (context, event) => context.page <= context.totalPage
        },
        services: {
            fetchOperationListData: async (context, event) => {
                try {
                    let response: any;
                    switch (context?.userType) {
                        case EntryType.SECURITY:
                            if (context?.tabActive === "left") {
                                response = await getAllDeliveryOrders(
                                    "WB_OUT",
                                    context.size.toString(),
                                    context.page.toString()
                                );
                                console.log("SECURITY-DISPATCH");
                            } else {
                                response = await getAllDeliveryOrders(
                                    "RECEIVED",
                                    context.size.toString(),
                                    context.page.toString()
                                );
                                console.log("SECURITY-RETURN");
                            }
                            break;
                        case EntryType.WB:
                            if (context?.tabActive === "left") {
                                response = await getAllDeliveryOrders(
                                    "SUBMITTED",
                                    context.size.toString(),
                                    context.page.toString()
                                );
                                console.log("WB-OUT");
                            } else {
                                response = await getAllDeliveryOrders(
                                    "AWAIT_WB_IN",
                                    context.size.toString(),
                                    context.page.toString()
                                );
                                console.log("WB-IN");
                            }
                            break;
                        case EntryType.DRIVER:
                            response = await getAllDeliveryOrders(
                                ["ON_DELIVERY", "ARRIVED"],
                                // 'ON_DELIVERY',
                                context.size.toString(),
                                context.page.toString()
                            );
                            console.log("DRIVER");
                            break;
                        default:
                            break;
                    }

                    return response.data;
                } catch (error) {
                    throw new Error(error);
                }
            }
        },
        actions: {
            assignListData: assign((context, event) => {
                const listData = [...context.operationListData];

                if (event?.data?.data?.data !== undefined) {
                    listData.push(...event?.data?.data?.data);
                }

                return {
                    totalPage: event.data.data.totalPages,
                    operationListData: listData,
                    isLoading: false,
                    isLoadMore: false,
                    isRefreshing: false
                };
            }),
            assignError: assign((context, event) => ({
                errorMessage: event?.data.message,
                isLoading: false,
                isLoadMore: false,
                isRefreshing: false
            })),
            handleRefresh: assign((context, event) => ({
                page: 1,
                isRefreshing: true,
                operationListData: [],
                userType: event?.payload,
                tabActive: event?.tabActive
            })),
            handleEndReached: assign((context, event) => ({
                page: context.page + 1,
                isLoadMore: true
            })),
            assignUserDataToContext: assign((context, event) => ({
                userType: event?.payload,
                tabActive: event?.tabActive,
                isRefreshing: true,
                isLoading: true
            }))
        }
    }
);

export default displayOperationListMachine;
