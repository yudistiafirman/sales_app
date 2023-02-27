// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.deviceLocation.allowed:invocation[0]': {
      type: 'done.invoke.deviceLocation.allowed:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.deviceLocation.askPermission:invocation[0]': {
      type: 'done.invoke.deviceLocation.askPermission:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    askingPermission: 'done.invoke.deviceLocation.askPermission:invocation[0]';
    getCurrentLocation: 'done.invoke.deviceLocation.allowed:invocation[0]';
  };
  missingImplementations: {
    actions: 'dispatchState';
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignCurrentLocationToContext: 'done.invoke.deviceLocation.allowed:invocation[0]';
    dispatchState: 'done.invoke.deviceLocation.allowed:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isGranted: 'done.invoke.deviceLocation.askPermission:invocation[0]';
  };
  eventsCausingServices: {
    askingPermission: 'askingPermission';
    getCurrentLocation: 'done.invoke.deviceLocation.askPermission:invocation[0]';
  };
  matchesStates: 'allowed' | 'askPermission' | 'idle';
  tags: never;
}
