import { getAllVisitations } from '@/actions/ProductivityActions';
import { visitationListResponse } from '@/interfaces';
import { assign, createMachine } from 'xstate';

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
  paymentType: 'CBD' | 'CREDIT';
  visitNotes: null | string;
}

const visitHistoryMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDcCWtUBcAEALdmA9gE4Ce2AtgIYDG+AdmAHSoQA2YAxFbBlPQAUqxKhVgBtAAwBdRKAAOhDJlSF6ckAA9EARgAsADiYAmAMyS9ANgMB2AKwAaEKV3GbJg3Z12Dku8btTOwBOSwBfMKc0ZTwCEnJqOlRGJhhMADV0LCoVNQAhUgFiQgArMBpMAEkITgg1ZmTkQgBrZmisWNgiMkpaBmY0zOUc1XoCotLyqogERsIaEbUpaWWNRWVRjW0EbyMfY0lTHQCnFwQ9SWCmSRsDY+tJAKDQiKisnHwu+N6klMH3xZjQrFMoVaqcMDEYrEJjyNg5ABmJAoTHaHziPUS-VSYAyANyQImoOms3oTQWBOWqyQIHWWE2NO2AFozFd9JJLCdnIhTHodEwbKYDMYDOZ-IEQuFIiA0Z1ugk+sk2vjRgARHJUAAyhCoEEgnDUAGFcFR6DAhtkCdVNNSFEp6WotrojkxTJZgsYHh69J6DKdENZjEw9MF-CKdGKOcEItL6IQ9fAabLPvKfv01vaCU6ECzbEx2ZzHNydvzJGWyzpfE9JcZXjL3nLvlilSx2GAMxtHYyA5J-Qhgnty5JK48JS9pcmMQrfgNcRbMIDxiCptUOw71N2EJZe8WzKZrkOR9Xx28Yimm4qUmjAeqF9rdZA11nNz6TDobt5gm69G67DY+3YXhMP4boGKKwSPHodh1pOXyYpezAAKJQiQADKC6YO2NJ0s+oDMt47gGMEUFHFyZyVmybo2AcgHHlKERAA */
  createMachine(
    {
      id: 'visit history machine',
      predictableActionArguments: true,
      tsTypes: {} as import('./visitHistoryMachine.typegen').Typegen0,
      schema: {
        events: {} as
          | { type: 'assignParams'; value: string }
          | { type: 'onChangeVisitationIdx'; value: number },
        context: {} as {
          projectId: string;
          visitationData: VisitHistoryPayload[];
          loading: boolean;
          routes: [
            {
              key: string;
              title: string;
              totalItems: 0;
              chipPosition: string;
            }
          ];
          selectedVisitationByIdx: VisitHistoryPayload;
        },
        services: {} as {
          getAllVisitationByProjectId: {
            data: VisitHistoryPayload[];
          };
        },
      },
      context: {
        projectId: '',
        visitationData: [],
        loading: false,
        routes: [
          {
            key: '',
            title: '',
            totalItems: 0,
            chipPosition: 'right',
          },
        ],
        selectedVisitationByIdx: {} as VisitHistoryPayload,
      },

      states: {
        idle: {
          on: {
            assignParams: {
              target: 'getVisitationByProjectId',
              actions: 'assignProjectIdToContext',
            },
          },
        },

        getVisitationByProjectId: {
          invoke: {
            src: 'getAllVisitationByProjectId',

            onDone: {
              target: 'visitationDataLoaded',
              actions: 'assignVisitationDataToContext',
            },

            onError: 'ErrorState',
          },
        },

        visitationDataLoaded: {
          on: {
            onChangeVisitationIdx: {
              target: 'visitationDataLoaded',
              internal: true,
              actions: 'sliceVisitationData',
            },
          },
        },
        ErrorState: {},
      },

      initial: 'idle',
    },
    {
      services: {
        getAllVisitationByProjectId: async (context, _event) => {
          const response = await getAllVisitations({
            projectId: context.projectId,
          });
          return response.data.data;
        },
      },
      actions: {
        assignProjectIdToContext: assign((_context, event) => {
          return {
            projectId: event.value,
            loading: true,
          };
        }),
        assignVisitationDataToContext: assign((_context, event) => {
          const sortedData = event.data.reverse();
          const newRoutes = sortedData.map((val, idx) => {
            return {
              key: val.id,
              title: `Kunjungan ${idx + 1}`,
              totalItems: 0,
              chipPosition: 'right',
            };
          });

          const initialSelectedVisitation = event.data.filter(
            (v, i) => i === 0
          );
          return {
            visitationData: event.data,
            loading: false,
            routes: newRoutes,
            selectedVisitationByIdx: initialSelectedVisitation[0],
          };
        }),
        sliceVisitationData: assign((context, event) => {
          let newSelectedVisitationData = context.visitationData.filter(
            (v, i) => i === event.value
          );

          return {
            selectedVisitationByIdx: newSelectedVisitationData[0],
          };
        }),
      },
    }
  );

export default visitHistoryMachine;
