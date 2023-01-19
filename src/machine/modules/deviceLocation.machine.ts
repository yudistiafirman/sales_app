import { assign, createMachine, State } from 'xstate';
import { hasLocationPermission } from '@/utils/permissions';
import GetLocation from 'react-native-get-location';
import { getLocationCoordinates } from '../priceMachine';
// import GetLocation from 'react-native-get-location';
// import { send } from 'xstate/lib/actions';

interface IContext {
  PostalId: any;
  lon: number;
  lat: number;
  formattedAddress: string;
  isGranted: boolean;
}

interface IGuard {
  isGranted: (context: any, event: any) => any;
  type: string;
}

const deviceLocationMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QTANwJYGMwBkD2mAhgC7p4B2AdOhADZgDEhsA1uuVAApgBOAtuliwy5ANoAGALqJQABzzDSFGSAAeiAIwA2LZQDMBvQCZxRrXq0B2cQFYALABoQAT0RGjeypZvjfNgJwadnriVpYAvuFOKBjY+ERKVMws3PyCwhQMEBRg1OSoeCy5MVi4BCQilMmpAkIiCOwFCSISkq0q8ooiKuoIAbqm4gAcGpb+RkF2dv5OrgjuNpRGPr5apnajvnqR0Wil8RUUVbS0eADukFk5eQVFlCVx5YnHpxcQDflPLVLtSCCd6ESPUQVjslDsWiGljs9hM4ksE1miBGlBWviMQ38IR0dgiOxA5DwKHgfweZWayj+AKBf16AFotEiEAz8WSDs8aPQOgpAd1aYg7EYmRNdNodEM9DYpeJ-DZjKy9o8KUlWDV0ny5DyaaBepLLKibCYrKNArYbMLfF4VhobOYEfDZQrYuTDkkTudINyupSdYh-OJPFpbUYYRptIKgkyNFD9IZceNIXZfENIpEgA */
  createMachine(
    {
      id: 'deviceLocation',
      schema: {
        context: {} as IContext,
        guards: {} as IGuard,
      },
      predictableActionArguments: true,
      tsTypes: {} as import('./deviceLocation.machine.typegen').Typegen0,
      context: {
        formattedAddress: '',
        lat: 0,
        lon: 0,
        isGranted: false,
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            askingPermission: 'askPermission',
          },
        },
        askPermission: {
          invoke: {
            src: 'askingPermission',
            onDone: {
              target: 'allowed',
              cond: 'isGranted',
            },
          },
        },
        allowed: {
          invoke: {
            src: 'getCurrentLocation',
            onDone: {
              actions: ['assignCurrentLocationToContext', 'dispatchState'],
            },
            // onError: 'errorGettingLocation',
            // onDone: {
            //   target: 'currentLocationLoaded',
            //   actions: 'assignCurrentLocationToContext',
            // },
          },
        },
      },
    },
    {
      guards: {
        isGranted: (context, event) => {
          return event.data;
        },
      },
      actions: {
        assignCurrentLocationToContext: assign((context, event) => {
          return event.data;
        }),
      },
      services: {
        askingPermission: async () => {
          const granted = await hasLocationPermission();
          return granted;
        },
        getCurrentLocation: async () => {
          try {
            const position = await GetLocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 15000,
            });
            const { latitude, longitude } = position;
            const { result } = await getLocationCoordinates(
              '',
              longitude,
              latitude,
              ''
            );
            return {
              lat: Number(result?.lat),
              lon: Number(result?.lon),
              formattedAddress: result.formattedAddress,
              PostalId: result?.PostalId,
            };
          } catch (error) {
            console.log(error);
          }
        },
      },
    }
  );

export { deviceLocationMachine };
