import { assign, createMachine } from 'xstate';
import { getConfirmedPurchaseOrder, getSphByProject } from '@/actions/OrderActions';
import { CreatedSPHListResponse } from '@/interfaces/CreatePurchaseOrder';
import { CreatedPurchaseOrderListResponse } from '@/interfaces/SelectConfirmedPO';

export const searchPOMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACACgPIB0AlgHYAOArgC60VQDEA9pWOYwLIsSoA2AbQAMAXUShKLWKQYtyEkAA9EAJlUA2YgBYAHNoDMugKwBGXcO2nV2gDQgAnogOrhxUwHYAnBpPaNLjbGBgC+IfYoGDgEJBQ09IxMkVjYjCLiSCBSMnIKmSoI6lp6hibmltZ2johWWgGquqYa2h4Buu1hEWgpMWRUdAzkzJj83QCS-bTpitmypPKKBdqq9k6FBl7EHsIG1uYaHt66Hp0gydFEffGDzCi0ACKotKgAKg7s05mzuYs1xsQGAzGLzabTCYyuQzWVaIUyGYiqYzCZHGRrCCzGYKnc54S44xiPZ4AZUo2CYEHkYD6ADcWABrKk43r4oaE1Ak7AICi0zBPebkdKfSTSOYLfKwna6HTBOHNOEGZoeGEIDy6VTELyBXRecxmYQeULhM7dC4kFlQNkcphgdDoFjoYiUfhPABm9oAtsQmXiTalWU92aSueQeXz5IKxDMRT9xQhTMjtMRdECvI1TMFtF4DcrgQZiMJNPrwc0dgZtNjfb02BweHx+ABhbAsaRgNmscj1-gt2sCIVZaP834IDZaQG57baJFeYxK6qFVR5jyaTGgpHCDQFw1dKK4s2+gBqAmoYAAMixUBBIEwlLBnrQqagXff0AAKNcASiSlZ9O8P-GPZ4XpAfbfIOsZHACuapsYk6uDByqgh4xAQhumamF4qimNYJxGt6e6-kep7npeEDXreTwPk+Npvsin54V6B6EYBJGCKYGTCjkYGgAUEEphsfgQuCVRrGCbgFhuZiYlhBw7BWO69DadroAA4mACRDCepC3kw6BqegDiqepUCabeIEDmK3GILxUECXBwmIL4xTeJ4uwNFh5a4d+JBEr6BIBvg1ApKgKCEOgl7oOSlI0vSjJecQPk7n5zwBUFIVhTawahrkEbsf2nEWcoiA+Iuy4+B4wIeJmGjKo0yHIsiuy+MI6GanJPSXAlKRJagKU4MFYCheF1q2vajrOrQbroJ69GdTg3W9dg-WDRl3IsLy2ViGZ+V5JZCBZqYOj6IYlU6mCjQIdO+aFv4yYGOCt1taaxCKfahk3CZtA6XpBlqe9WlTGxUbbUO1matBsFCTmyzIYWlVGAE-iqI9u5XAMiTyAASmALq6bA2BbaKO2FSqB02JhGHAgW64rHOYJ5hoxgaDYXj3QzBbGMjvRxGjQztgAouQEBY6gODAZGXzmUTPGk8s6GIizrhMzmiL5iYIKVdqmIuGERrkLwcCKHhQOE0OAC01Vzub+b1eC6L+MsFimJzlzc0ZxsxrtGibJi+qHHDugbiYyplgd6ZMxC7TCMVTuefJP5df6xKku7XHE9YmJJsdxwNKmpgGMq5WLqiJg5+izUaM7JDVuQPYNk2LZsinBUFIz9NR-DNh53CwdGPmS4Yc1+i+OhHOx+1+EpH+AHEZATdS4gM5Sq0reahrjPGAhYLuO3ybalYqiVZXz0jSpv2MB9c9Dhoec6BuXgguh5X98qd-EAzmidxs-hwkfs1+ha-lAp9TSuFS+sZ07-H0AYVUS5tSNHzrTEEAJWg7yXDBBmOsQhAA */
    id: 'search PO',
    predictableActionArguments: true,
    tsTypes: {} as import('./searchPOMachine.typegen').Typegen0,

    schema: {
      events: {} as
        | { type: 'onChangeTab'; value: number }
        | { type: 'onGettingPOData'; data: any[] }
        | { type: 'getCategoriesData'; data: any[] }
        | { type: 'clearInput' }
        | { type: 'openingModal'; value: any }
        | { type: 'searching'; value: string }
        | { type: 'retryGettingList' }
        | { type: 'onCloseModal' }
        | {
            type: 'setDataType';
            value: 'SPHDATA' | 'DEPOSITDATA' | 'SCHEDULEDATA';
            filterBy: 'INDIVIDU' | 'COMPANY';
          }
        | { type: 'onRefresh' }
        | { type: 'onEndReached' },

      services: {} as {
        getCategoriesData: {
          data: any[];
        };
        onGettingPOData: {
          data: any[];
        };
        GetSphList: {
          data: CreatedSPHListResponse[];
        };
        GetPurchaseOrderList: {
          data: {
            currentPage: number;
            totalItems: number;
            totalPages: number;
            data: CreatedPurchaseOrderListResponse[];
          };
        };
      },
      context: {} as {
        searchValue: string;
        routes: any[];
        selectedCategories: string;
        page: number;
        size: number;
        totalPage: number;
        poData: CreatedPurchaseOrderListResponse[];
        sphData: CreatedSPHListResponse[];
        errorGettingListMessage: any;
        loadData: boolean;
        loadMoreData: boolean;
        isRefreshing: boolean;
        isModalVisible: boolean;
        dataType: 'DEPOSITDATA' | 'SPHDATA' | 'SCHEDULEDATA' | '';
        filterSphDataBy: 'INDIVIDU' | 'COMPANY';
        choosenDataFromList: CreatedSPHListResponse | CreatedPurchaseOrderListResponse;
      },
    },

    context: {
      searchValue: '',
      routes: [] as any,
      selectedCategories: '',
      page: 1,
      size: 10,
      totalPage: 1,
      poData: [],
      sphData: [],
      errorGettingListMessage: '',
      loadData: false,
      loadMoreData: false,
      isRefreshing: false,
      isModalVisible: false,
      dataType: '',
      filterSphDataBy: 'INDIVIDU',
      choosenDataFromList: {} as CreatedPurchaseOrderListResponse | CreatedSPHListResponse,
    },

    states: {
      inputting: {
        on: {
          openingModal: {
            target: 'openModalChooseData',
            actions: 'triggerModal',
          },

          searching: {
            target: 'searchValueLoaded',
            actions: 'assignSearchValue',
            cond: 'searchValueLengthAccepted',
          },

          clearInput: {
            target: 'inputting',
            internal: true,
            actions: 'handleClearInput',
          },

          setDataType: {
            target: 'inputting',
            internal: true,
            actions: 'assignDataType',
          },

          onRefresh: {
            target: 'searchValueLoaded',
            actions: 'handleRefresh',
          },

          onEndReached: {
            target: 'searchValueLoaded',
            cond: 'isGettingPurchaseOrder',
            actions: 'handleOnEndReached',
          },
        },
      },

      searchingDataSph: {
        invoke: {
          src: 'GetSphList',

          onDone: {
            target: 'inputting',
            actions: 'assignSphData',
          },

          onError: {
            target: 'errorGettingList',
            actions: 'handleErrorGettingList',
          },
        },
      },

      openModalChooseData: {
        on: {
          onCloseModal: {
            target: 'inputting',
            actions: 'closeModal',
          },
        },
      },

      searchValueLoaded: {
        after: {
          500: [
            {
              target: 'searchingDataSph',
              cond: 'isDataTypeSph',
            },
            {
              target: 'SearchingDataPurchaseOrder',
              cond: 'isDataTypePurchaseOrder',
            },
          ],
        },
      },

      errorGettingList: {
        on: {
          retryGettingList: [
            {
              target: 'searchingDataSph',
              actions: 'handleRetryGettingList',
              cond: 'isDataTypeSph',
            },
            {
              target: 'SearchingDataPurchaseOrder',
              cond: 'isDataTypePurchaseOrder',
            },
          ],
        },
      },

      SearchingDataPurchaseOrder: {
        invoke: {
          src: 'GetPurchaseOrderList',

          onDone: {
            target: 'inputting',
            actions: 'assignPurchaseOrderListData',
          },

          onError: 'errorGettingList',
        },
      },
    },
    initial: 'inputting',
  },
  {
    actions: {
      triggerModal: assign((context, event) => ({
        isModalVisible: true,
        choosenDataFromList: event.value,
      })),
      assignSearchValue: assign((context, event) => ({
        searchValue: event.value,
        loadData: true,
      })),
      assignSphData: assign((_context, event) => ({
        routes: [
          {
            key: 'first',
            title: 'Perusahaan',
            totalItems: event.data.length,
            chipPosition: 'right',
          },
        ],
        sphData: event.data,
        loadData: false,
        isRefreshing: false,
        loadMoreData: false,
      })),
      closeModal: assign(() => ({
        isModalVisible: false,
      })),
      handleErrorGettingList: assign((context, event) => ({
        errorGettingListMessage: event.data.message,
        loadData: false,
        loadMoreData: false,
        isRefreshing: false,
      })),
      handleRetryGettingList: assign(() => ({
        errorGettingListMessage: '',
        loadData: true,
      })),
      handleClearInput: assign(() => ({
        searchValue: '',
      })),
      assignDataType: assign((context, event) => ({
        dataType: event.value,
        filterSphDataBy: event.filterBy,
      })),
      assignPurchaseOrderListData: assign((context, event) => ({
        routes: [
          {
            key: 'first',
            title: 'Perusahaan',
            totalItems: event.data.totalItems,
            chipPosition: 'right',
          },
        ],
        totalPage: event.data.totalPages,
        poData: event.data.data,
        loadData: false,
        isRefreshing: false,
        loadMoreData: false,
      })),
      handleRefresh: assign(() => ({
        isRefreshing: true,
        sphData: [],
        poData: [],
        page: 1,
      })),
      handleOnEndReached: assign(context => ({
        page: context.page + 1,
        loadMoreData: true,
      })),
    },
    guards: {
      searchValueLengthAccepted: (_context, event) => event.value.length > 2,
      isDataTypeSph: context => context.dataType === 'SPHDATA',
      isDataTypePurchaseOrder: context =>
        context.dataType === 'DEPOSITDATA' || context.dataType === 'SCHEDULEDATA',
      isGettingPurchaseOrder: context =>
        context.dataType === 'DEPOSITDATA' ||
        (context.dataType === 'SCHEDULEDATA' && context.page <= context.totalPage),
    },
    services: {
      GetSphList: async context => {
        try {
          const response = await getSphByProject(context.searchValue, context.filterSphDataBy);
          return response.data.data;
        } catch (error) {
          throw new Error(error);
        }
      },
      GetPurchaseOrderList: async context => {
        try {
          const { page, size, searchValue } = context;
          const productPo = context.dataType === 'DEPOSITDATA' ? '1' : '0';
          const response = await getConfirmedPurchaseOrder(
            page.toString(),
            size.toString(),
            searchValue,
            productPo
          );
          return response.data.data;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
  }
);
