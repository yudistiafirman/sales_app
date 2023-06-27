import { getAllVisitations } from "@/actions/ProductivityActions";
import { visitationListResponse } from "@/interfaces";
import { BatchingPlant } from "@/models/BatchingPlant";
import { assign, createMachine } from "xstate";

export interface Products {
    name?: string;
    displayName?: string;
    description?: string;
    properties?: {
        fc?: string;
        fs?: string;
        sc?: string;
        slump?: number;
    };
    unit?: number;
    categoryDisplayName?: string;
}

export interface VisitHistoryPayload extends visitationListResponse {
    products: Products;
    rejectCategory: null | string;
    estimationWeek: string;
    estimationMonth: string;
    paymentType: "CBD" | "CREDIT";
    visitNotes: null | string;
}

const visitHistoryMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5QDcCWtUBcAEALdmA9gE4Ce2AtgIYDG+AdmAHSoQA2YAxFbBlPQAUqxKhVgBtAAwBdRKAAOhDJlSF6ckAA9EARgAsADiYAmAMyS9ANgMB2AKwAaEKV3GbJg3Z12Dku8btTOwBOSwBfMKc0ZTwCEnJqOlRGJhhMADV0LCoVNQAhUgFiQgArMBpMAEkITgg1ZmTkQgBrZmisWNgiMkpaBmY0zOUc1XoCotLyqogERsIaEbUpaWWNRWVRjW0EbyMfY0lTHQCnFwQ9SWCmSRsDY+tJAKDQiKisnHwu+N6klMH3xZjQrFMoVaqcMDEYrEJjyNg5ABmJAoTHaHziPUS-VSYAyANyQImoOms3oTQWBOWqyQIHWWE2NO2AFozFd9JJLCdnIhTHodEwbKYDMYDOZ-IEQuFIiA0Z1ugk+sk2vjRgARHJUAAyhCoEEgnDUAGFcFR6DAhtkCdVNNSFEp6WotrojkxTJZgsYHh69J6DKdENZjEw9MF-CKdGKOcFXjL3nLvlilUxIdCAOK4lRm9WYKicYi4sjpzCZqDZqi22n2glOhBMiPBmwhwWGTyhyxef07QXXSS9yQ6XxPSURaX0Qh6+A02WfeU-fprKsM0DMkXudmcxzcnb8-vGEOWA-eELBGzGGPTjEK34NdhgBcbR2MgOSTvBPZ9-uDiUvaUXr6YxU-lxC0cwJcYQSmap7wddQnwQSwXy3MxTB7PsB0eb8pTeGIZwTQDlWGAky21XVIGg6s4J9EwdBubxgjdPQ3TsGxOzsLwmH8N0DFFYJHj0OxzzjXCAOvZMoRIIsSzLcily0RA62CPQmFFRibEkAx6JuE8-S3HRTyYdlgiM7ijICewRzCIA */
    createMachine(
        {
            id: "visit history machine",
            predictableActionArguments: true,
            tsTypes: {} as import("./visitHistoryMachine.typegen").Typegen0,
            schema: {
                events: {} as
                    | {
                          type: "assignParams";
                          value: string;
                          selectedBP: BatchingPlant;
                      }
                    | {
                          type: "onChangeVisitationIdx";
                          value: number;
                          selectedBP: BatchingPlant;
                      }
                    | { type: "retryGettingData" },
                context: {} as {
                    projectId: string;
                    batchingPlantId?: string;
                    visitationData: VisitHistoryPayload[];
                    loading: boolean;
                    routes: [
                        {
                            key: string;
                            title: string;
                            totalItems: -1;
                            chipPosition: string;
                        }
                    ];
                    selectedVisitationByIdx: VisitHistoryPayload;
                    errorMessage: string | unknown;
                },
                services: {} as {
                    getAllVisitationByProjectId: {
                        data: VisitHistoryPayload[];
                    };
                }
            },
            context: {
                projectId: "",
                batchingPlantId: undefined,
                visitationData: [],
                loading: false,
                routes: [
                    {
                        key: "",
                        title: "",
                        totalItems: -1,
                        chipPosition: "right"
                    }
                ],
                selectedVisitationByIdx: {} as VisitHistoryPayload,
                errorMessage: ""
            },

            states: {
                idle: {
                    on: {
                        assignParams: {
                            target: "getVisitationByProjectId",
                            actions: "assignProjectIdToContext"
                        }
                    }
                },

                getVisitationByProjectId: {
                    invoke: {
                        src: "getAllVisitationByProjectId",

                        onDone: {
                            target: "visitationDataLoaded",
                            actions: "assignVisitationDataToContext"
                        },

                        onError: {
                            target: "errorGettingData",
                            actions: "assignError"
                        }
                    }
                },

                visitationDataLoaded: {
                    on: {
                        onChangeVisitationIdx: {
                            target: "visitationDataLoaded",
                            internal: true,
                            actions: "sliceVisitationData"
                        }
                    }
                },
                errorGettingData: {
                    on: {
                        retryGettingData: {
                            target: "getVisitationByProjectId",
                            actions: "onRetryGettingData"
                        }
                    }
                }
            },

            initial: "idle"
        },
        {
            services: {
                getAllVisitationByProjectId: async (context, _event) => {
                    try {
                        const response = await getAllVisitations({
                            projectId: context?.projectId,
                            batchingPlantId: context?.batchingPlantId
                        });
                        return response?.data?.data?.data;
                    } catch (error) {
                        throw new Error(error);
                    }
                }
            },
            actions: {
                onRetryGettingData: assign((context, event) => ({
                    loading: true,
                    errorMessage: ""
                })),
                assignError: assign((context, event) => ({
                    loading: false,
                    errorMessage: event?.data?.message
                })),
                assignProjectIdToContext: assign((_context, event) => ({
                    projectId: event?.value,
                    loading: true,
                    batchingPlantId: event?.selectedBP?.id
                })),
                assignVisitationDataToContext: assign((_context, event) => {
                    const sortedData = event?.data?.reverse();
                    const newRoutes = sortedData?.map((val, idx) => ({
                        key: val?.id,
                        title: `Kunjungan ${idx + 1}`,
                        totalItems: -1,
                        chipPosition: "right"
                    }));

                    const initialSelectedVisitation = event?.data?.filter(
                        (v, i) => i === 0
                    );
                    return {
                        visitationData: event?.data,
                        loading: false,
                        routes: newRoutes,
                        selectedVisitationByIdx: initialSelectedVisitation[0]
                    };
                }),
                sliceVisitationData: assign((context, event) => {
                    const newSelectedVisitationData =
                        context?.visitationData?.filter(
                            (v, i) => i === event?.value
                        );

                    return {
                        selectedVisitationByIdx: newSelectedVisitationData[0],
                        batchingPlantId: event?.selectedBP?.id
                    };
                })
            }
        }
    );

export default visitHistoryMachine;
