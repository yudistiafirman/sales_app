// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.transaction machine.getTransaction.loadingTransaction:invocation[0]': {
      type: 'done.invoke.transaction machine.getTransaction.loadingTransaction:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]': {
      type: 'done.invoke.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.transaction machine.getTransaction.loadingTransaction:invocation[0]': {
      type: 'error.platform.transaction machine.getTransaction.loadingTransaction:invocation[0]';
      data: unknown;
    };
    'error.platform.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]': {
      type: 'error.platform.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    getTransactions: 'done.invoke.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]';
    getTypeTransactions: 'done.invoke.transaction machine.getTransaction.loadingTransaction:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignIndexToContext: 'onChangeType';
    assignTransactionsDataToContext: 'done.invoke.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]';
    assignTypeToContext: 'done.invoke.transaction machine.getTransaction.loadingTransaction:invocation[0]';
    enableLoadTransaction:
      | 'done.invoke.transaction machine.getTransaction.loadingTransaction:invocation[0]'
      | 'onChangeType'
      | 'onEndReached'
      | 'refreshingList';
    handleError:
      | 'error.platform.transaction machine.getTransaction.loadingTransaction:invocation[0]'
      | 'error.platform.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]';
    incrementPage: 'onEndReached';
    refreshTransactionList: 'refreshingList';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasNoDataOnNextLoad: 'onEndReached';
    isNotLastPage: 'done.invoke.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]';
  };
  eventsCausingServices: {
    getTransactions:
      | 'done.invoke.transaction machine.getTransaction.loadingTransaction:invocation[0]'
      | 'onChangeType'
      | 'onEndReached'
      | 'refreshingList';
    getTypeTransactions: 'xstate.init';
  };
  matchesStates:
    | 'errorGettingType'
    | 'getTransaction'
    | 'getTransaction.loadingTransaction'
    | 'getTransaction.typeLoaded'
    | 'getTransaction.typeLoaded.getTransactionsBaseOnType'
    | 'getTransaction.typeLoaded.transactionLoaded'
    | {
        getTransaction?:
          | 'loadingTransaction'
          | 'typeLoaded'
          | { typeLoaded?: 'getTransactionsBaseOnType' | 'transactionLoaded' };
      };
  tags: never;
}
