import {
  getAllPurchaseOrders,
  getConfirmedPurchaseOrder,
} from '@/actions/OrderActions';
import { assign, createMachine } from 'xstate';

const searchSOMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACAygPIB0AlhADZgDEqsspUAdgNJgCeA7gPboQDaABgC6iUAAduDAC6luTMSAAeiAIwAOAMzEA7Op0BWQQCZj68xs0A2ADQh2iACxbiATkODBV1YM0HVBlYAvkF2KBg4BCQAZmDSOKRMUAAypLDSACKo0qjUEPJgZEwAbtwA1oXhWHhExLHx2IkpaZnZqAiJpZjZckxCwv2KkjK9iioImpqqxH6eXj5+Abb2iAauxsSOS5pbBgbGOjshYWjVUXVxCUmp6Vk51GDo6LzE4hTZ0bwAtsRVkbX1K7NW5tDolbjdWTyfqDJAgYakKEKOHjRxrNw6VzqfaqVR6HyuOwOCY6KzEAweUyeAzORyuY4gP41EgUFrJbioCCQajyABKYGi6Dg2Bu0lhEikiNGKMQpnUm18qmMrgppOsOmMRNW602212+0OjgZTPOrPS7M53PkAFEmBB+agcJBxfDJUixrLXIJdMYdlYjK5XJo9FZHFqEKYdLqrK4fHpjLi6cbTv8SI9nugAOJxWTXFrUIXSdDsbPSXPAsUiIZu6WgcbGKzy9YaQzhnSeYjYqwNqntqbGEKhEBMbhc+Bwk1EasjeQehAAWiVjhmmnM7lX6kbgfDqk0rjcyscgg06kcxhMBmTEWZZEoYGnUtnMoQgnDxiPV7OAMujTzIJyD7us+r4rCSy50sG-j7AY+jqPSQ6TiybIclyECAbWyiICBxJ7AYGJGPMvhQcECEpje6a8KW5aiuhT51og86kiua6HOYW6EqB-reqeph+I4hjNjog5BEAA */
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
      isNotLastPage: (context, event) => {
        return context.page <= context.totalPage;
      },
    },
    services: {
      fetchSOListData: async (context, event) => {
        try {
          let response = await getAllPurchaseOrders(
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
        if (event?.data?.data?.data !== undefined) {
          return {
            totalPage: event.data.data.totalPages,
            soListData: listData,
            isLoading: false,
            isLoadMore: false,
            isRefreshing: false,
          };
        }
      }),
      assignError: assign((context, event) => {
        return {
          errorMessage: event.data.message,
          isLoading: false,
          isLoadMore: false,
          isRefreshing: false,
        };
      }),
      handleRefresh: assign((context, event) => {
        return {
          page: 1,
          isRefreshing: true,
          soListData: [],
          keyword: event?.payload,
        };
      }),
      handleEndReached: assign((context, event) => {
        return {
          page: context.page + 1,
          isLoadMore: true,
        };
      }),
      assignKeywordToContext: assign((context, event) => {
        return {
          keyword: event?.payload,
        };
      }),
    },
  }
);

export default searchSOMachine;
