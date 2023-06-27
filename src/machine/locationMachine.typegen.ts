// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    "@@xstate/typegen": true;
    internalEvents: {
        "done.invoke.location.gettingLocationDetails:invocation[0]": {
            type: "done.invoke.location.gettingLocationDetails:invocation[0]";
            data: unknown;
            __tip: "See the XState TS docs to learn how to strongly type this.";
        };
        "xstate.after(500)#location.debounce": {
            type: "xstate.after(500)#location.debounce";
        };
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {
        onGettingLocationDetails: "done.invoke.location.gettingLocationDetails:invocation[0]";
    };
    missingImplementations: {
        actions: never;
        delays: never;
        guards: never;
        services: never;
    };
    eventsCausingActions: {
        assignLocationDetail: "done.invoke.location.gettingLocationDetails:invocation[0]";
        assignOnChangeRegionValue: "onChangeRegion";
        assignParamsToContext: "sendingCoorParams";
        assignSelectedBP: "assignSelectedBatchingPlant";
        enabledLoadingDetails: "onChangeRegion";
    };
    eventsCausingDelays: {};
    eventsCausingGuards: {};
    eventsCausingServices: {
        onGettingLocationDetails:
            | "sendingCoorParams"
            | "xstate.after(500)#location.debounce";
    };
    matchesStates:
        | "debounce"
        | "getSelectedBatchingPlant"
        | "gettingLocationDetails"
        | "receivingParams";
    tags: never;
}
