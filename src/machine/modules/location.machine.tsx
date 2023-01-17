import { createMachine } from "xstate";

const locationMachine = createMachine({
	id: 'location',
	type: "atomic"
})