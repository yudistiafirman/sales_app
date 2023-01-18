import {
  getLocationCoordinates,
  searchLocation,
  searchLocationById,
} from '@/actions/CommonActions';
import { hasLocationPermission } from '@/utils/permissions';
import GetLocation from 'react-native-get-location';
import { assign, createMachine, send } from 'xstate';

export const searchAreaMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACDaAdDAC4AyA9pqiQJYUB2htEANmAMSqwDWtDUAAph0AW1qxY9BgG0ADAF1EoAA4UpdRspAAPRAEYAHADZCATjkBWKwCZLhywGZjlmwBYANCACeiY+8IbM0cTG2M3OwB2RxsAX1ivFAwcfHQiUkpqTSZuHmExCSlGDghGMGYGADcKHnKkrDwCVGIwcioaaUJc-PFJaQR+aqzpeQVR7TUNaW09BH05R0DXSzdVyLMVs30vXwRLSNNDRxCVmytIt3jEtAbU9NbMjsYu3h7C6Q4RdAp0QhVWGgAMx+okI9RSTRabWGz26Il6RQYAyq7Wyo3GSBAk1o2RmfjcZkI+n0IUMcnmZkMZncOz8+hshEckUi+i2YTkVhiVxA4MaaWaGVRnVQrFYFAA7pASmUKtVamCbhD+VDHtkuqKJZBkUMnrJFBjVOocdNMbNjoSmXY3P5LMT7BtaXMWYQyW5InJjHIzBs3LbItzeXcBQ8hbCNZKIJ90N9fv8gSCFck+fdobr1WKI9rQ3qxooJkbcabEObGZErTa7VTLI6bAdCMYyY43IYbDZjjYHAHFcng6m1RAwAxaJBCMC0lBvgBXBiR1AqFQAYQoojAABUKAAhVCYHhQH7TiAGrEFk2gWbzDsuylbaJuVnex3+QxEuQsn2RQxurtJoMq7OEAchxHAAjbddynGcuHnJcVwAMR+MAJwoA8j2xQszwMExzCsWx7CcFxHEdSInHrORP09ZxjCZYx-QSHlu1-QUYSYL4fgAcVaOgBFVD5QJ3dcAEk2DAABlEgaDAVCTy0IsEGZRY3DIwwyQWLZVmrHxEFrSwiSpMtKJJNtOzowNISYtNMEnaNBz7aRKFQAdIxQGd+CgSgBABEh1x4xgpKmGSMIQI5FmU0LaxZM4TEdfR3UZfRFLdYwNjMcJaOuH9IV5HymH4FRJxILioA4TB2AwASGDykg-ONALdAMCJCEUwx4ssJwmRiVZovpBkO1bKwHApMw0vojLlSy-9cvywqOF5Vzsuq9C6oQUlCC9ZTiVrMw3X0FxopselAg-ekDiCYkrG-W5Mu7bKKkq6bZu47MZH0JRMTQ08lrLaK5DCVbWRcKwnAupUiHG5jbqm1yOEYDiCtcwQAUwOAhIWj7Zkvd0HDbNYVmMPHDGi1ZTD6xwSR+pKDkMYGe0TBobphzi5uzaUGHKQYajqBirqTemGFhwrsqzZj0TzN7pIYPE9g-esgi2ekBp2mxvuZOLa1ZVYfqbKmTK5sbrv-Bm4ce5ioxjP5PLHUFTL1nmDb5xnjd1IXdRF17DX8iXZI2wkfvpekCWaywhu+rCg+cQwP0B-Hqd-MG01Y9B+dcgARGhUA4PieEEirIYEVHavPNalj9K0Iixx1vR0oJrDsNsWVcGPubp-9eQANRFScwHsxyOB0WBxJIcpUEBQf0AACgsOQAEoZt10H9fBtuO67igHMgfPPcCltCQiDkQhilS3EIzS5ibOQXTkO8fssFxm2Ixubeb8HSEKhHtzAISWbZlF5Wt+fbefg7IQiMP4QGdmifUot3Y1U3ktUKV5WSqU2hEYwhMhr1kjo2Jkvp7461Gv-J+aYX7wxAZ-BO5t4xiFpiDZocc1TEIEG-JGQlwEjEgW7Y8HtJb+2fI4a8qwqQRCCATE+8VfrBHlvoawe8PzxDogwCgA54CYj-qgfMXDZIAFoaKBDUgcVq7g2rH12JotwhAyxywsK1V8WxSYPxTNldRMDJZ2CWKXN0PotiOhbOY7aEcFgRxCGRexvYbosHYE4xasxKRuJWGsTx2wT4XGfNYAkCxXzOEvpYEJf5wZwgKH0Wq70C6ICvuYjsn54rWnmKySIjp7CRBdA4Um1prSejiHgy6ypzJqhFBmSAkS0aIGiLE1YHjNiJN2K2Qk+xiIxEyVSPhlxOk0NyWmQCw4ICDJKUFa0RJqLGB2g2Iwvp6mKXrI4L0rgOQXH0jknpnQNkjjHIhCCWyxYaK3ltfZBxDn4xORpXYT5CD2GtFsb0Fw+EdPSl0hx-4nkQEIJnJCB5tmwPPGEUwTIDgWA-BcDsgK-CXlBUle8kLqT3JDODBOSdHaLWKeixAN9GkkkMi2IOSUzA1mIvWGifUjA-WCNCkasLQn-kstZBgtlGDdwGR85xslPSEgsCcDk1JTjGIMLFVsTZLnWCGo4fYOS6EfQZZLTRrJdHxX0a4X0xwYgV1fC6IwvyzqrA2MaheaZJpGygGi7hLhGRkhcPtQ1HULh7TbCComBI-a2OWTC1ZJrniGwFtmf1skHApPWmRPqFgjh7Q5KtFwDghq5qkdrRNNNk0sWjOxIBqdxIZsCiSN0F8pHNk-F6Zs0VSaLEvgOqsdgHDZJWdWr1aol6sE7rK950ColMtrIEBw-gj7uA9K4XtRwiRGFxe4M46xPUAKIUAphoDm1LS1oEY4sbiRSM9HU0RVF9AYOaRYb0wRjLxCAA */
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
              on: {
                backToIdleState: 'idle',
              },
            },

            currentLocationLoaded: {
              entry: send('sendingLonglatToLocation'),
              invoke: {
                src: 'getLocationByCoordinate',
                onDone: {
                  target: 'idle',
                  actions: 'navigateToLocation',
                },
                onError: 'errorGettingLocation',
              },
              // on: {
              //   sendingLonglatToLocation: {
              //     target: 'idle',
              //     actions: 'sendingLonglat',
              //   },
              // },
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
              on: {
                backToInputting: 'inputting',
              },
            },

            searchValueLoaded: {
              after: {
                1000: 'onGettingLocation',
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
            console.log(context.searchValue, '<<<<IONI yang di search');
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
        getLocationByCoordinate: async (context, e) => {
          try {
            const { longitude, latitude } = context.longlat;
            const response = await getLocationCoordinates(
              '',
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
