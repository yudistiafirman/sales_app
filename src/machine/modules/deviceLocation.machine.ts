import { assign, createMachine } from "xstate";
import Geolocation from "react-native-geolocation-service";
import { hasLocationPermission } from "@/utils/permissions";
import { getLocationCoordinates } from "../priceMachine";

interface IContext {
  PostalId: any;
  lon: number;
  lat: number;
  formattedAddress: string;
  isGranted: boolean;
  distance: {
    text: string;
    value: number | null;
  };
  errorMessage: string | unknown;
}

interface IGuard {
  isGranted: (context: any, event: any) => any;
  type: string;
}

const deviceLocationMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QTANwJYGMwBkD2mAhgC7p4B2AdOhADZgDEhsA1uuVAApgBOAtuliwy5ANoAGALqJQABzzDSFGSAAeiAIwA2LZQDMBvQCZxRrXq0B2cQFYALABoQAT0RGjeypZvjfNgJwadnriVpYAvuFOKBjY+ERKVMws3PyCwhQMEBRg1OSoeCy5MVi4BCQilMmpAkIiCOwFCSISkq0q8ooiKuoIAbqm4gAcGpb+RkF2dv5OrgjuNpRGPr5apnajvnqR0Wil8RUUVbS0eADukFk5eQVFlCVx5YnHpxcQDflPLVLtSCCd6ESPUQVjslDsWiGljs9hM4ksE1miBGlBWviMQ38IR0dgiURADzKzSOhBO50uvB4eB4lFktBIADNqXx7ntHsSkmS3h8mocxD8pB0FIDun9ejpdP5bCFLCNxBCNBokQhcUNKPKrP5IRobFDFTsCWyiXzKJTqQBxMDEUgcA6JBgAI0ImBYABU8DR6L85MKgWLEABaWXKuxDIyUfw2bT2GwGZb+SL48h4FDwP6Eu2in1dZT+hABjRmZUBga+Xz+IZTDHDewGjNfI6esBCnPkYEqozKia6bQ6IZ6GyD8SR4x1o2ZkmsGrpLP-X2z3oDyyomwmKyjQK2Gxd3xeFY68wI+GRsexY3PUmvSAtkW50C9aG6IxYvQwkaDkadlyIV9PkYD+VvFhXFT32BsqDNHhLWtdgoAnNs-gBP170QYJ-C8DZ5UVWUBwsZVYQjKMtBjOMAkTcIgA */
  createMachine(
    {
      id: "deviceLocation",
      schema: {
        context: {} as IContext,
        guards: {} as IGuard,
      },
      predictableActionArguments: true,
      tsTypes: {} as import("./deviceLocation.machine.typegen").Typegen0,
      context: {
        errorMessage: "",
        formattedAddress: "",
        lat: 0,
        lon: 0,
        isGranted: false,
        distance: {
          text: "",
          value: null,
        },
      },
      initial: "idle",
      states: {
        idle: {
          on: {
            askingPermission: "askPermission",
          },
        },

        askPermission: {
          invoke: {
            src: "askingPermission",
            onDone: {
              target: "allowed",
              cond: "isGranted",
            },
          },
        },

        allowed: {
          invoke: {
            src: "getCurrentLocation",

            // onError: 'errorGettingLocation',
            // onDone: {
            //   target: 'currentLocationLoaded',
            //   actions: 'assignCurrentLocationToContext',
            // },
            onDone: {
              actions: ["assignCurrentLocationToContext", "dispatchState"],
            },

            onError: {
              target: "errorGettingLocation",
              actions: "assignError",
            },
          },
        },

        errorGettingLocation: {
          on: {
            backToidle: "idle",
          },
        },
      },
    },
    {
      guards: {
        isGranted: (context, event) => event.data,
      },
      actions: {
        assignCurrentLocationToContext: assign((context, event) => event.data),
        assignError: assign((context, event) => ({
          errorMessage: event.data.message,
        })),
      },
      services: {
        askingPermission: async () => {
          const granted = await hasLocationPermission();
          return granted;
        },
        getCurrentLocation: async () => {
          try {
            // const position = await Geolocation.getCurrentPosition({
            //   enableHighAccuracy: true,
            //   timeout: 15000,
            // });
            const opt = {
              // timeout:INFINITY,
              // maximumAge:INFINITY,
              // accuracy: { ios: "hundredMeters", android: "balanced" },
              // enableHighAccuracy: false,
              // distanceFilter:0,
              showLocationDialog: true,
              forceRequestLocation: true,
            };
            const position = await new Promise((resolve, error) =>
              Geolocation.getCurrentPosition(resolve, error, opt)
            );
            const { coords } = position;
            const { latitude, longitude } = coords;

            const { data } = await getLocationCoordinates(
              // '',
              longitude,
              latitude,
              "BP-LEGOK"
            );
            const { result } = data;
            if (!result) {
              throw data;
            }

            return {
              lat: Number(result?.lat),
              lon: Number(result?.lon),
              formattedAddress: result?.formattedAddress,
              PostalId: result?.PostalId,
              distance: {
                text: result?.distance?.text || 100,
                value: result?.distance?.value || 100,
              },
            };
          } catch (error) {
            throw new Error(error);
          }
        },
      },
    }
  );

export { deviceLocationMachine };
