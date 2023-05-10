import { createMachine, Machine } from "xstate";
import { deviceLocationMachine } from "@/machine/modules";

const firsStepMachine = createMachine({
  id: "firsStepMachine",
  initial: "idle",
  predictableActionArguments: true,
  context: {
    deviceLocationMachine: deviceLocationMachine.context,
  },
  states: {
    idle: {
      type: "parallel",
      states: {
        deviceLocation: deviceLocationMachine.states,
      },
    },
  },
});

export { firsStepMachine };
