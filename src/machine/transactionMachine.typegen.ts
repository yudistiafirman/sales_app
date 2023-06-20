// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    "@@xstate/typegen": true;
    internalEvents: {
        "done.invoke.transaction machine.getTransaction.loadingTransaction:invocation[0]": {
            type: "done.invoke.transaction machine.getTransaction.loadingTransaction:invocation[0]";
            data: unknown;
            __tip: "See the XState TS docs to learn how to strongly type this.";
        };
        "done.invoke.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]": {
            type: "done.invoke.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]";
            data: unknown;
            __tip: "See the XState TS docs to learn how to strongly type this.";
        };
        "error.platform.transaction machine.getTransaction.loadingTransaction:invocation[0]": {
            type: "error.platform.transaction machine.getTransaction.loadingTransaction:invocation[0]";
            data: unknown;
        };
        "error.platform.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]": {
            type: "error.platform.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]";
            data: unknown;
        };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {
        getTransactions: "done.invoke.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]";
        getTypeTransactions: "done.invoke.transaction machine.getTransaction.loadingTransaction:invocation[0]";
    };
    missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        assignIndexToContext: "onChangeType";
        assignSelectedBP: "assignSelectedBatchingPlant";
        assignTransactionsDataToContext: "done.invoke.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]";
        assignTypeToContext: "done.invoke.transaction machine.getTransaction.loadingTransaction:invocation[0]";
        enableLoadTransaction:
            | "backToGetTransactions"
            | "done.invoke.transaction machine.getTransaction.loadingTransaction:invocation[0]"
            | "onChangeType"
            | "onEndReached"
            | "refreshingList"
            | "retryGettingTransactions";
        handleError:
            | "error.platform.transaction machine.getTransaction.loadingTransaction:invocation[0]"
            | "error.platform.transaction machine.getTransaction.typeLoaded.getTransactionsBaseOnType:invocation[0]";
        handleRetryGettingTransactions: "retryGettingTransactions";
        incrementPage: "onEndReached";
        refreshTransactionList: "refreshingList";
        resetProduct: "backToGetTransactions";
    };
    eventsCausingDelays: {};
    eventsCausingGuards: {
        hasNoDataOnNextLoad: "onEndReached";
    };
    eventsCausingServices: {
        getTransactions:
            | "backToGetTransactions"
            | "done.invoke.transaction machine.getTransaction.loadingTransaction:invocation[0]"
            | "onChangeType"
            | "onEndReached"
            | "refreshingList"
            | "retryGettingTransactions";
        getTypeTransactions:
            | "assignSelectedBatchingPlant"
            | "retryGettingTypeTransactions";
    };
    matchesStates:
        | "getTransaction"
        | "getTransaction.errorGettingTypeTransactions"
        | "getTransaction.getSelectedBatchingPlant"
        | "getTransaction.loadingTransaction"
        | "getTransaction.typeLoaded"
        | "getTransaction.typeLoaded.errorGettingTransactions"
        | "getTransaction.typeLoaded.getTransactionsBaseOnType"
        | "getTransaction.typeLoaded.transactionLoaded"
        | {
              getTransaction?:
                  | "errorGettingTypeTransactions"
                  | "getSelectedBatchingPlant"
                  | "loadingTransaction"
                  | "typeLoaded"
                  | {
                        typeLoaded?:
                            | "errorGettingTransactions"
                            | "getTransactionsBaseOnType"
                            | "transactionLoaded";
                    };
          };
    tags: never;
}
