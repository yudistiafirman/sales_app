import { getAllCustomers, getCustomerCount } from '@/actions/CommonActions';
import { ICustomerListData } from '@/models/Customer';
import { event } from 'react-native-reanimated';
import { assign, createMachine } from 'xstate';

const customerListMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGMCusAuB7AtmATgAQA2AlpoTgIbIAWpAdmAHQBmYGdjUAxBFk2aMAblgDWLNJlwES5DJRr1B7TsqgIRWZFQykBAbQAMAXWMnEoAA5ZYpPQMsgAHogDsAFgAczLwDYAJgBWAEYggE5I8IBmN2iAGhAAT0QvEOZvNyCjAIC3N3CQryC3AF9SxKlsPCIyCmouFQ5G3gJ8LHxmK2JdVg6cZiqZWvlFRpZVFs0GUR0HBnNzJxs7eadXBBCQjwDfNIDAo3y-I3DElIQPEN2Q8NOgj2joiKC88sr0atk6hQblFgguioABksFQIJAeAIAMK0KgMGAAFSoACMlkgQCt7PoGOtEAEQm4MgSvIVYjEgn5wh5zviAtFmH4PH4vF5ogEvB4ck8yhUQEManJ6kpGACgaDwZDYGAqPgWujrLZsY4MRsCUSdkUyQVnlSaclEEFon5mEbrpy7kFORz3vzPsMhb8RYJARgQWCIRAoQwAKIMCAAJRldEgCsxSrWqvxhOJWpC5N11NpCGit2Y4T8lI8QVCmqttoF31Gf1FzFd7slXoEQdY+DgtDDWMjoDVMc1pPjOspSYNlxCJo5Hi5+SHXLSBftgp+Y3+QggxDAPEmtAAIkDGxGcXiEOrYx2E939Rc-OzfNkjB43PGTs9ohPpFPi86WNLZSGvc5MLoWFRWBgCAAFOeACUPCFiMwrjMwr5yrQoamMsm4qi27gHKaXieBhTz0kaXjJpSRjpmaJ5WvkRz3l8EFOlBbQdAA4hwegImubo8HWGD4EkG6rFuUabNsuystchzHKcyapkEvhuAS4QEkYJQnB4FEOtOJZNGoLFUNCWCoAwGB8AILBaBIgyTkWkGzsumnabpGDTLMug4osCEYk2vEoQgXgEsw0RGEy0RstEGahGcvZ+FkzBXq8njhcEsnlHyDBYBC8AYuBjozqKiE8chLiIAAtH4yb5ZJURRLEBQ5vSSl8ulqnPmwzTqNlyq4nx1K7NEjyeOytwBUYITiQE4TMAEF7eIEhQHG8tVmVRmUuuKHqQC1zZ5ZcATJlsHimkyERGKSLJuJyfjKY+FmlqQ85gKt7nreEPgno8nLZpS+yDWFlKjYEOYhAdGYZryHwPuZ1GzjB763blGw5jtVynNNbhGEckT4RE6bdayxThNkjxnaDC0sLR+AMRgTFQJpUNtR58ZjYymZ+Iz3gZkcQTiZePmMw9L0M+F+PzWpExNdZOl6VT27ZD4I5RFshJFE8yYnrsbgsl48nBDJhIJaUQA */
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
      routes: [],
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
            target: 'fetchDataCount',
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

      fetchDataCount: {
        invoke: {
          src: 'getDataCount',
          onDone: {
            target: 'fetching',
            actions: 'assignTotalCount',
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
      getDataCount: async () => {
        try {
          const response = await getCustomerCount();
          return response.data;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
    actions: {
      assignTotalCount: assign((context, event) => {
        const { companyCount, individuCount, totalCount } = event.data.data;
        const routes = [
          {
            key: '',
            title: 'Semua',
            totalItems: totalCount,
            chipPosition: 'right',
          },
          {
            key: 'COMPANY',
            title: 'Perusahaan',
            totalItems: companyCount,
            chipPosition: 'right',
          },
          {
            key: 'INDIVIDU',
            title: 'Individu',
            totalItems: individuCount,
            chipPosition: 'right',
          },
        ];

        return {
          routes: routes,
        };
      }),
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
