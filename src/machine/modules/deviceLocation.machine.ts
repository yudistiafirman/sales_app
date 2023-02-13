import { assign, createMachine } from 'xstate';
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
  distance: {
    text: string;
    value: number | null;
  };
}

interface IGuard {
  isGranted: (context: any, event: any) => any;
  type: string;
}

const deviceLocationMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QTANwJYGMwBkD2mAhgC7p4B2AdOhADZgDEhsA1uuVAApgBOAtuliwy5ANoAGALqJQABzzDSFGSAAeiAIwA2LZQDMBvQCZxRrXq0B2cQFYALABoQAT0RGjeypZvjfNgJwadnriVpYAvuFOKBjY+ERKVMws3PyCwhQMEBRg1OSoeCy5MVi4BCQilMmpAkIiCOwFCSISkq0q8ooiKuoIAbqm4gAcGpb+RkF2dv5OrgjuNpRGPr5apnajvnqR0Wil8RUUVbS0eADukFk5eQVFlCVx5YnHpxcQDflPLVLtSCCd6ESPUQVjslDsWiGljs9hM4ksE1miBGlBWviMQ38IR0dgiURADzKzSOKAARngAK7kbAMVSwYgkXKEABmxF4AAoVgBKLJ7R7EqhkynUsC-OQKQHdP69IwIyhaOyhZZIhB6DTiJYrDQ2cwI4Y7Al8omHKgwYikDgHRIAETADPQtFgAHlyABhAAWhA4jGy5FyjUKxSNVsqZotUBDFFt9sdLo9XpgHyaJtaYv+EqB0sQekClChNhVao1y182t1JiGBsJkaSJ3Ol14PDwPEosloJGZzb492DXyOhDrbyTfbEPykHQzUtAvXV4g0qI0JhsQymHihRkLlnn4jVehsGgsE38UO2BvIeBQ8D+1ZHE66yizCAAtHYhiqn4t-F-vyENF-pmYVa9gK1B0GAd6Sg+06IHYG4uG42iUNoOhDHuNg+P4NjGEBsTGs81S8LUGTkBBmbQaqNiWKiNgmFYoyBLYBbwfMvheFqOp6HqYw2Dh+wji89YQKRU5qIg0K6EYWJ6DCIzoSMcFzNJEkjHu4i4uhsG4rx-Imj25JUtgwlQaJCDiCqipDEhOiQmhGFYTx+I3iBYbsBGI7RoQDrOm6nrekZJGPmZzHLv48rWah6F2aekRAA */
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
        distance: {
          text: '',
          value: null,
        },
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
            // onError: 'errorGettingLocation',
            // onDone: {
            //   target: 'currentLocationLoaded',
            //   actions: 'assignCurrentLocationToContext',
            // },
            onDone: {
              actions: ['assignCurrentLocationToContext', 'dispatchState'],
            },
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
            console.log(position, 'ini apaa??');
            const { latitude, longitude } = position;

            const { data } = await getLocationCoordinates(
              // '',
              longitude,
              latitude,
              'BP-LEGOK'
            );

            const { result } = data;
            console.log(result, 'loh loh');
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
            console.log(error, 'deviceLocationMachince');
          }
        },
      },
    }
  );

export { deviceLocationMachine };
