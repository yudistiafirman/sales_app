import { searchLocation, searchLocationById } from '@/actions/CommonActions';
import { hasLocationPermission } from '@/utils/permissions';
import GetLocation from 'react-native-get-location';
import { assign, createMachine, send } from 'xstate';

export const searchAreaMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACDaAdDAC4AyA9pqiQJYUB2htEANmAMSqwDWtDUAAph0AW1qxY9BgG0ADAF1EoAA4UpdRspAAPRAEYAHADZCATjkBWKwCZLhywGZjlmwBYANCACeiY+8IbM0cTG2M3OwB2RxsAX1ivFAwcfHQiUkpqTSZuHmExCSlGDghGMGYGADcKHnKkrDwCVGIwcioaaUJc-PFJaQR+aqzpeQVR7TUNaW09BH05R0DXSzdVyLMVs30vXwRLSNNDRxCVmytIt3jEtAbU9NbMjsYu3h7C6Q4RdAp0QhVWGgAMx+okI9RSTRabWGz26Il6RQYAyq7Wyo3GSBAk1o2RmfjcZkI+n0IUMcnmZkMZncOz8+hshEckUi+i2YTkVhiVxA4MaaWaGVRnVQrFYFAA7pASmUKtVamCbhD+VDHtkuqKJZBkUMnrJFBjVOocdNMbNjoSmXY3P5LMT7BtaXMWYQyW5InJjHIzBs3LbItzeXcBQ8hbCNZKIJ90N9fv8gSCFck+fdobr1WKI9rQ3qxooJkbcabEObGZErTa7VTLI6bAdCMYyY43IYbDZjjYHAHFcng6m1RAwAxaJBCMC0lBvgBXBiR1AqFQAYQoojAABUKAAhVCYHhQH7TiAGrEFk2gWbzDsuylbaJuVnex3+QxEuQsn2RQxurtJoMq7OEAchxHAAjbddynGcuHnJcVwAMR+MAJwoA8j2xQszwMExzCsWx7CcFxHEdSInHrORP09ZxjCZYx-QSHlu1-QUYSYL4fgAcVaOgBFVD5UJPLQiwQYwNlLNxXw-ZlLGsSJHUowhVk9D8YhZS46MDSEmLTTBJ2jQc+2kShUAHSMUBnfgoEoAQARIdceMYPipgEjCECORZDHc9zaxZM4TEdfR3UZfQxLdYTLDMcJaOuH9IV5OymH4FRJxILioA4TB2AwABJBhEpIBzjSc3QDAieSyKCqTjmidxPB8Ax6QZDtWysBwKTMSL6Oi5VYv-BKkpSjheXMuL8vQoqEFJQgvXc4lazMN19BcPybHpQIP3pA4gmJKxv1uGLuziipcv6wbuOzGR9CUTE0NPMayz8uQwkm1kXCsJwdqVIhuuYw6+vMjhGA45LzMEAFMDgTLDzzK7+IYPEEEvd0HDbNYVmMNHDD8hTAjORwSQe4SDkMd6e0TBoDoBzihuzaUGHKQYajqBi9qTcmGEBlK4qzZj0Shw1HNhwT9mffxvRmlqFpse7mUC2tWVWB6myJtSma6-b-wpoHTuYqMYz+ayx1BdTVZZ9W2cprXdS53UecuvmCoF5yZsJB76XpAlDH0MKZNquYyNMMLnEMD9XvR4nfy+tNWPQdnzIAERoVAOBGm7zympY-StCIkcdb1LECDYHtcJlPbiZXOs+tXvt5AA1EVJzAQzjI4HRYBIGhylQQESBEAAKeYOQASgGlWK5Nqvu1r1h68byBk8K2Y5EdOQw+Zsn-1IFKQe3MAIZpumUXlI3R7X76N+B0Gd4gK20X1Xnj35uGPKvVkFmpdYImMTG2vrYPGyZX1iIr2NifNMZ8BBbzBrvKOet4xiFJh9ZoEc1RgKEBfCG18Ri31tvfe2cM3bPkcNeVYVIIhBAxj7IKj1gj0g9tYDkTIlZ0QYBQAc8BMRH1QPmB+gkAC04VHQ8P8m4cwywySuGiHIX0Ssoq7WVJpUa1156IDsEsTObofRbEdC2QgFwWTrCCsyEk7ggEpgOiwdgXDcGCUpKolYawNHbB9hcZ81gCQLFfM4SRlgTG9gOnCAofRCqKIdmNO8cgdEdk-EFa08xWTe12PYSILoHC42tNaT0pcZEIL-N9EUGZICWNGrMaItjVjqM2I43YrZCT7GIjETxVJCGqSySTeRnRALDggIUlOiByJEmosYBaDYjC+kdCscJVEvSOCFgsT8Piclpg6SOMciEIJdOhtw5yJD+kHEGejEZ1YfZPkIPYa0WxvQXEIZkjqsjTH-iWRAQgoEdxIQPN0pRcwwimCZAcCwEks6HN2Mc05wl7yXOpPMtpzwo4xwtgomGcN5ZXjdEcFwDYg4ekdOk8wFhaGti9mkyFIZvraV0gwfSjAZ7rLtkUvwXpsInA5NSU4hEKEBVbE2RwOE2rTPahw+B2A4rvJCbMHhzYBFB3khtCwYRnCuFrPMpBnReqaygMKvBLhGRkhcMtaZMQ3Q1V2PVRYdjwhslZCSZpNzslKueBrDm2Z1WCSOISDY7hgiTOpJUgwHZ9CTTJNSBsUiCaKsrpHaM7FzZQHjm3J1js3CEJ-raKwL0ZWGoMGRPOZFmqEKsK7aR1qSa2qYDXOuDcKBGQKRsqxzlxGBAcP4BN7gPSuD8iERYxIqSvncGcdYoax6gKjRAy+caxqK0CMcAkxI7SKT8lRP1NEUkWG9METs8RYhAA */
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
                    appComeForeground: '#search area.getLocation.idle',
                  },
                },
              },

              initial: 'foreground',
            },

            errorGettingLocation: {
              always: 'idle',
            },

            currentLocationLoaded: {
              entry: send('sendingLonglatToLocation'),

              on: {
                sendingLonglatToLocation: {
                  target: 'idle',
                  actions: 'sendingLonglat',
                },
              },
            },
          },

          initial: 'idle',
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

            return response.result;
          } catch (error) {
            console.log(error);
          }
        },
        gettingPlacesId: async (context, event) => {
          try {
            const response = await searchLocationById('', context.placesId);
            return response.result;
          } catch (error) {
            console.log(error);
          }
        },
      },
    }
  );
