
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.purchase order.checkSavedPo:invocation[0]": { type: "done.invoke.purchase order.checkSavedPo:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "GetSphList": "done.invoke.purchase order.firstStep.SearchSph.searchingSph:invocation[0]";
"getSavedPo": "done.invoke.purchase order.checkSavedPo:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "assignDeleteImageByIndex": "deleteImage";
"assignFiles": "uploading";
"assignImages": "addImages";
"assignIndexChanged": "onChangeCategories";
"assignPoType": "goToFirstStep";
"assignSearchQuery": "searching";
"assignValue": "inputSph";
"closeModalSph": "addChoosenSph";
"closingModal": "closeModal";
"setSelectedChoosenProduct": "selectProduct";
"triggerModal": "openingModal";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isHasSavePo": "done.invoke.purchase order.checkSavedPo:invocation[0]";
"isPOProvidedByCustomers": "goToFirstStep";
        };
        eventsCausingServices: {
          "GetSphList": "searching";
"getSavedPo": "xstate.init";
        };
        matchesStates: "Exit" | "SecondStep" | "SecondStep.idle" | "SecondStep.uploadFile" | "ThirdStep" | "ThirdStep.idle" | "ThirdStep.productSelected" | "checkSavedPo" | "enquirePOType" | "firstStep" | "firstStep.SearchSph" | "firstStep.SearchSph.inputting" | "firstStep.SearchSph.openModalChooseSph" | "firstStep.SearchSph.searchingSph" | "firstStep.addPO" | "openCamera" | { "SecondStep"?: "idle" | "uploadFile";
"ThirdStep"?: "idle" | "productSelected";
"firstStep"?: "SearchSph" | "addPO" | { "SearchSph"?: "inputting" | "openModalChooseSph" | "searchingSph"; }; };
        tags: never;
      }
  