// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.search PO.SearchingDataPurchaseOrder:invocation[0]': {
      type: 'done.invoke.search PO.SearchingDataPurchaseOrder:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.search PO.searchingDataSph:invocation[0]': {
      type: 'done.invoke.search PO.searchingDataSph:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.search PO.searchingDataSph:invocation[0]': {
      type: 'error.platform.search PO.searchingDataSph:invocation[0]';
      data: unknown;
    };
    'xstate.after(500)#search PO.searchValueLoaded': {
      type: 'xstate.after(500)#search PO.searchValueLoaded';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    GetPurchaseOrderList: 'done.invoke.search PO.SearchingDataPurchaseOrder:invocation[0]';
    GetSphList: 'done.invoke.search PO.searchingDataSph:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignDataType: 'setDataType';
    assignPurchaseOrderListData: 'done.invoke.search PO.SearchingDataPurchaseOrder:invocation[0]';
    assignSearchValue: 'searching';
    assignSphData: 'done.invoke.search PO.searchingDataSph:invocation[0]';
    closeModal: 'onCloseModal';
    handleClearInput: 'clearInput';
    handleErrorGettingList: 'error.platform.search PO.searchingDataSph:invocation[0]';
    handleOnEndReached: 'onEndReached';
    handleRefresh: 'onRefresh';
    handleRetryGettingList: 'retryGettingList';
    triggerModal: 'openingModal';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isDataTypePurchaseOrder:
      | 'retryGettingList'
      | 'xstate.after(500)#search PO.searchValueLoaded';
    isDataTypeSph:
      | 'retryGettingList'
      | 'xstate.after(500)#search PO.searchValueLoaded';
    isGettingPurchaseOrder: 'onEndReached';
    searchValueLengthAccepted: 'searching';
  };
  eventsCausingServices: {
    GetPurchaseOrderList:
      | 'retryGettingList'
      | 'xstate.after(500)#search PO.searchValueLoaded';
    GetSphList:
      | 'retryGettingList'
      | 'xstate.after(500)#search PO.searchValueLoaded';
  };
  matchesStates:
    | 'SearchingDataPurchaseOrder'
    | 'errorGettingList'
    | 'inputting'
    | 'openModalChooseData'
    | 'searchValueLoaded'
    | 'searchingDataSph';
  tags: never;
}
