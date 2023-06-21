// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    "@@xstate/typegen": true;
    internalEvents: {
        "done.invoke.search area.getLocation.allowed:invocation[0]": {
            type: "done.invoke.search area.getLocation.allowed:invocation[0]";
            data: unknown;
            __tip: "See the XState TS docs to learn how to strongly type this.";
        };
        "done.invoke.search area.getLocation.currentLocationLoaded:invocation[0]": {
            type: "done.invoke.search area.getLocation.currentLocationLoaded:invocation[0]";
            data: unknown;
            __tip: "See the XState TS docs to learn how to strongly type this.";
        };
        "done.invoke.search area.searchLocation.gettingPlaceId:invocation[0]": {
            type: "done.invoke.search area.searchLocation.gettingPlaceId:invocation[0]";
            data: unknown;
            __tip: "See the XState TS docs to learn how to strongly type this.";
        };
        "done.invoke.search area.searchLocation.onGettingLocation:invocation[0]": {
            type: "done.invoke.search area.searchLocation.onGettingLocation:invocation[0]";
            data: unknown;
            __tip: "See the XState TS docs to learn how to strongly type this.";
        };
        "error.platform.search area.getLocation.allowed:invocation[0]": {
            type: "error.platform.search area.getLocation.allowed:invocation[0]";
            data: unknown;
        };
        "error.platform.search area.searchLocation.onGettingLocation:invocation[0]": {
            type: "error.platform.search area.searchLocation.onGettingLocation:invocation[0]";
            data: unknown;
        };
        "xstate.after(100)#search area.searchLocation.searchValueLoaded": {
            type: "xstate.after(100)#search area.searchLocation.searchValueLoaded";
        };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {
        getCurrentLocation: "done.invoke.search area.getLocation.allowed:invocation[0]";
        getLocationByCoordinate: "done.invoke.search area.getLocation.currentLocationLoaded:invocation[0]";
        getLocationBySearch: "done.invoke.search area.searchLocation.onGettingLocation:invocation[0]";
        gettingPlacesId: "done.invoke.search area.searchLocation.gettingPlaceId:invocation[0]";
    };
    missingImplementations: {
        actions: "clearInputValue" | "navigateToLocation";
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        assignCurrentLocationToContext: "done.invoke.search area.getLocation.allowed:invocation[0]";
        assignPlacesId: "onGettingPlacesId";
        assignResult: "done.invoke.search area.searchLocation.onGettingLocation:invocation[0]";
        assignSearchValue: "searchingLocation";
        assignSelectedBP: "assignSelectedBatchingPlant";
        clearInputValue: "clearInput";
        clearResult:
            | "error.platform.search area.getLocation.allowed:invocation[0]"
            | "searchingLocation";
        handleErrorGettingLocation: "error.platform.search area.searchLocation.onGettingLocation:invocation[0]";
        navigateToLocation:
            | "done.invoke.search area.getLocation.currentLocationLoaded:invocation[0]"
            | "done.invoke.search area.searchLocation.gettingPlaceId:invocation[0]";
    };
    eventsCausingDelays: {};
    eventsCausingGuards: {
        searchLengthAccepted: "searchingLocation";
    };
    eventsCausingServices: {
        getCurrentLocation: "xstate.init";
        getLocationByCoordinate: "done.invoke.search area.getLocation.allowed:invocation[0]";
        getLocationBySearch:
            | "retryGettingLocation"
            | "xstate.after(100)#search area.searchLocation.searchValueLoaded";
        gettingPlacesId: "onGettingPlacesId";
    };
    matchesStates:
        | "getLocation"
        | "getLocation.allowed"
        | "getLocation.currentLocationLoaded"
        | "getLocation.finito"
        | "searchLocation"
        | "searchLocation.errorGettingLocationData"
        | "searchLocation.getSelectedBatchingPlant"
        | "searchLocation.gettingPlaceId"
        | "searchLocation.inputting"
        | "searchLocation.onGettingLocation"
        | "searchLocation.searchValueLoaded"
        | {
              getLocation?: "allowed" | "currentLocationLoaded" | "finito";
              searchLocation?:
                  | "errorGettingLocationData"
                  | "getSelectedBatchingPlant"
                  | "gettingPlaceId"
                  | "inputting"
                  | "onGettingLocation"
                  | "searchValueLoaded";
          };
    tags: never;
}
