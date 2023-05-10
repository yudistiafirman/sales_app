import { assign, createMachine } from 'xstate';
import { getAllPurchaseOrders, getConfirmedPurchaseOrder } from '@/actions/OrderActions';

const searchSOMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QHsAOYBOBDALgS2QDsACAGz1h2IFssBjACz0LADoAzMHR5qAGQo4AIriwBiCETbMAbsgDWbNJlwES5SjXpMWHLj0L9BInFgSzkdVUQDaABgC69h4lCpksPPiKuQAD0QARkCAVlYADjtIuwA2UIBOKJCAFmSAGhAAT0QAJhCc1hyY8NS88IB2EOCAZgBfWozlbG91QS0DNk5uHSNKE3FMDGQMVlRSXHZh6lYm61bNWg69bt4BPtFzQjkrFudnX3dPFt8AhABaYPDWGOTqkLuYm-DwwLtqjOyEPIKikuSyyo1eqNdDNNRkNqLHRsDQ4PjILAQSBiIgAJTA7AwcAYaxw+yQIEOXjUJ0Q1XK1WugXilXK4WqgUilQ+uRCdlY5WK-0CMVi1XiIRC4WBIFmLQhC20zBhgnhiORRAAooQIOjtJB8W4PMSfATTkVAhzBYFqnYcoFynzAiyENVzaw7I6csl4oy8skSiKxeDYe1oaxBsMAOJcfCGXFiLE4DCZEM4MO9PGOA7a456xBnHJ2MJ2UIxPI2nJFh155JxZ3JQKV+oNECEZBI+AE71ECVUKHSlNHEnp855Sm5kL5kI24IOx25wH0j00mJe0FzNt+6XLAyJ-pdnWEUkIXk2+JXNlO4IVquBHLzlTi30d3SwuVIiCbtOgU488qsU0u27hIf-eL-Da-xXKa5QWiE5TlAeloxCEl5gq2N5SrogYYHGCa4s+PavhmORXOerzxOSI5ZGSkSsPk1TJEK+apGeNa1EAA */
    id: 'search SO',

    predictableActionArguments: true,
    tsTypes: {} as import('./searchSOMachine.typegen').Typegen0,

    schema: {
      context: {} as {
        soListData: any[];
        isLoading: boolean;
        isLoadMore: boolean;
        isRefreshing: boolean;
        errorMessage: unknown;
        page: number;
        size: number;
        totalPage: number;
        keyword: string;
      },
      services: {} as {
        fetchSOListData: {
          data: {
            data: {
              totalPages: number;
              data: any[];
              message: string | unknown;
            };
          };
        };
      },
      events: {} as
        | { type: 'assignKeyword'; payload: string }
        | { type: 'retryGettingList'; payload: string }
        | { type: 'onRefreshList'; payload: string }
        | { type: 'onEndReached' },
    },

    context: {
      soListData: [],
      isLoading: true,
      isLoadMore: false,
      isRefreshing: false,
      errorMessage: '',
      page: 1,
      size: 10,
      totalPage: 0,
      keyword: '',
    },

    states: {
      idle: {
        on: {
          assignKeyword: {
            target: 'fetchingListData',
            actions: 'assignKeywordToContext',
          },
        },
      },

      fetchingListData: {
        invoke: {
          src: 'fetchSOListData',
          onDone: {
            target: 'listLoaded',
            actions: 'assignListData',
          },
          onError: {
            target: 'errorGettingList',
            actions: 'assignError',
          },
        },
      },

      listLoaded: {
        on: {
          onRefreshList: {
            target: 'fetchingListData',
            actions: 'handleRefresh',
          },
          onEndReached: {
            target: 'fetchingListData',
            actions: 'handleEndReached',
            cond: 'isNotLastPage',
          },
        },
      },
      errorGettingList: {
        on: {
          retryGettingList: 'fetchingListData',
        },
      },
    },

    initial: 'idle',
  },
  {
    guards: {
      isNotLastPage: (context, event) => context.page <= context.totalPage,
    },
    services: {
      fetchSOListData: async (context, event) => {
        try {
          const response = await getAllPurchaseOrders(
            context.page.toString(),
            context.size.toString(),
            context.keyword,
            'CONFIRMED'
          );
          return response.data;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
    actions: {
      assignListData: assign((context, event) => {
        const listData = [...context.soListData, ...event.data.data.data];
        return {
          totalPage: event.data.data.totalPages,
          soListData: listData,
          isLoading: false,
          isLoadMore: false,
          isRefreshing: false,
        };
      }),
      assignError: assign((context, event) => ({
        errorMessage: event.data.message,
        isLoading: false,
        isLoadMore: false,
        isRefreshing: false,
      })),
      handleRefresh: assign((context, event) => ({
        page: 1,
        isRefreshing: true,
        soListData: [],
        keyword: event?.payload,
      })),
      handleEndReached: assign((context, event) => ({
        page: context.page + 1,
        isLoadMore: true,
      })),
      assignKeywordToContext: assign((context, event) => ({
        keyword: event?.payload,
      })),
    },
  }
);

export default searchSOMachine;
