// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    "@@xstate/typegen": true;
    internalEvents: {
        "done.invoke.search SO.fetchingListData:invocation[0]": {
            type: "done.invoke.search SO.fetchingListData:invocation[0]";
            data: unknown;
            __tip: "See the XState TS docs to learn how to strongly type this.";
        };
        "error.platform.search SO.fetchingListData:invocation[0]": {
            type: "error.platform.search SO.fetchingListData:invocation[0]";
            data: unknown;
        };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {
        fetchSOListData: "done.invoke.search SO.fetchingListData:invocation[0]";
    };
    missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        assignError: "error.platform.search SO.fetchingListData:invocation[0]";
        assignKeywordToContext: "assignKeyword";
        assignListData: "done.invoke.search SO.fetchingListData:invocation[0]";
        handleEndReached: "onEndReached";
        handleRefresh: "onRefreshList";
    };
    eventsCausingDelays: {};
    eventsCausingGuards: {
        isNotLastPage: "onEndReached";
    };
    eventsCausingServices: {
        fetchSOListData:
            | "assignKeyword"
            | "onEndReached"
            | "onRefreshList"
            | "retryGettingList";
    };
    matchesStates:
        | "errorGettingList"
        | "fetchingListData"
        | "idle"
        | "listLoaded";
    tags: never;
}
