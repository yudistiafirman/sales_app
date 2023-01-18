
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.price machine.getLocation.allowed:invocation[0]": { type: "done.invoke.price machine.getLocation.allowed:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.price machine.getLocation.askPermission:invocation[0]": { type: "done.invoke.price machine.getLocation.askPermission:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.price machine.getLocation.currentLocationLoaded:invocation[0]": { type: "done.invoke.price machine.getLocation.currentLocationLoaded:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.price machine.getProduct.categoriesLoaded.getProductsBaseOnCategories:invocation[0]": { type: "done.invoke.price machine.getProduct.categoriesLoaded.getProductsBaseOnCategories:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.price machine.getProduct.loadingProduct:invocation[0]": { type: "done.invoke.price machine.getProduct.loadingProduct:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.price machine.getProduct.categoriesLoaded.getProductsBaseOnCategories:invocation[0]": { type: "error.platform.price machine.getProduct.categoriesLoaded.getProductsBaseOnCategories:invocation[0]"; data: unknown };
"error.platform.price machine.getProduct.loadingProduct:invocation[0]": { type: "error.platform.price machine.getProduct.loadingProduct:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "askingPermission": "done.invoke.price machine.getLocation.askPermission:invocation[0]";
"fetchLocationDetail": "done.invoke.price machine.getLocation.currentLocationLoaded:invocation[0]";
"getCategoriesProduct": "done.invoke.price machine.getProduct.loadingProduct:invocation[0]";
"getCurrentLocation": "done.invoke.price machine.getLocation.allowed:invocation[0]";
"getProducts": "done.invoke.price machine.getProduct.categoriesLoaded.getProductsBaseOnCategories:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "assignCategoriesToContext": "done.invoke.price machine.getProduct.loadingProduct:invocation[0]";
"assignCurrentLocationToContext": "done.invoke.price machine.getLocation.allowed:invocation[0]";
"assignIndexToContext": "onChangeCategories";
"assignLocationDetailToContext": "done.invoke.price machine.getLocation.currentLocationLoaded:invocation[0]";
"assignParams": "sendingParams";
"assignProductsDataToContext": "done.invoke.price machine.getProduct.categoriesLoaded.getProductsBaseOnCategories:invocation[0]";
"enableLoadProducts": "done.invoke.price machine.getProduct.loadingProduct:invocation[0]" | "onChangeCategories" | "onEndReached" | "refreshingList";
"handleError": "error.platform.price machine.getProduct.categoriesLoaded.getProductsBaseOnCategories:invocation[0]" | "error.platform.price machine.getProduct.loadingProduct:invocation[0]";
"incrementPage": "onEndReached";
"refreshPriceList": "refreshingList";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isHasResult": "done.invoke.price machine.getLocation.currentLocationLoaded:invocation[0]";
"isLocationReachable": "distanceReachable";
"isNotLastPage": "done.invoke.price machine.getProduct.categoriesLoaded.getProductsBaseOnCategories:invocation[0]";
"permissionGranted": "done.invoke.price machine.getLocation.askPermission:invocation[0]";
        };
        eventsCausingServices: {
          "askingPermission": "appComeForegroundState" | "onAskPermission";
"fetchLocationDetail": "done.invoke.price machine.getLocation.allowed:invocation[0]" | "done.invoke.price machine.getLocation.currentLocationLoaded:invocation[0]" | "sendingParams";
"getCategoriesProduct": "xstate.init";
"getCurrentLocation": "done.invoke.price machine.getLocation.askPermission:invocation[0]";
"getProducts": "done.invoke.price machine.getProduct.loadingProduct:invocation[0]" | "onChangeCategories" | "onEndReached" | "refreshingList";
        };
        matchesStates: "Tnc" | "Tnc.agreementHiding" | "Tnc.agreementShowed" | "errorGettingCategories" | "getLocation" | "getLocation.allowed" | "getLocation.askPermission" | "getLocation.currentLocationLoaded" | "getLocation.denied" | "getLocation.denied.background" | "getLocation.denied.foreground" | "getLocation.errorGettingLocation" | "getLocation.finito" | "getLocation.idle" | "getLocation.locationDetailLoaded" | "getLocation.unreachable" | "getProduct" | "getProduct.categoriesLoaded" | "getProduct.categoriesLoaded.getProductsBaseOnCategories" | "getProduct.categoriesLoaded.productLoaded" | "getProduct.loadingProduct" | { "Tnc"?: "agreementHiding" | "agreementShowed";
"getLocation"?: "allowed" | "askPermission" | "currentLocationLoaded" | "denied" | "errorGettingLocation" | "finito" | "idle" | "locationDetailLoaded" | "unreachable" | { "denied"?: "background" | "foreground"; };
"getProduct"?: "categoriesLoaded" | "loadingProduct" | { "categoriesLoaded"?: "getProductsBaseOnCategories" | "productLoaded"; }; };
        tags: never;
      }
  