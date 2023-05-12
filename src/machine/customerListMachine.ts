import { getAllCustomers } from '@/actions/CommonActions';
import { ICustomerListData } from '@/models/Customer';
import { event } from 'react-native-reanimated';
import { assign, createMachine } from 'xstate';

const customerListMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCusAuB7AtmATgAQA2AlpoTgIbIAWpAdmAHQBmYGdjUAxBFk2aMAblgDWLNJlwES5DJRr1B7TsqgIRWZFQykBAbQAMAXWMnEoAA5ZYpPQMsgAHogCsAZgBMzAIxujIy8ADjcvABY3AE4PNwAaEABPRGDfZgA2AHYAozdMqMyPINyAXxKEqWw8IjIKai4VDgbeAnwsfGYrYl1WdpxmSpka+UUGllVmzQZRHQcGc3MnGzs5p1cEQqjmfPTgzPTfYPSjcMyE5IQAWg9mDw9fKILPKN908N9wqLKK9CrZWoU9WULAguioABksFQIJAeAIAMK0KgMGAAFSoACNFkgQMt7PoGGtEF5fJlmO8vG4PuEPAc3h5zsSvDdTqlYnsqfdad8QINqnI6kpGCCwZDobDYGAqPhmtjrLZ8Y4cesSWSKVTwjS6TTGQg3AdtqlKfkjiSjJkeXz-iMgcLmKCMBCoTCIHCGABRBgQABKUrokDluIVq2ViHebj84S8JPuXnSccKutJEejUV2qSCHkypIt5V5vyGAsBQsEDqd4tdAl9rHwcFogbxIdAKtJ5N8lOptNeOqSiFpWzc4SMbxpJLTvktBf5ANGwKEEGIYB4E1oABEwQ3gwSiXrvH4ciEwpEYvFewhPkZmJSYplguFQpl9hO81bhoKxsxJdL-a7nJhdCwVCsBgBAABQ5AAlDwr5FrOdpfjKtABqYSxbkqzbuHu-iBIeETRLEupuKEzDBHeHh3l4mRxgUwSTtI042iWLCtO0ADiHB6Ci66OjwtYYPgiSbis26hggRTBCRDy+IERjticByEWSBz3sEXgxO2HhRMEpQ8gwWAwvAOIwTOtpMKhwnoS4iCXOkuqXFEPieJyhxSeRdF-G+xYfiu3DmYqhKiVREZ5AEvi+N4jxGKEupFBGEVGN46RuAE3IvlO1rvnOZZii6flNlZ55eEmHy3FpabBOR3iapq7mFiZTHzoueUiRh56nNs8ZUlEnztkcDJnpytweDSt5RAleTxrVDGZfBUqIZAzWWes7yXgcezpOR6QvPeUSEXeJH6pSd4nLJUVTRlXlzix+DsRgnFQNxVCLQFrWURJ1JRdGuTYeEdnhCRxztreCWZJE8a5mUQA */
    id: 'customer list machine',

    predictableActionArguments: true,

    schema: {
      context: {} as {
        data: ICustomerListData[];
        isLoading: boolean;
        refreshing: boolean;
        isLoadMore: boolean;
        page: number;
        routes: any;
        selectedTab: '' | 'INDIVIDU' | 'COMPANY';
        totalPage: number;
        searchQuery: string;
        errorMessage: unknown;
      },
      services: {} as {
        getAllDAta: {
          data: ICustomerListData[];
        };
      },
      events: {} as
        | { type: 'searching'; value: string }
        | { type: 'onChangeTab'; value: '' | 'INDIVIDU' | 'COMPANY' }
        | { type: 'onEndReached' }
        | { type: 'onRefresh' }
        | { type: 'fetchData' }
        | { type: 'retry' },
    },

    context: {
      data: [],
      isLoading: false,
      refreshing: false,
      isLoadMore: false,
      page: 1,
      selectedTab: '',
      totalPage: 10,
      routes: [
        {
          key: '',
          title: 'Semua',
          totalItems: 0,
          chipPosition: 'right',
        },
        {
          key: 'COMPANY',
          title: 'Perusahaan',
          totalItems: 0,
          chipPosition: 'right',
        },
        {
          key: 'INDIVIDU',
          title: 'Individu',
          totalItems: 0,
          chipPosition: 'right',
        },
      ],
      searchQuery: '',
      errorMessage: '',
    },

    states: {
      fetching: {
        invoke: {
          src: 'getAllData',

          onDone: {
            target: 'dataLoaded',
            actions: 'assignData',
          },

          onError: {
            target: 'errorGettingData',
            actions: 'assignError',
          },
        },
      },

      dataLoaded: {
        on: {
          onChangeTab: {
            target: 'fetching',
            actions: 'assignSelectedTab',
          },
          searching: {
            target: 'searched',
            actions: 'assignSearchQuery',
          },
          onEndReached: {
            target: 'fetching',
            actions: 'incrementPage',
            cond: 'isNotLastPage',
          },
          onRefresh: {
            target: 'fetching',
            actions: 'refreshPage',
          },
        },
      },

      idle: {
        on: {
          fetchData: {
            target: 'fetching',
            actions: 'enableLoading',
          },
        },
      },

      searched: {
        after: {
          '500': 'fetching',
        },
      },

      errorGettingData: {
        on: {
          retry: {
            target: 'fetching',
            actions: 'retryGettingData',
          },
        },
      },
    },

    initial: 'idle',
  },
  {
    guards: {
      isNotLastPage: (context, event) => {
        return context.page <= context.totalPage;
      },
    },
    services: {
      getAllData: async (context, event) => {
        try {
          const { selectedTab, searchQuery, page } = context;
          console.log('ini page', page);
          const response = await getAllCustomers(
            selectedTab,
            searchQuery,
            page
          );

          return response.data;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
    actions: {
      refreshPage: assign(() => {
        return {
          refreshing: true,
          data: [],
          page: 1,
          isLoading: true,
        };
      }),
      enableLoading: assign(() => {
        return {
          isLoading: true,
        };
      }),
      assignData: assign((context, event) => {
        return {
          data: [...context.data, ...event.data.data.data],
          totalPage: event.data.data.totalPages,
          isLoading: false,
          refreshing: false,
          isLoadMore: false,
          errorMessage: '',
        };
      }),
      assignSearchQuery: assign((context, event) => {
        return {
          searchQuery: event.value,
          data: [],
          isLoading: true,
          page: 1,
        };
      }),
      assignSelectedTab: assign((context, event) => {
        return {
          data: [],
          isLoading: true,
          isLoadMore: false,
          refreshing: false,
          page: 1,
          searchQuery: '',
          selectedTab: event.value,
        };
      }),
      incrementPage: assign((context, event) => {
        return {
          page: context.page + 1,
          isLoadMore: true,
        };
      }),
      retryGettingData: assign(() => {
        return {
          isLoading: true,
          data: [],
          errorMessage: '',
        };
      }),
      assignError: assign((context, event) => {
        return {
          errorMessage: event.data.message,
          data: [],
          refreshing: false,
          isLoading: false,
          isLoadMore: false,
        };
      }),
    },
  }
);

export default customerListMachine;
