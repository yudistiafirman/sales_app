import {
  getLocationCoordinates,
  searchLocation,
  searchLocationById,
} from '@/actions/CommonActions';
import { hasLocationPermission } from '@/utils/permissions';
import Geolocation from 'react-native-geolocation-service';
import { assign, createMachine, send } from 'xstate';

export const searchAreaMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACDaAdDAC4AyA9pqiQJYUB2hqsA1gApjoC2tss9BgGIIjMIVoMAbhVbiUGHPnRFSlanUbM2nHnwGMEkmRsEBtAAwBdS1cSgADhQGaG9kAA9EARgsAmABoQAE9EADYAVgB2Qm8-CIBmABYEgA5UpNSo7ySAX1yghSw8AlRiMHIqGkFtDi5efkEhLnQKdEIHABsaADM27kIipVLyytMtFjq9RsNjKtdbW3cnF0F3LwQwpJjUsLiATiiw1ISLBPig0M39v0Iw46iLCKTvBP2kvz98wrRi5VUKupqhNOp0KAB3SAiMQSaSyeS-YYqMpqeY1VCgiGQIxw8YMRbWZbOWiudaIc6pWJ+Cw0tL7Cw5PaXRDxBKEaIJKJRPyvV4fD7fEBDErI0ZA1zMTGQiDNdCtdpdXr9QaIkUAsbApgYsHSnEmTUEuxIEArElrY0bClUmlnVL0xneZkIBIRSlJJLvJ5hZIRX15ApC1X-FGAtFaCBgBi0SCEPoqKCtACuDBlqAcDgAwhRuGAACoUABCqEwrCgbWTECWxtNpItPn8MS2YT8qQs7tS3nSUSdj0pbyycQerwi+0FwuDYrDTAjUZjACNi6WkymhGnM9mwAAxNpgBMUCtVxzE2ugDadiJ3CLxCxhLm3uL+J0nNl2-b7BI+rmPL4B8cjVF4oQLRtAA4hUdAMFA4pNIeJrHuap6IEctzeBE3reE2SRbK6Toum6HppOkWF7BkCRjkG-6hoBmCJnKkYaq4lCoBGMqwTWCGeIgqRobE+zpDS3r7BEDIJLhrqEO+3oJK8Zx0j+PyKGqZTCtBWiSA4iYkBBUBCJgnS-AAkgwGkkGx8GMGSCDvBeBx8a+aTPKJIQ+NJSTsu6fhHNknkelE5GKROKlTrCJnaUIwqSFBU5masFl1gg3jePShCpNSUmZBEiWpU6ORnIQfj0p8eyHJ6fm-hRopBYB6maWFEWQap+LeEaR6xW48VZG53Lnl5bz3N2zkJTylItp2nYNv2-l-CMVWaiFtWRUIjBgVpkXsN0mBwAZlaEtW5ntYhCVJRYKVpR+GVZYEg0yTEDZeZl8TpBEU1IkQs0Sst4GRY10IMOIcxyCqAUzaqjWEJ9q0NVOerRdYMVmnFh0JHssRRO+HYWFEHyeVdVyvO+EkWDcWTSacHzeC9SlA8UYMQ9pP3AQq3QkHGAx-pVoPBXT33Q3MeKGkSbWWcj3io+jvhY583I5S2+zshY6SdmExPnP6CnTRzilg4zK3aQAIjQqBCPDJ6cQgUQZHcaMus8iUMhkMuHOydq7EcrxvBT5XA5rNPBcKABqGKJmATEsUIHiwCQNDiKgPQkFwAAUwkWAAlOFFVvZzgEB0HIcUMxkAmxxZ5ZLcWwYe7aO+JEMs3oQDIjik0RnE8qSU4FWdzaQ2nrcWYDbb9-1woD7OZ1rwXd2tG39xAMP83Du2tQjB1m68UQvrywnZO63gDXjPJsljkRch2+yJc87cg+PgGT5BvebQPjMdMzrPU69ymdxKt9QPfM9zwaC8WpwSFvFNeNlMrvHpG2J4SUcpEzljAjGURnjUhSPkAMDAKARngMaUeqBBbL0sgAWj8EkHsbkPTxDiGhbILoBRew1uqRqBDTYbFITlFGb4qGnDbNyV0z0GHv0nIBSYugGgGBXuxRGZskhE0INsZsxxby+lvPsJ09xKS72OMJHI69jhq0DN7JhwVtRYggCw4uSFcYsg9PIm4tsbyRE5AI9WQiAJzRnNGcxe0QGHQyG5J6bZSHOOOOo6kKU+L6ObIkUh8lDGMJDAxGoniYxxl3MubxS9WFcRuClbiQSUjINCYNXsKU3Z8PsfyS+op3EShSRAQgC4Sx7grBY6RZ4-CRCpMJDsnTthxD3khBWZS9gVPiFUwRVNak1B1l9KGeI2krw2L6C8WQ1lJGiO6G8gznTRHkcjFs7owj2wvpMic0ytA0TogwJJjBQ6QEWZZLkblpJ+DeDcbYnS3lOlIXLShDj7iJGQdUsevsFk+MIfFZIEkjipQ+N6DZnZrEJRpAg1CZ9fQKw9C8EFH9r5zRqpDKAjz4r7GOLEfwHphIcnGTlF4qztkun7L4JKuK37YFpgwXWPNwVZMsQgVKMLjixIRZlbK11MovOiOvF0xzbz0NcVTd6My5SgTmVAA2UcSWHWObcF0klsKum2DsuI6Q7E0JuG2ZIQk2XKq0DnTowd7mZOAZCw6qELaEGyElR6VcbwRBys8OWuxmwdlVp5G1Zyr5gq7uq3+21tWr3uHLaShxjgK0ZGSuBZL2Toqbo8U4rp0G5CAA */
  createMachine(
    {
      tsTypes: {} as import('./searchAreaMachine.typegen').Typegen0,
      id: 'search area',
      predictableActionArguments: true,
      type: 'parallel',
      context: {
        longlat: {} as any,
        searchValue: '' as string,
        result: [] as any[],
        loadPlaces: false as boolean,
        placesId: '' as string,
      },
      states: {
        getLocation: {
          initial: 'askPermission',
          states: {
            askPermission: {
              invoke: {
                src: 'askingPermission',

                onDone: {
                  target: 'allowed',
                  cond: 'isGranted',
                },

                onError: 'denied',
              },
            },

            allowed: {
              invoke: {
                src: 'getCurrentLocation',
                onError: 'errorGettingLocation',
                onDone: {
                  target: 'currentLocationLoaded',
                  actions: 'assignCurrentLocationToContext',
                },
              },
            },

            denied: {
              states: {
                foreground: {
                  on: {
                    appComeToBackgorund: 'background',
                  },
                },
                background: {
                  on: {
                    appComeForeground: '#search area.getLocation.askPermission',
                  },
                },
              },

              initial: 'foreground',
            },

            errorGettingLocation: {
              always: 'askPermission',
            },

            currentLocationLoaded: {
              entry: send('sendingLonglatToLocation'),
              always: 'askPermission',
              invoke: {
                src: 'getLocationByCoordinate',
                onDone: {
                  actions: 'navigateToLocation',
                },
                onError: 'errorGettingLocation',
              },
            },
          },
        },
        searchLocation: {
          states: {
            inputting: {
              on: {
                clearInput: {
                  target: 'inputting',
                  internal: true,
                  actions: 'clearInputValue',
                },

                searchingLocation: [
                  {
                    target: 'searchValueLoaded',
                    actions: 'assignSearchValue',
                    cond: 'searchLengthAccepted',
                  },
                  {
                    target: 'inputting',
                    internal: true,
                    actions: 'clearResult',
                  },
                ],

                onGettingPlacesId: {
                  target: 'gettingPlaceId',
                  actions: 'assignPlacesId',
                },
              },
            },

            onGettingLocation: {
              invoke: {
                src: 'getLocationBySearch',
                onError: 'errorGettingData',

                onDone: {
                  target: 'inputting',
                  actions: 'assignResult',
                },
              },
            },

            errorGettingData: {
              always: 'inputting',
            },

            searchValueLoaded: {
              after: {
                '500': 'onGettingLocation',
              },
            },

            gettingPlaceId: {
              invoke: {
                src: 'gettingPlacesId',

                onDone: {
                  target: 'inputting',
                  actions: 'navigateToLocation',
                },

                onError: 'errorGettingData',
              },
            },
          },

          initial: 'inputting',
        },
      },
    },
    {
      guards: {
        isGranted: (context, event) => {
          return event.data === true;
        },
        searchLengthAccepted: (context, event) => {
          return event.payload.length > 2;
        },
      },
      actions: {
        assignCurrentLocationToContext: assign((context, event) => {
          return {
            longlat: event.data,
          };
        }),
        assignSearchValue: assign((context, event) => {
          return {
            searchValue: event.payload,
            loadPlaces: true,
          };
        }),
        assignResult: assign((context, event) => {
          return {
            result: event.data,
            loadPlaces: false,
          };
        }),
        clearResult: assign((context, event) => {
          return {
            result: [],
          };
        }),
        assignPlacesId: assign((context, event) => {
          return {
            placesId: event.payload,
          };
        }),
      },
      services: {
        askingPermission: async () => {
          const granted = await hasLocationPermission();
          return granted;
        },
        getCurrentLocation: async () => {
          const opt = {
            // timeout:INFINITY,
            // maximumAge:INFINITY,
            // accuracy: { ios: "hundredMeters", android: "balanced" },
            // enableHighAccuracy: false,
            // distanceFilter:0,
            showLocationDialog: true,
            forceRequestLocation: true,
          };
          const getCurrentPosition = () =>
            new Promise((resolve, error) =>
              Geolocation.getCurrentPosition(resolve, error, opt)
            );

          try {
            const response = await getCurrentPosition();
            const { coords } = response;
            const { longitude, latitude } = coords;
            return { longitude, latitude };
          } catch (error) {
            throw new Error(error);
          }
        },
        getLocationBySearch: async (context, event) => {
          try {
            const response = await searchLocation(context.searchValue);

            return response.data.result;
          } catch (error) {
            console.log(error);
          }
        },
        gettingPlacesId: async (context, event) => {
          try {
            const response = await searchLocationById(context.placesId);
            return response.data.result;
          } catch (error) {
            console.log(error);
          }
        },
        getLocationByCoordinate: async (context, e) => {
          try {
            const { longitude, latitude } = context.longlat;
            const response = await getLocationCoordinates(
              // '',
              longitude,
              latitude,
              ''
            );

            return response.result;
          } catch (error) {
            console.log(error);
          }
        },
      },
    }
  );
