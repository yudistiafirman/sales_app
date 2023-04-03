
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.purchase order.PostPurchaseOrder.postFiles:invocation[0]": { type: "done.invoke.purchase order.PostPurchaseOrder.postFiles:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.purchase order.PostPurchaseOrder.postImages:invocation[0]": { type: "done.invoke.purchase order.PostPurchaseOrder.postImages:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.purchase order.PostPurchaseOrder.postPoPayload:invocation[0]": { type: "done.invoke.purchase order.PostPurchaseOrder.postPoPayload:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.purchase order.SecondStep.gettingSphDocuments:invocation[0]": { type: "done.invoke.purchase order.SecondStep.gettingSphDocuments:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.purchase order.checkSavedPo:invocation[0]": { type: "done.invoke.purchase order.checkSavedPo:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.purchase order.PostPurchaseOrder.postFiles:invocation[0]": { type: "error.platform.purchase order.PostPurchaseOrder.postFiles:invocation[0]"; data: unknown };
"error.platform.purchase order.PostPurchaseOrder.postImages:invocation[0]": { type: "error.platform.purchase order.PostPurchaseOrder.postImages:invocation[0]"; data: unknown };
"error.platform.purchase order.PostPurchaseOrder.postPoPayload:invocation[0]": { type: "error.platform.purchase order.PostPurchaseOrder.postPoPayload:invocation[0]"; data: unknown };
"error.platform.purchase order.SecondStep.gettingSphDocuments:invocation[0]": { type: "error.platform.purchase order.SecondStep.gettingSphDocuments:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
"xstate.stop": { type: "xstate.stop" };
        };
        invokeSrcNameMap: {
          "getSavedPo": "done.invoke.purchase order.checkSavedPo:invocation[0]";
"getSphDocument": "done.invoke.purchase order.SecondStep.gettingSphDocuments:invocation[0]";
"postPo": "done.invoke.purchase order.PostPurchaseOrder.postPoPayload:invocation[0]";
"uploadFiles": "done.invoke.purchase order.PostPurchaseOrder.postFiles:invocation[0]";
"uploadPhoto": "done.invoke.purchase order.PostPurchaseOrder.postImages:invocation[0]";
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
"assignFilesToPayload": "done.invoke.purchase order.PostPurchaseOrder.postFiles:invocation[0]";
"assignImages": "addImages";
"assignNewQuantity": "onChangeQuantity";
"assignPhotoToPayload": "done.invoke.purchase order.PostPurchaseOrder.postImages:invocation[0]";
"assignPoPayload": "goToPostPo";
"assignPressedStep": "goToSecondStepFromStepOnePressed" | "goToStepOneFromStepThreePressed" | "goToStepOneFromStepTwoPressed" | "goToStepThreeFromStepTwoPressed" | "goToStepTwoFromStepThreePressed" | "goToThirdFromStepOnePressed";
"assignSecondTimeUsingCamera": "addMoreImages";
"assignSelectedProducts": "goToThirdStep" | "goToThirdStepFromSaved";
"assignValue": "inputSph";
"closeModalSph": "addChoosenSph";
"decreaseStep": "goBackToFirstStep";
"decreaseStepFromThirdStep": "goBackToSecondStep";
"disableCameraScreen": "addImages" | "backFromCamera" | "backToSavedPoFromCamera" | "xstate.stop";
"disableLoadingPostPurchaseOrder": "done.invoke.purchase order.PostPurchaseOrder.postPoPayload:invocation[0]" | "error.platform.purchase order.PostPurchaseOrder.postFiles:invocation[0]" | "error.platform.purchase order.PostPurchaseOrder.postImages:invocation[0]" | "error.platform.purchase order.PostPurchaseOrder.postPoPayload:invocation[0]";
"enableCameraScreen": "addMoreImages" | "createNewPo" | "done.invoke.purchase order.checkSavedPo:invocation[0]";
"enableLoadingDocument": "getSphDocument";
"enableLoadingPostPurchaseOrder": "retryPostPurchaseOrder";
"enableModalContinuePo": "done.invoke.purchase order.checkSavedPo:invocation[0]";
"handleErrorGettingDocument": "error.platform.purchase order.SecondStep.gettingSphDocuments:invocation[0]";
"handleRetryDocument": "retryGettingDocument";
"increaseStep": "goToSecondStep" | "goToThirdStep";
"resetPoState": "backToBeginningState" | "backToBeginningStateFromSecondStep" | "backToInitialState" | "createNewPo";
"setNewStep": "goToSecondStepFromSaved" | "goToThirdStepFromSaved";
"setSelectedChoosenProduct": "selectProduct";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "hasSavedPo": "done.invoke.purchase order.checkSavedPo:invocation[0]";
"needUploadFiles": "done.invoke.purchase order.PostPurchaseOrder.postImages:invocation[0]";
"useExistingFiles": "getSphDocument";
        };
        eventsCausingServices: {
          "getSavedPo": "backToBeginningState" | "backToBeginningStateFromSecondStep" | "backToBeginningStateFromThirdStep" | "backToInitialState" | "backToSavedPoFromCamera" | "xstate.init";
"getSphDocument": "getSphDocument" | "retryGettingDocument";
"postPo": "done.invoke.purchase order.PostPurchaseOrder.postFiles:invocation[0]" | "done.invoke.purchase order.PostPurchaseOrder.postImages:invocation[0]" | "retryPostPurchaseOrder";
"uploadFiles": "done.invoke.purchase order.PostPurchaseOrder.postImages:invocation[0]";
"uploadPhoto": "goToPostPo";
        };
        matchesStates: "PostPurchaseOrder" | "PostPurchaseOrder.failCreatedPo" | "PostPurchaseOrder.postFiles" | "PostPurchaseOrder.postImages" | "PostPurchaseOrder.postPoPayload" | "PostPurchaseOrder.successCreatedPo" | "SecondStep" | "SecondStep.SphDocumentLoaded" | "SecondStep.errorGettingDocuments" | "SecondStep.gettingSphDocuments" | "SecondStep.idle" | "ThirdStep" | "ThirdStep.idle" | "checkSavedPo" | "firstStep" | "firstStep.SearchSph" | "firstStep.addPO" | "hasSavedPo" | "openCamera" | { "PostPurchaseOrder"?: "failCreatedPo" | "postFiles" | "postImages" | "postPoPayload" | "successCreatedPo";
"SecondStep"?: "SphDocumentLoaded" | "errorGettingDocuments" | "gettingSphDocuments" | "idle";
"ThirdStep"?: "idle";
"firstStep"?: "SearchSph" | "addPO"; };
        tags: never;
      }
  