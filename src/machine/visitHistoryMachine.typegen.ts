// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.visit history machine.getVisitationByProjectId:invocation[0]': {
      type: 'done.invoke.visit history machine.getVisitationByProjectId:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.visit history machine.getVisitationByProjectId:invocation[0]': {
      type: 'error.platform.visit history machine.getVisitationByProjectId:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    getAllVisitationByProjectId: 'done.invoke.visit history machine.getVisitationByProjectId:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignError: 'error.platform.visit history machine.getVisitationByProjectId:invocation[0]';
    assignProjectIdToContext: 'assignParams';
    assignVisitationDataToContext: 'done.invoke.visit history machine.getVisitationByProjectId:invocation[0]';
    onRetryGettingData: 'retryGettingData';
    sliceVisitationData: 'onChangeVisitationIdx';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    getAllVisitationByProjectId: 'assignParams' | 'retryGettingData';
  };
  matchesStates:
    | 'errorGettingData'
    | 'getVisitationByProjectId'
    | 'idle'
    | 'visitationDataLoaded';
  tags: never;
}
