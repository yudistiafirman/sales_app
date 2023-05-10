// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.visit history machine.getVisitationByProjectId:invocation[0]': { type: 'done.invoke.visit history machine.getVisitationByProjectId:invocation[0]'; data: unknown; __tip: 'See the XState TS docs to learn how to strongly type this.' };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    'getAllVisitationByProjectId': 'done.invoke.visit history machine.getVisitationByProjectId:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    'assignProjectIdToContext': 'assignParams';
    'assignVisitationDataToContext': 'done.invoke.visit history machine.getVisitationByProjectId:invocation[0]';
    'sliceVisitationData': 'onChangeVisitationIdx';
  };
  eventsCausingDelays: {

  };
  eventsCausingGuards: {

  };
  eventsCausingServices: {
    'getAllVisitationByProjectId': 'assignParams';
  };
  matchesStates: 'ErrorState' | 'getVisitationByProjectId' | 'idle' | 'visitationDataLoaded';
  tags: never;
}
