
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.search product.categoriesLoaded.gettingProducts:invocation[0]": { type: "done.invoke.search product.categoriesLoaded.gettingProducts:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.search product.searching:invocation[0]": { type: "done.invoke.search product.searching:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "getCategoriesData": "done.invoke.search product.searching:invocation[0]";
"onGettingProductsData": "done.invoke.search product.categoriesLoaded.gettingProducts:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "assignCategories": "done.invoke.search product.searching:invocation[0]";
"assignIndex": "onChangeTab";
"assignProducts": "done.invoke.search product.categoriesLoaded.gettingProducts:invocation[0]";
"assignSearchValue": "searchingProducts";
"clearData": "clearInput" | "searchingProducts";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "searchValueLengthAccepted": "searchingProducts";
        };
        eventsCausingServices: {
          "getCategoriesData": "searchingProducts";
"onGettingProductsData": "done.invoke.search product.searching:invocation[0]" | "onChangeTab";
        };
        matchesStates: "categoriesLoaded" | "categoriesLoaded.gettingProducts" | "errorState" | "inputting" | "searching" | { "categoriesLoaded"?: "gettingProducts"; };
        tags: never;
      }
  