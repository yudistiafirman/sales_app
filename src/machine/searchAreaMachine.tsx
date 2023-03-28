import {
  getLocationCoordinates,
  searchLocation,
  searchLocationById,
} from '@/actions/CommonActions';
import Geolocation from 'react-native-geolocation-service';
import { assign, createMachine, send } from 'xstate';

export const searchAreaMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACDaAdDAC4AyA9pqiQJYUB2hqANixQO6QDEEjYhWgwBuFANYCUGHPnRFSlanUbM2nSAiGil9BgG0ADAF1DRxKAAOFWLWUNzIAB6IAzACYAHITcBGDwHYAFgBON0CXf383fwAaEABPRDcAVgNCYP8ANmTA5IzUnzcDQIBfEripLDwCVGIwcioaXVV2LghuMHR0CnRCCxYaADMegFtCSpkauoadFVZWjS1Gu1NTBysbOwdnBGCfQj8XZI8T-xc-D0CPOMSEH1T04Kf-YOLi18D-Moq0Ktl5eqKJoqTAAVy6YAYM2BDEoqAgPD4DAESwk41+kzktQUy2aYIhUKBdjhCIgmhEuMYq2M62stl020Qp0I5zCmUyRQ5uWSNySDwy2Vy+QMhWK3xAE2qWPR0mwROaQgsoJIdAYUG4mBYvwAkgwlSQ1kgQBt6YxGXdAm5CIFcu4coEDCcci5eQh-MlMoQPO5-KLXqEfJlxZL-rVJfKVIrlar1ZKhFAI-oaUaTVsjTsXMEvCkDLnMgZosdMi6Ekyriy8j4XO5gpksllgxipURw5SmFGVfHuHG1Ym9D4zCm6WnQDsoq72WkIhkRdEDKE3EHyhKm6GZVVE4I9dGu4wAOL1GMABQGmDg2oghssw4Z6dcWe8qTzBfdHmLro9aVemUKYXrmQCRtZTXVtZiYfdD3jRNeH4LdRDREMplAmFCAgztezbcltBhalB2vTZb1HRAfBFFwWU8EjCmSTMzhLW5-AMT0qxSDw3BcG0bReIC-iQptNzQmNoM6bpen6IZRnXTEWz4ttUIYA90ITTCljA3DaQIs07zuZI3CtDxv0dViDCOQpXQ8HSK1eAJ3Q4s5uKksMZLAwhhJ6BTBLbAARGhUG4OQSHQeJ3Kgtsr2NG9NKI7TPnSfMTkYjkfDOMyRS9StghcXNa0zHx7ObRzZU3SUADVWFBMASR4RxYBIGgBFQQYSE6AAKTKDAASm7VdeMK2SSrKiqKHhSAwtTQinGI0jyI8SiUho6szKiL0jkyXIXiKS0vmXRDpWQuxpmPU8wAvGDkTg8RJG63anJQ0hDtQM8Lyw0LjFGiL7C0459nYiJAnzH8wh8YJXT+-xrWogsDGSKJCleZI8pAm79ru+MTwe472lc0SBhIYZ0DGHbpN65yUbVNHHrJFScNe5N8NND6ososj3Bm2dqIyBbSwQaH9lrPJ-DfIp52CeHxQYCgEXgI1CdQdT6fNABaMJXSVwJCFzXNcihrI8ktBGphxMC5ZHCaEDcYGueLa0nhF+cHWKPIlx+YCDcBWT5nUCBjfGsdYi5sJgnBzKPDt5IqxFfXpUNlD8TkQk20qr2hw0hnTbyLw319TJQkzPInldNjPVtQNPBfF4ZsjgFoX2wYhFsChvci02fHuMiomydxdL+nSfALpaRfOEJkhyUIBcrgqNzbRvU52ZWuendIIaS71IZycfJLlWSOxjafzUDZJrWrSt83dFxWLopljm8cyonNkjQih9e9uaASQqN5P5a0qi1byCJA2F8y3ozLsXSH4W2Zx3gV22ldImk9nJY2ChhMC3laq7y-gLT00Rqy6UiByaiF83SBlijkRcDpWJBFytAl211iYoX6iwcqic0FRXLl6QMZ9Ib6RmgQgI+xvQeg4gYF4wRAiUOdjxGhcDbqQTJkdC8zDTYYPIsZR0hwrgzQ-DFP6+YCyfH0nsShZQgA */
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
          throw new Error(error);
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
