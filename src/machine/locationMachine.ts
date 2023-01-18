import { assign, createMachine } from 'xstate';
import { getLocationCoordinates } from './priceMachine';

const LATITUDE = -6.18897;
const LONGITUDE = 106.738909;

export const locationMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBsD2BjAhgFwJaoDsA6AJzHTFwDdcCoAFTEzAW1gGJYwCJaoBhVKhKNmbANoAGALqJQAB1SxceQnJAAPRACYAzNqLbtAdgCs2gBznj2gJy3dAFgA0IAJ6JdANi9FHd3VNdCwsARl1JXVCAX2jXNCxVYhhsPDoAGQwcfAIAETBsTFxkDghCMCJaKlQAawqE7MIiFLSoTMSc-MLi2AQqrKSpaSH1RWUk9S0EY0cLIi9bbVNHRaNI+1cPBDC-Yy89bzDQ0NMw2PiBnNJySho6UVYOQn4AC0w6MAAlMCgckaQQGMVDlJjp9IYTOYrCY7A4XO4dHoiMZJDMwsZwvY7F5ziAGkkiBAwAAjVAAVwIFHYGlghWwFUwADN6SQABShSScgCU7HxVyJpIpFH+CiUwLUAKmaPmi2Wq2061smx0syIHIsxgioQskW0C2MsTiIAIqCJ8ABfIlovGIMliAAtF5lQhHUROe6PZ6DUbLcQyBRqHwHmxRmKJnaEP5ncdQsjHEFOaYk7YMcFcb7mgVWu1GnkCkUSqGbVbNIgOeF5o5gpJQvtTPZHMZnUZfMcvFZbDrq0Z05cmgLyZSwEXxQRQZGdrZQkttDHNbYvKZm0ivLWO12dbOcYagA */
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

            onChangeRegion: {
              target: 'debounce',
              actions: 'assignOnChangeRegionValue',
            },
          },
        },

        gettingLocationDetails: {
          invoke: {
            src: 'onGettingLocationDetails',
            onDone: {
              target: 'receivingParams',
              actions: 'assignLocationDetail',
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
