import { getLocationCoordinates } from '@/actions/CommonActions';
import { getProductsCategories } from '@/actions/InventoryActions';
import { request } from '@/networking/request';
import { hasLocationPermission } from '@/utils/permissions';
import { Alert, Linking } from 'react-native';
import GetLocation from 'react-native-get-location';
import { actions, createMachine } from 'xstate';
import { assign, send } from 'xstate/lib/actions';
export { getLocationCoordinates } from '@/actions/CommonActions';

export const priceMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QAcBOBLAxmABAWwENMALdAOzADoYAXAGQHtMCb0GzKDYBrABTFR50sWGzIBiCOyrkAbg25U0WXIRLkqtRs1btOPfoOGj2COUxZiA2gAYAurbuIUDUbrLOQAD0QAWAEy+lACsAJw2AGw2wf4AzAAcEQCMoaERADQgAJ6I-sFBEfHBwUkA7En+Ef6h-qX+AL71mcrY+ESkFNRg9Bbu+nwCQiJiktKU5oqULartGl09OmL9hkMmZGZk8ovsjlZJTkggyK7o7p4+CAFBYZHRcYkpaZk5CLG+NpRJvsVJYSmxyUijWaGFaag6mm62ksegIABs4QwAO6QUadCZKUEzdSdLS9JbwxEoiAbLYwsi7eyeY5uMTnRDxCqUWL+eIJUrBGzlWK-Z65YLxT6hMpfCI8lmhYFHLFtHGQhbkzgI5GogSoBioKZwlgAMw1eCmMvBczx2w4hJVJPMZspBxctPY9IQwtKlBsRRsNiSIq+sVCfIQ3qC3OKXP8ZTCYSl01lEPm0L6mAArqhUGAyAr3IwCBBUVJ0ZsFJiVLGTVD8Xpk6n05mxNnc1bCzb7I5qSczocLhFOZQigCObEbKFStEkgGBaFPlU8r5fnVfGLo0bZrjy2bKFW0xmE3WGDm82MMYaS8bV7XKymt+eyPXIKSKxSW-s2w6PJ3EN2Pn2IgOhyOSgGdQfL4vixDEEShMUwTikuJ4rvKO4XtW24PreEDiGqGparq+rHmC8Hxg+G6XjWiE3nuDb3s2DhUocNKnHS77OrErpJNEvilAOsQAkkGTZH44RuiUnF+rO3apLB+FyoR66ImaAAi3QEOgcJoZIwg0AQZDYAASmA7QEAARnCYCtnR7aMaAFwBK6AKhAks5gTY4b+OOg6UKU9kcc5jLxJKTTSnB0mmoqcnkopmkqWpEAaVpun6SQRkmXsdpHBZjpMbOHw2AucQBMEVSDhEfEvIU-iUJB8SeRyNgOSBknYnGIV9EmZBpgZxlgOIpC5gA6gQqBkOQUBmfaDEZVZH5lMyjIVGxeRfP6-EIIyES9v4Q7xIk7yVEk8QNaWZ5kZQuZDZAlB6mmUDqq16EEMgyAAMIMHgYAAEJENw10MLdADKmk0KZtFjR2k0IAAtBU2VFN6yRVMKRQBr4W0Ve8woxH6FTBKUB2nghRGneg52GZ9323eI91PS9YAAGIamAZNkBA-0sEDqX0aD3i5O6U6RDEs6lFVUSlEj8TlcUI6+PZg5siyuMEQAKtpnDXWAYCvRmAAS6AxWQUDiLAxDIgAgqr6s1qNaWvk6e3BJQHHvN21QbcjMQBkkdm9hEIF1NxnIshE8vSUrmAq2m5sZr9RvEt1OtgKb4cazQlsc5ZXMQ2UHyFQKPK+9BBXu6B5XVFynk1KE3ylIHAUxnj8y8OqEBJpgNCUIiObDQ3DBNy3aIyIWky1wRtBdz3rft7rUCj83NBUeStovuNb5g3tHysixI5RCkP6uctG0pL2DyRAjoRi7EQdNd008t23FGd43M8YamWHINqNCXQaQ-BVfD83xP9-dxnnPdwC9zLWyYuDcMdsPZxFZGxCCcQuTuy2kkEI9wvTIx-KUZGF8yw0Gvq3HQDMNRE1gGheuv8aCwA+rAMAAB5Mgj1WZQBIXAPu4wB7FikpffBlCNzMNYWQii50R6UOoVwehjCBEYDgMA6wLZgZWyXk6YclBagYLqL8YUYFggBn8JUYMxVQKhhyqfXBZ4CH8MBiwmRQj9wQAoYAlu4jaEMKYdYwRT91SalfjhQQeFGp4MsUQmxpDyGiKcVQmhkj3HENsXInYCj2bpWXuncGRVmSFG9hxe4VQxx7wMR5IxOjPRS32jXZc39eGRKsXEsJwiHFoEiWpdgj1iBaRgLE0JcAU4pKdJDcMh8RwOTZKUIqJVcgcVQe6Pau0coJDSOY+UwTpH1PsYaZpDTxDsAAKJMz0u0SAvTwFg0gQuIpRQ0jDmiNkiZCBAhgUoMkXip9vRsSrufKUZBu5wGpJUiEi9OYXHBgKYCI5sG8QXNxMWAZwZRDUQsn8hREi1E+SCIKPCyKArTsC8Ma13QlF4rxaots9GujiGM5ymiJRRGrui7heDjpcAGEYYYE0lFAsQF8IIvEEHui9FUKWvh3Zik+Kiq4bI8jgSWTJRUFpiTYvZV2ZIFVvan0SOJEC7sSgIo4okdG3scrlPpYEo6RFNykVQg0xVqSLiMnKg5Ko3tAheieMtBIWcuSpECFXDacMZXNSWJhVAABxborA9ZYrAcopibEvhqK2m8IcZR7hLReGUYMHtQyaI5GkBoFSMWMqImFdwEVlJwh2c-VANqbbRFYuxTi0FuJw3HNBNRHIvh-H0dEfyJrDr41kg+MtUVrXRs5c6QSAdhI5TqMkNNDJ3IVzSEYretsA1rkVDqcgpwGA1qYlBe2PJ4g7WHKfHK7t3RBGqKBKW1zm3BHXdeSgrV2qJU6nusGTkE1fDZNohcfNAKPNSNEbGlR7Ue0fcdQmkAP1pN4oKAlsNiUI10e63iTy2LI1SILIWaLAoMrNeuaDDjLoMxukzWDFwNohB9qfCCFQ6hbXiEjHKbpEhjOqvZSIgRIME3TETBxJNMBfXIxASjiBIGuk9O89keaShutKqx7lc0viemxr2-DpqqAh3ExDcMgps5shTWBMCdyKiMk+N8IcCQqi+TpZp-tlAQ5hzVknbWk9dOoMZO8EoLIBRRA4gXZaHtChPPDG8PaYpAhFBlc5ggZsk5R0tJ53sqnfN5ESDOoL6b-afC5AVVIBUqr1QLQR5ZlDdMgpZPbcFYkoUJF3umtVeX7L5ABMjR2j7LH-z1gQyr4ZJwexqDlH8jJIIsXdmMtaAoCqQsZCODTX8eErI8bYtClWOs1a5HVsUDW9G-HFoUFkVc2sFV8F1vhITBHhJ-pElxMTVm-LHTiiTkXMnbRyTZjaqGXj6PeG6EC2MCr5EFt2C7NSrtrYaZQYNYaaARqnmIjbAItsQu9rtmFe8xKfGqrUBc2NQLg7HrU7pdiGwbLHut57SqJNgeZPoliZQxndvyb92bbpBx-jiGUUZMrYfhuGl0wR-XJw2TSH5fRfkeTnuC+qp5NQCdchZGURojQgA */
  createMachine(
    {
      id: 'price machine',
      type: 'parallel',
      predictableActionArguments: true,
      schema: {
        services: {} as {
          askingPermission: {
            data: boolean;
          };
          getCurrentLocation: {
            data: {};
          };
          fetchLocationDetail: {
            data: {};
          };
        },
      },
      context: {
        longlat: {} as {},
        locationDetail: {} as {},
        routes: [] as any[],
      },

      states: {
        getLocation: {
          states: {
            askPermission: {
              invoke: {
                src: 'askingPermission',
                onDone: [
                  {
                    target: 'allowed',
                    cond: 'permissionGranted',
                  },
                  'denied',
                ],
              },
            },

            allowed: {
              invoke: {
                src: 'getCurrentLocation',
                onDone: [
                  {
                    target: 'currentLocationLoaded',
                    actions: 'assignCurrentLocationToContext',
                  },
                ],
                onError: 'errorGettingLocation',
              },
            },

            currentLocationLoaded: {
              invoke: {
                src: 'fetchLocationDetail',
                onError: 'locationDetailError',

                onDone: [
                  {
                    target: 'locationDetailLoaded',
                    actions: 'assignLocationDetailToContext',
                    cond: 'isHasResult',
                  },
                  {
                    target: 'currentLocationLoaded',
                    internal: true,
                  },
                ],
              },
            },

            errorGettingLocation: {},
            locationDetailError: {},

            locationDetailLoaded: {
              entry: send('distanceReachable'),

              on: {
                distanceReachable: [
                  {
                    target: 'finito',
                    cond: 'isLocationReachable',
                  },
                  'unreachable',
                ],
              },
            },

            finito: {},

            unreachable: {
              on: {
                hideWarning: 'finito',
              },
            },

            denied: {
              states: {
                foreground: {
                  on: {
                    appComeBackgroundState: 'background',
                  },
                },

                background: {
                  on: {
                    appComeForegroundState:
                      '#price machine.getLocation.askPermission',
                  },
                },
              },

              initial: 'foreground',
            },
          },

          initial: 'askPermission',
        },

        Tnc: {
          states: {
            agreementHiding: {
              on: {
                showAgreement: 'agreementShowed',
              },
            },
            agreementShowed: {
              on: {
                hideAgreement: 'agreementHiding',
              },
            },
          },

          initial: 'agreementHiding',
        },

        getProduct: {
          states: {
            loadingProduct: {
              invoke: {
                src: 'getCategoriesProduct',
                onDone: [
                  {
                    target: 'categoriesLoaded',
                    actions: 'assignCategoriesToContext',
                  },
                ],
                onError: '#price machine.errorGettingCategories',
              },
            },

            categoriesLoaded: {
              states: {
                getProductsBaseOnCategories: {
                  invoke: {
                    src: 'getProducts',
                    onError: 'errorGettingProducts',
                    onDone: 'productLoaded',
                  },
                },

                errorGettingProducts: {},

                productLoaded: {
                  on: {
                    onChangeCategories: 'getProductsBaseOnCategories',
                    onEndReached: 'getProductsBaseOnCategories',
                  },
                },
              },

              initial: 'getProductsBaseOnCategories',
            },
          },

          initial: 'loadingProduct',
        },

        errorGettingCategories: {},
      },
    },
    {
      guards: {
        isHasResult: (context, event) => {
          return event.data.result;
        },
        isLocationReachable: (context, event) => {
          return context.locationDetail.distance === 'hai';
        },
        permissionGranted: (context, event) => {
          return event.data === true;
        },
      },
      actions: {
        assignCurrentLocationToContext: assign((context, event) => {
          return {
            longlat: event.data,
          };
        }),
        assignLocationDetailToContext: assign((context, event) => {
          return {
            locationDetail: event.data.result,
          };
        }),
        assignCategoriesToContext: assign((context, event) => {
          const newCategoriesData = event.data.map((item) => {
            return {
              key: item.id,
              title: item.name,
              chipPosition: 'right',
              totalItems: item.ProductCount,
            };
          });
          return {
            routes: newCategoriesData,
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
        fetchLocationDetail: async (context, event) => {
          try {
            const { longitude, latitude } = context.longlat;
            const response = await getLocationCoordinates(
              '',
              longitude,
              latitude,
              'BP-LEGOK'
            );
            return response;
          } catch (error) {
            console.log(error);
          }
        },
        getCategoriesProduct: async (context, event) => {
          try {
            const response = await getProductsCategories(
              '',
              undefined,
              undefined,
              undefined,
              undefined,
              true
            );
            return response.result;
          } catch (error) {
            console.log(error);
          }
        },
      },
    }
  );
