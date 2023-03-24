import {
  getLocationCoordinates,
  searchLocation,
  searchLocationById,
} from '@/actions/CommonActions';
import { customLog } from '@/utils/generalFunc';
import Geolocation from 'react-native-geolocation-service';
import { assign, createMachine, send } from 'xstate';

export const searchAreaMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACDaAdDAC4AyA9pqiQJYUB2hqANixQO6QDEEjYhWgwBuFANYCUGHPnRFSlanUbM2nSAiGil9BgG0ADAF1DRxKAAOFWLWUNzIAB6IAzACYAHIQCMbg-5cPAE4DbwAWADZvABoQAE9ENwBWF0IkgHYXdPS3bxc8sLdCgF9i2KksPAJUYjByKhpdQggwBlpIQgAzCjkodAoAVwYIblQLCwBhCgBbMAAVCgAhVEwxKB6hiFMHKxs7B2cEbwM3dMIIyM8DMLCPbw8PdNiEhHSDLxcgx98I75ckoKlcpoSqyeR1RSNFSYAboOQMeo6RiUVAtEZ8BgCLTiSQgmTVWqIqFMGFw1pEuwotGaEQNOymbZIEC7Wy6A6Iby+M7eIJuCKhDw3DwGdzPRApLwRNyBDxJWVZdL3IEgCr4uQ1VXYSF2QQMCwDEh0BhQbiYFgggCSeoNjMs1lZjHZCCCYQMPn5EXSEXc-IM2TFRzCKUI6SSEXDnJuHuVmrBGrxWrpTSE+sNQhNmvT2t0tuZ9v2TMOnNlhFleT8dxyiqSAe8SUKaROUQMUqC6TbMYTccImuzKhTBqNGYTWaTjD03jMTJZBdAhw8ESCIaSySD-iiblr-zOYRdfiKANXbk70iq6p7Cb7TAHaeN3EYAHE6kOAAosFZwC1bYw7fNswscvcSSlkk5bvN4VZ1rWUaEEUoSgS6Nw3OkJ6ggSvZjkwj7PqOSIMLw-C6qIEgXqe3YYXhhDYbeUBXjS2jEgyP7Tn+joAQg-wRLBxwtoKLaBAYNbxByKSpL43iehBQpfC4qFqkQFHElRDBPjRV7cGAcI9IQFjviQ3ToNMpFoeeik6tRQ50dieFMVOdp7P+c6uGG3Hrnx3rCkJLzhJ4Ia5H4+RFL8C5yWeCmXphhCaf06CqZZmEACI0Kg3ByCQ6BxHFuGMcx9kOvY7HZEuir+IU6RhPkipPMJgYuFxwpuMkfhBkUmSheREWUZqABqrADGAVI8I4sAkDQAioJ0JCaQAFC4-gAJTcLG6GdUpPV9QNFCopAuYzo5TgcguZyetK-iKr4AIeFuQawZ47jCicEnHmUKpditp5XoSr7vpgYBfgRmJETixnyfGH2RaQ30fl+9GYbZv4OWxTlHHVXiCoEAmRBkJxbiuhBBHKQRSskBhthJ7XvZUn2Q+mb7QyM0XabpNAGUZy2matOo08adO-TD1k5SYuV5ojBXI3kbw+B4fJ1S4dV+CutbSl4fJhDyoELi2gmlC9DAUC08BMuzaAI-lToALShuc-h8tLRNBFkvwBubnLeD4-icpk-FJCK3gU+eCiYabs4HQg5unNbTZ24ujuys70qR5GC5uF8pxJP74IUk0rDsFwEDB-thx+IQnxtpVIottKUE1buqSgYq+QtmGQXpy9xs1IHlEtG0kAF0joeCmEpaytcRRZGGV01VKbrBN8JwVV6HiyW3b0BxCkXd+0EBdD0YB9IMwx92LA+8sPPuFAvE8Bm8aNehByS8vWRQZx369d60W+EAARisaz9JsR8nQ-GAhdcCqtFSnGvu8Usd8ciHifmEF+hJPqknhFnZEW00SAPYpGLi7ZPRq3cOEasAZvSliCBQwSvFOTSkBCvMiBJO5KU6EIWwFBsHIwPCGYI0obi+BcGrMMtZ-AlwoSEUSstdwRCQWZfae1+6HDmoQM6oE6wE35KBQItZwgqzuu8P0xxwwoXoSZcK4NKI3iHBw0OBMvDhAgkTbIXpMguFrDkN02RSa3F8IKcsMjOZNAstlEO8jj6HHSF4FRnIARhkEuEWsERgzY09hQ5Ic1EEmNBiDRMlFGaxRwsaK8SVRrWMOACM4nx-ApAiQ9Tk0EI4334t6aeGR-HmLWgmXqLB+qDXzixUWQCMipHKnycsNDLoJOCMoiJ4YMhhjyK0zJYUwZUwhgUqAvM-p9LyiHIs4Yh7-GuEkeseQpSuJqvw4COQl5XEelKJBTCdS0AgOaUpiQ3Sl0yBBCuZzq4vCJh8MR-wIIaxdDrYoQA */

  /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACDaAdDAC4AyA9pqiQJYUB2hqANixQO6QDEEjYhWgwBuFANYCUGHPnRFSlanUbM2nSAiGil9BgG0ADAF1DRxKAAOFWLWUNzIAB6IAzACYAHIQCMbg-5cPAE4DbwAWADZvABoQAE9ENwBWF0IkgHYXdPS3bxc8sLdCgF9i2KksPAJUYjByKhpdQkwAV3Q5BnqdRkpUCB4+BgEtcUk0Stl5OsVGlVb2sE6Zu17+iE0RBrtTUwcrGzsHZwRvX3SfILcI0I8wsI8Dd1iEhBSvCLdAjyTvrPTvDylcrjGTVQgVHDLJpCCwtEh0BhQbiYFjjACSDFhJF2SBA+1suiOiCCYQMPmuEXSEXc1wM2WeiHCKUI6SSEXZpzuFKBIAhVTkNT5UJUMLhCKRfKEUGF+mMe2sBMYRJOAKShG+eT8Hm8OX+SQZJyShTSBiu3gMHyC6StPL5k0FIOwMsEmLFUu4ksRMr03jMuPxh1xxw8ESCLKSyTCSX8UTcBryGUIYRJfiKSUuRrctsd9vBjudovh7sYAHE6uKAAosVCYOBoiA4ywKwOgY6nb7qpKagza3XefXxRlcwhFUJdkl3O7pbPSflEIVbJql8tSmW8fgu0QSPOz3ML7pMZdFr2LxgbbSzWUmOX+5uEoOII1eK2RfIuFwfQIDl467WEal+Jk-xBB4yRJDOExgvul6EEe4prmA7QUOghAWNWJAAGbIQAtjukECnhkKnoeDBlse0rEeexE7DeTYHPeraPm4I5Ut4UQAuaSRdhE8ZuJcaQpD2nwGEEOo9hBoIEdBdiEIh6DIWR8HEQAIjQqDcHIJDoHEimrtRtF4neSoPgg2Rhv8-iFOkYT5P86TxjZETqqayR+FGRSZBJc4OrOzp8gAaqwLRgKsPCOLAJA0AIqAYSQiEABQuP4ACUHo5lB+bEYR2CBSwwWhQ2BkBgxTiMiG5yUsJdKnMkIHxi4UYjp47gPKabFZmUvLpVJmUHrU5FVjWYD1uuQybqM2V7r1MGkJW1a1vWVEHjRfp0Yq9gmXkEReLcgSBAYkQZKa9URoQQQ-EEHzJCJ-wRF5U2+Vls1SoNC0QNwcnIah6FYeguF2hlj19c9iKvcN6wjMtxiNoZ9HGYxJxZGSAJXB+74fAYEa8YEI4RGE3jnQCFKY6UnUMBQ-TwLiAMCvKcMbQjAC0rL-v4VygZdQRZNtBqM6c3g+P4IkgUTbhuNZ91ggoxF0+tyqM+LrOmttfGhtz3y858SuciGfGgayksEdLfWsOwXAQLLLalQgfiEC4QRWrZjwWp8-YGsmqRdv8+QWmyRQROBnU01MXQwfMHShysFB9JAlslW24ROdalL4+44R6ga1Lqg7ITRttNX24bIfOhhQi2BQcfw9baYssEnx3L4DX9jxg4nP4ds55j75o8md1B9187TVbxVV8cYQsVE7HapjXY-N+jLhALNlccB7Khh4LhFz5lQFq65GVwz1vnV4i-J9kVKZC48Y5GS2Qifcvi3JqW-Zc6cF6QeB-KukXj+KypzpjZJjcI8YA6e3SKEHUDtkhJTCC-aSTRProF0ieA8qlIpfxMl2ZiB13Diy5mLB2MRW6+E8GdFwXE2SXE+F+eBQ8mgBSCiFaOaxMEI37JkFkhQohp18OmDwoDgiEDpCGAOrIeEZDoUDGaK5QbzXBmw62bE8Z22jFGI0W1PjYzVDkDeng2btVJsUIAA */
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
        errorMessage: '',
      },
      states: {
        getLocation: {
          states: {
            allowed: {
              invoke: {
                src: 'getCurrentLocation',

                onDone: {
                  target: 'currentLocationLoaded',
                  actions: 'assignCurrentLocationToContext',
                },

                onError: {
                  actions: 'clearResult',
                },
              },
            },

            currentLocationLoaded: {
              entry: send('sendingLonglatToLocation'),

              invoke: {
                src: 'getLocationByCoordinate',

                onDone: {
                  actions: 'navigateToLocation',
                  target: 'finito',
                },
              },
            },

            finito: {},
          },
          initial: 'allowed',
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
                onError: {
                  target: 'errorGettingLocationData',
                  actions: 'handleErrorGettingLocation',
                },

                onDone: {
                  target: 'inputting',
                  actions: 'assignResult',
                },
              },
            },

            errorGettingLocationData: {
              on: {
                retryGettingLocation: 'onGettingLocation',
              },
            },

            searchValueLoaded: {
              after: {
                '300': 'onGettingLocation',
              },
            },

            gettingPlaceId: {
              invoke: {
                src: 'gettingPlacesId',

                onDone: {
                  target: 'inputting',
                  actions: 'navigateToLocation',
                },

                onError: 'errorGettingLocationData',
              },
            },
          },

          initial: 'inputting',
        },
      },
    },
    {
      guards: {
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
        handleErrorGettingLocation: assign((context, event) => {
          return {
            errorMessage: event.data.message,
            loadPlaces: false,
            result: [],
          };
        }),
      },
      services: {
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
            throw new Error(error);
          }
        },
        gettingPlacesId: async (context, event) => {
          try {
            const response = await searchLocationById(context.placesId);

            return response.data.result;
          } catch (error) {
            customLog(error);
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
            throw new Error(error);
          }
        },
      },
    }
  );
