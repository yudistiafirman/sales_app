
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.operation list machine.fetchingListData:invocation[0]": { type: "done.invoke.operation list machine.fetchingListData:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.operation list machine.fetchingListData:invocation[0]": { type: "error.platform.operation list machine.fetchingListData:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "fetchOperationListData": "done.invoke.operation list machine.fetchingListData:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "assignError": "error.platform.operation list machine.fetchingListData:invocation[0]";
"assignListData": "done.invoke.operation list machine.fetchingListData:invocation[0]";
"assignUserDataToContext": "assignUserData";
"handleEndReached": "onEndReached";
"handleRefresh": "onRefreshList";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isNotLastPage": "onEndReached";
        };
        eventsCausingServices: {
          "fetchOperationListData": "assignUserData" | "onEndReached" | "onRefreshList" | "retryGettingList";
        };
        matchesStates: "errorGettingList" | "fetchingListData" | "idle" | "listLoaded";
        tags: never;
      }
  