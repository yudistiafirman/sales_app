
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.search PO.categoriesLoaded.gettingPO:invocation[0]": { type: "done.invoke.search PO.categoriesLoaded.gettingPO:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.search PO.searching:invocation[0]": { type: "done.invoke.search PO.searching:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "getCategoriesData": "done.invoke.search PO.searching:invocation[0]";
"onGettingPOData": "done.invoke.search PO.categoriesLoaded.gettingPO:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "assignCategories": "done.invoke.search PO.searching:invocation[0]";
"assignIndex": "onChangeTab";
"assignPO": "done.invoke.search PO.categoriesLoaded.gettingPO:invocation[0]";
"assignSearchValue": "searchingPO";
"clearData": "clearInput" | "searchingPO";
"enableLoadPO": "done.invoke.search PO.searching:invocation[0]" | "onChangeTab";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "searchValueLengthAccepted": "searchingPO";
        };
        eventsCausingServices: {
          "getCategoriesData": "searchingPO";
"onGettingPOData": "done.invoke.search PO.searching:invocation[0]" | "onChangeTab";
        };
        matchesStates: "categoriesLoaded" | "categoriesLoaded.gettingPO" | "errorState" | "inputting" | "searching" | { "categoriesLoaded"?: "gettingPO"; };
        tags: never;
      }
  