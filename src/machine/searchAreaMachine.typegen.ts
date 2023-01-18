
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.search area.getLocation.allowed:invocation[0]": { type: "done.invoke.search area.getLocation.allowed:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.search area.getLocation.askPermission:invocation[0]": { type: "done.invoke.search area.getLocation.askPermission:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.search area.getLocation.currentLocationLoaded:invocation[0]": { type: "done.invoke.search area.getLocation.currentLocationLoaded:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.search area.searchLocation.gettingPlaceId:invocation[0]": { type: "done.invoke.search area.searchLocation.gettingPlaceId:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.search area.searchLocation.onGettingLocation:invocation[0]": { type: "done.invoke.search area.searchLocation.onGettingLocation:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"xstate.after(1000)#search area.searchLocation.searchValueLoaded": { type: "xstate.after(1000)#search area.searchLocation.searchValueLoaded" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "askingPermission": "done.invoke.search area.getLocation.askPermission:invocation[0]";
"getCurrentLocation": "done.invoke.search area.getLocation.allowed:invocation[0]";
"getLocationByCoordinate": "done.invoke.search area.getLocation.currentLocationLoaded:invocation[0]";
"getLocationBySearch": "done.invoke.search area.searchLocation.onGettingLocation:invocation[0]";
"gettingPlacesId": "done.invoke.search area.searchLocation.gettingPlaceId:invocation[0]";
        };
        missingImplementations: {
          actions: "clearInputValue" | "navigateToLocation";
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "assignCurrentLocationToContext": "done.invoke.search area.getLocation.allowed:invocation[0]";
"assignPlacesId": "onGettingPlacesId";
"assignResult": "done.invoke.search area.searchLocation.onGettingLocation:invocation[0]";
"assignSearchValue": "searchingLocation";
"clearInputValue": "clearInput";
"clearResult": "searchingLocation";
"navigateToLocation": "done.invoke.search area.getLocation.currentLocationLoaded:invocation[0]" | "done.invoke.search area.searchLocation.gettingPlaceId:invocation[0]";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isGranted": "done.invoke.search area.getLocation.askPermission:invocation[0]";
"searchLengthAccepted": "searchingLocation";
        };
        eventsCausingServices: {
          "askingPermission": "askingPermission";
"getCurrentLocation": "done.invoke.search area.getLocation.askPermission:invocation[0]";
"getLocationByCoordinate": "done.invoke.search area.getLocation.allowed:invocation[0]";
"getLocationBySearch": "xstate.after(1000)#search area.searchLocation.searchValueLoaded";
"gettingPlacesId": "onGettingPlacesId";
        };
        matchesStates: "getLocation" | "getLocation.allowed" | "getLocation.askPermission" | "getLocation.currentLocationLoaded" | "getLocation.denied" | "getLocation.denied.background" | "getLocation.denied.foreground" | "getLocation.errorGettingLocation" | "getLocation.idle" | "searchLocation" | "searchLocation.errorGettingData" | "searchLocation.gettingPlaceId" | "searchLocation.inputting" | "searchLocation.onGettingLocation" | "searchLocation.searchValueLoaded" | { "getLocation"?: "allowed" | "askPermission" | "currentLocationLoaded" | "denied" | "errorGettingLocation" | "idle" | { "denied"?: "background" | "foreground"; };
"searchLocation"?: "errorGettingData" | "gettingPlaceId" | "inputting" | "onGettingLocation" | "searchValueLoaded"; };
        tags: never;
      }
  