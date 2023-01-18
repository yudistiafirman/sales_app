import { assign, createMachine } from 'xstate';
import { getLocationCoordinates } from './priceMachine';

const LATITUDE = -6.18897;
const LONGITUDE = 106.738909;

export const locationMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsD2BjAhgFwJaoDsA6AJzHTFwDdcCoAFTEzAW1gGJYwCJaoBhVKhKNmbANoAGALqJQAB1SxceQnJAAPRAA4AnEQBsARgDMAdgCsu3dvMAWC0e0AaEAE9ERg5KK6zAJgtJXRN-A39JAwMAX2jXNCxVYhhsPDoAGQwcfAIAETBsTFxkDghCMCJaKlQAawqE7MIiFLSoTMSc-MLi2AQqrKSpaSH1RWUk9S0EAFptIyJtCxMjfzmTE11wgxNXDwQTbR8HQP8QmxDA2PiBnKJ2xryCouRMzAhIdgBRKm4RpBAxiocpMdPMLGYzLpJCsDisnLtEHY-EQIpDrJYNkE7LE4iACKh3vB-g0Jv9AaTQFNpit9ItlqtTBstjt3J55tDJJyItsDpIsVcQCTbmQKNQ+KJWESFEogWp-lNvAiEDYiHZtOELHYostJKFtAKhU0Wnx7kkus8pQCZRTNIgDkQjFrtGYnFFdWZzEr-C6iJznQYzJzIZrLrjDcRTZ0nsVXu8IKNrcD5XaTCjjEH-GqDCEzAYlRZwSjJGi-EtdPycUA */

  /** @xstate-layout N4IgpgJg5mDOIC5QBsD2BjAhgFwJaoDsA6AJzHTFwDdcCoAFTEzAW1gGJYwCJaoBhVKhKNmbANoAGALqJQAB1SxceQnJAAPRAA4AnEQBsARgDMAdgCsu3dvMAWC0e0AaEAE9ERg5KK6zAJgtJXRN-A39JAwMAX2jXNCxVYhhsPDoAGQwcfAIAETBsTFxkDghCMCJaKlQAawqE7MIiFLSoTMSc-MLi2AQqrKSpaSH1RWUk9S0EAFp-OyJ-Iz9dQN07I38V3QtXDwQ7daJJCzMjO20jLxM13Ri4kAakokfOgqLkTMwISHZCfgALTB0MAAJTAUByIyQIDGKhyk0Q-jM8xs1wMZhs2m0Bhsu0QFixRDsOLOdkCFn8cwssXiAxyRG+ACNUABXAgUdgaWCFbAVTAAM15JAAFEZJOKAJTsF5NJms9lgKEKJRwtTQqbXbRHbFGDEE3RnTZ4hAmby+KJWHHBcUXWL3Aiob7waEygijFUTdWIaYBBZLDGrdabEzGy5HMXi8WLSTEuzmGkPOlNMgUah8USsZ3K8bwr0IbzGmxE7GBYkGExi0LaBOu5oFVrtRp5N49d05tWgDVas4GbSnbHeczmY1IoxHSR99HivVk6n3WuurrvT7fCBt1VuvMmEwLYzTubYkJmAzGiwnBaSDHWSzXIJ2GtJ4hytkUdeezuIa7+IhmEzY496NoBJmMexpkj4twGJaujWhORh2tEQA */
  createMachine(
    {
      id: 'location',
      predictableActionArguments: true,
      tsTypes: {} as import('./locationMachine.typegen').Typegen0,
      schema: {
        events: {} as
          | {
              type: 'sendingCoorParams';
              value: { longitude: number; latitude: number };
            }
          | {
              type: 'onChangeRegion';
              value: { longitude: number; latitude: number };
            },
        services: {} as {
          onGettingLocationDetails: {
            data: {
              formattedAddress?: string;
              PostalId?: number;
              lon: number;
              lat: number;
            };
          };
        },
      },
      context: {
        region: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
        },
        locationDetail: {},
        loadingLocation: false,
      },
      states: {
        receivingParams: {
          on: {
            sendingCoorParams: {
              target: 'gettingLocationDetails',
              actions: 'assignParamsToContext',
            },
          },
        },

        gettingLocationDetails: {
          invoke: {
            src: 'onGettingLocationDetails',
            onDone: {
              target: 'locationDetailLoaded',
              actions: 'assignLocationDetail',
            },
          },
        },

        locationDetailLoaded: {
          on: {
            onChangeRegion: {
              target: 'debounce',
              actions: 'assignOnChangeRegionValue',
            },
          },
        },

        debounce: {
          after: {
            '1000': 'gettingLocationDetails',
          },

          entry: 'enabledLoadingDetails',
        },
      },

      initial: 'receivingParams',
    },
    {
      actions: {
        assignParamsToContext: assign((context, event) => {
          return {
            region: {
              latitude: event.value.latitude,
              longitude: event.value.longitude,
            },
          };
        }),
        assignLocationDetail: assign((context, event) => {
          return {
            locationDetail: {
              formattedAddress: event.data?.formattedAddress
                ? event.data.formattedAddress
                : '',
              postalId: event.data?.PostalId,
              lon: event.data.lon,
              lat: event.data.lat,
            },
            loadingLocation: false,
          };
        }),
        assignOnChangeRegionValue: assign((context, event) => {
          return {
            region: {
              latitude: event.value.latitude,
              longitude: event.value.longitude,
            },
          };
        }),
        enabledLoadingDetails: assign((context, event) => {
          return {
            loadingLocation: true,
          };
        }),
      },
      services: {
        onGettingLocationDetails: async (context, event) => {
          const { latitude, longitude } = context.region;
          const response = await getLocationCoordinates(
            '',
            longitude,
            latitude
          );
          return response.result;
        },
      },
    }
  );
