
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.purchase order.SecondStep.gettingSphDocuments:invocation[0]": { type: "done.invoke.purchase order.SecondStep.gettingSphDocuments:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.purchase order.checkSavedPo:invocation[0]": { type: "done.invoke.purchase order.checkSavedPo:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.purchase order.firstStep.SearchSph.searchingSph:invocation[0]": { type: "done.invoke.purchase order.firstStep.SearchSph.searchingSph:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.purchase order.SecondStep.gettingSphDocuments:invocation[0]": { type: "error.platform.purchase order.SecondStep.gettingSphDocuments:invocation[0]"; data: unknown };
"error.platform.purchase order.firstStep.SearchSph.searchingSph:invocation[0]": { type: "error.platform.purchase order.firstStep.SearchSph.searchingSph:invocation[0]"; data: unknown };
"xstate.after(300)#purchase order.firstStep.SearchSph.searchValueLoaded": { type: "xstate.after(300)#purchase order.firstStep.SearchSph.searchValueLoaded" };
"xstate.init": { type: "xstate.init" };
"xstate.stop": { type: "xstate.stop" };
        };
        invokeSrcNameMap: {
          "GetSphList": "done.invoke.purchase order.firstStep.SearchSph.searchingSph:invocation[0]";
"getSavedPo": "done.invoke.purchase order.checkSavedPo:invocation[0]";
"getSphDocument": "done.invoke.purchase order.SecondStep.gettingSphDocuments:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "assignDeleteImageByIndex": "deleteImage";
"assignDocument": "done.invoke.purchase order.SecondStep.gettingSphDocuments:invocation[0]";
"assignFiles": "uploading";
"assignImages": "addImages";
"assignIndexChanged": "onChangeCategories";
"assignNewQuantity": "onChangeQuantity";
"assignSearchQuery": "searching";
"assignSphData": "done.invoke.purchase order.firstStep.SearchSph.searchingSph:invocation[0]";
"assignValue": "inputSph";
"closeModalSph": "addChoosenSph";
"closingModal": "closeModal";
"decreaseStep": "goBackToFirstStep" | "goBackToSecondStep";
"disableCameraScreen": "addImages" | "xstate.stop";
"enableCameraScreen": "addMoreImages" | "done.invoke.purchase order.checkSavedPo:invocation[0]";
"handleError": "error.platform.purchase order.firstStep.SearchSph.searchingSph:invocation[0]";
"handleErrorGettingDocument": "error.platform.purchase order.SecondStep.gettingSphDocuments:invocation[0]";
"handleRetry": "retryGettingSphList";
"increaseStep": "goToSecondStep" | "goToThirdStep";
"setSelectedChoosenProduct": "selectProduct";
"triggerModal": "openingModal";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isHasSavePo": "done.invoke.purchase order.checkSavedPo:invocation[0]";
"searchValueLengthAccepted": "searching";
        };
        eventsCausingServices: {
          "GetSphList": "retryGettingSphList" | "xstate.after(300)#purchase order.firstStep.SearchSph.searchValueLoaded";
"getSavedPo": "xstate.init";
"getSphDocument": "goBackToSecondStep" | "goToSecondStep" | "retryGettingDocument";
        };
        matchesStates: "SecondStep" | "SecondStep.SphDocumentLoaded" | "SecondStep.errorGettingDocuments" | "SecondStep.gettingSphDocuments" | "ThirdStep" | "ThirdStep.idle" | "checkSavedPo" | "firstStep" | "firstStep.SearchSph" | "firstStep.SearchSph.errorGettingSphList" | "firstStep.SearchSph.inputting" | "firstStep.SearchSph.openModalChooseSph" | "firstStep.SearchSph.searchValueLoaded" | "firstStep.SearchSph.searchingSph" | "firstStep.addPO" | "openCamera" | { "SecondStep"?: "SphDocumentLoaded" | "errorGettingDocuments" | "gettingSphDocuments";
"ThirdStep"?: "idle";
"firstStep"?: "SearchSph" | "addPO" | { "SearchSph"?: "errorGettingSphList" | "inputting" | "openModalChooseSph" | "searchValueLoaded" | "searchingSph"; }; };
        tags: never;
      }
  