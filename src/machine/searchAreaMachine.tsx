import { searchLocation, searchLocationById } from '@/actions/CommonActions';
import { hasLocationPermission } from '@/utils/permissions';
import GetLocation from 'react-native-get-location';
import { assign, createMachine, send } from 'xstate';

export const searchAreaMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACDaAdDAC4AyA9pqiQJYUB2hqsA1gApjoC2tss9BgGIIjMIVoMAbhVbiUGHPnRFSlanUbM2nHnwGMEkmRsEBtAAwBdS1cSgADhQGaG9kAA9EARgsAmABoQAE9EADYAVgB2Qm8-CIBmABYEgA5UpNSo7ySAX1yghSw8AlRiMHIqGkFtDi5efkEhLnQKdEIHABsaADM27kIipVLyytMtFjq9RsNjKtdbW3cnF0F3LwQwpJjUsLiATiiw1ISLBPig0M39v0Iw46iLCKTvBP2kvz98wrRi5VUKupqhNOp0KAB3SAiMQSaSyeS-YYqMpqeY1VCgiGQIxw8YMRbWZbOWiudaIc6pWJ+Cw0tL7Cw5PaXRDxBKEaIJKJRPyvV4fD7fEBDErI0ZA1zMTGQiDNdCtdpdXr9QaIkUAsbApgYsHSnEmTUEuxIEArElrY0bClUmlnVL0xneZkIBIRSlJJLvJ5hZIRX15ApC1X-FGAtFaCBgBi0SCEPoqKCtACuDBlqAcDgAwhRuGAACoUABCqEwrCgbWTECWxtNpItPn8MS2YT8qQs7tS3nSUSdj0pbyycQerwi+0FwuDYrDTAjUZjACNi6WkymhGnM9mwAAxNpgBMUCtVxzE2ugDadiJ3CLxCxhLm3uL+J0nNl2-b7BI+rmPL4B8cjVF4oQLRtAA4hUdAMFA4pNIeJrHuap6IEctzeBE3reE2SRbK6Toum6HppOkWF7BkCRjkGIzCtBWiSA4iYkBBUBCJgnS-AAkgwdEkLBNYIZ4iDvkksSJBh2ynEk-gRE6D77IQpxvm8URXn49w-j8ihqmUVFTrCXGMUIwqSFBU48fBjBkgg3jeFEsmka2Nw8vc3rSX4+yUk8rp2n4nJJNE5EaRO2mAbR9H6YZkHUfi3hGkeqzmXWCC7GyUS+WcyS+BEOT7NJVlsm2KUdjeYT7DkZG-hRopBZqumhUZQiMGBDFGew3SYHAbGVoS1ZmW4CVWTZhB2RYDkYfcCQuQyhA2ckpy+jybapP5fyUaqkWEA14FGZF0IMOIcxyCqAUrRpa0bU1EVTnqJnWKZcW9YhzoRBYhDUvEaGFVyzwuekdwpfsT0um9GRLUiRBVRKZ2MdtwEKt0JBxgMf6VatOmQ1tl1zHihpEndFkus9r2+scvifUkOUZC9KWZNZ5zJFkIOaYdxRrTDjWMQAIjQqBCLdZrxQ9XLJZJCRWdsaH3DlNxyb6iQ3le9IpQzgUo4BwoAGoYomYCUKgEYyh4sAkDQ4ioD0JBcAAFL4NIAJQGRVYMq9V6ua9rFC65AvMnvxlnumEcmpQ5H5vok0m+clKk5G2ZzZIt5VHcjJ06aQjEtcWYAdTte1wgdSOO0ngEp81rUZxAV1YzdXWxXz90+68zaDQk3oqYHkQ5RYlKZZ8EmpK66FRErx3M8nm2QWnbWZzDHRwwjTOg1pTsSkXY8lx15cGpXMVwbjfVN0J1ld9sElhE6CmDdZYnTdyN6D6KAHVZgiZypGGquDres81X281xZvf+94blWw3jeE9V4uFXSEHfN6EWpwPxeXyAGBgFAIzwGNHnVAOMf4JQALR+DJiEJCQlng0g9B2EcroVK33VJFTB3sNh4Okg3BkzZbx+BsueOO6llp31DIBSYugGgGFrrxfmPsJKyW2Cw3YSk0I2SdPcSk1ljigLEscf0XD56Tj4VKSAtC+IbG5E6PBEibjPF8PcRISkqEhlfjUGc0YIB6NERsDIQl0hPX5Jyd68jqSQO7oRN8UQMjeGsVo6q9iYxxl3MuRx3Ud4PS8oNXubY8FeOOD2Dug0jjWXiKY-koT74SgiRAQgC4Sx7grE42uZ4VIXjiE9DsLdshsIyZSLIexuQjniPk+O3DqE6VZqPYyeIqkWRllkrIGRojuhvN2Ahj0YgpGbK4sIDJe7qMDAnfpgFH7PwYLYxg79dFxKwQLFKck4hvBuNsFS3kjEekIB6bp5jIheNCeDPiIjqksnwVcekL4ngfhbN3R4ER3mLxqCFc6UBRkJX+jEept4LDTSyE3aSItnrRG8m5FI2TUhqU2X0heBdqpowuiMk5dCkKBHmVHWSly3j3BpAA5F4KSUSkGdCzmRtYUPRHN4OS+Lng8huCA7KtLOxskjskfxuxXRsuHqrVUGtOhayObE6uVLLKyKmi6XwGFUKRG2GHd0dwRbvCWZyf6nDCWaI+VoZeUBx6l15XXSIfYPjvDSJ2BkQTT4lReh2VZTK3KfB-PkIAA */
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

              always: "askPermission"
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
                '1000': 'onGettingLocation',
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
          try {
            const position = await GetLocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 15000,
            });
            const { latitude, longitude } = position;
            return { latitude, longitude };
          } catch (error) {
            console.log(error);
          }
        },
        getLocationBySearch: async (context, event) => {
          try {
            const response = await searchLocation('', context.searchValue);

            return response.data.result;
          } catch (error) {
            console.log(error);
          }
        },
        gettingPlacesId: async (context, event) => {
          try {
            const response = await searchLocationById('', context.placesId);
            return response.data.result;
          } catch (error) {
            console.log(error);
          }
        },
      },
    }
  );
