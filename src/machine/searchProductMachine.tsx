import { assign, createMachine } from "xstate";
import {
    getAllBrikProducts,
    getProductsCategories
} from "@/actions/InventoryActions";
import { BatchingPlant } from "@/models/BatchingPlant";

const searchProductMachine =
    /** @xstate-layout N4IgpgJg5mDOIC5SzAQwE4GMAWACADugPYQCumALgHQCWAdvqRRfVAMQoY6sAKxZlWAG0ADAF1EofEVg0WROpJAAPRADYAHBqoaRAFgCsATgCMAZj0i1mgDQgAnoj1GzVPQCYjaoxr0az7gDsGkYAvqF2nFh4hCTk1PSMzKwcaNG8-PHCJhJIINKy8op5qghq7q4mRgYBgc7mgbYOTiaBVNVmJl3u7nqaFeGRaTgEmZS0DEwsdOwKAMLYqDNgACqoAEaiuVIycjQKSqWa2rqGphZWTY4IZl7tjQbWwUFWeoMgUSOxAgmTyTNsTAAGzSAEk-lslAU9gcSohAl12iIKmZGoEDMEzAY7NcAiY3EZCYFqr0TCJCe9PjExtQqSkIAowBMAG5EADWTKpozi4zpMwQ9FZmFQRS2kLy0KKh0QnSMVAxGhM7i05O8In0OMQXQM2hEnTMIn8Rj0gVRakpw2pPNplpSYHQxHQVHwQJFADMiOgALZULnfeK+238wVEYWi8TinaFfbFUClMwWeUaAzGJXWMlGQKahAmDxqKhpixmDRqEyKwIWrhWn5UMNgKCemhwAAyRFQEEgVBg-ygfGtsDYDLoTJDHMDVe5NbrDfQTdgrfbne7017NNgAroQpFMbF4ihuylcIQBnc2fMPio7gxprUzhTfjeEQ+lsnAenjZbbY7EC7YB7fZ+Ad7UdZ1XQoD1vXHaJX3Gd9Z0-Rcf2XDJ+w3LdwzESN8gPGNpQQZU5VONQRFaPwfACNRs0VeV1XVE0fC6TQzEraD-XGGgIBBVI6AgXgMFQL1hD3CUcNhOMtSvAlCWNQ0fA8DRszvdpPG8Xx-CCEIWK+GkqGAz0AHE-xXOYRXrD8B3QP90HsQyexMigzPgoTtmw6MxJUGUqnlYIlRVLwjDos8r3xB8zFvU1yQGJ8-R0vT0FslcAKyAAREVUDYSyKGshKUMA1KKFQLDJVwo8CJ0fRiNIkJ1Mo5p8PVKg6kJLQTw8BMK3eOgSDgJQYutfc3NjDyEAAWnMEQqE0BjMUMPQH2zEaDHaaSsTmkJOkec1opfNjfiSFcBphIbShNPRJseVpiQqGSRGxOqDC8yxyg8IwryvE0tOrAM+SgQ7D3E0aNHcSbqtafxZvmuq0zldwrC8Exb2vaxPpg6g4LnBdvz+kqAZqbQ9FRE9c2TDFvDPZF8y0ZVbw6fwOqGCddtrUyZwxr8lyM3Ksmx9zSh1fMCfRdxiZTRojDPLozuLamHvJWSUaZjiQR546nFPe7Hqsdw1EaNStDCbbGdih0DM5mZ7McucVbw4IJpNBHemCTNMTPAwrGW8jdFNE8vAV43HRymYksEfLUGto8RtcCrbisQJyXMOns21iaE1u16gcsRUS3CcIgA */
    createMachine(
        {
            id: "search product",
            predictableActionArguments: true,
            tsTypes: {} as import("./searchProductMachine.typegen").Typegen0,

            schema: {
                events: {} as
                    | { type: "searchingProducts"; value: string }
                    | {
                          type: "onChangeTab";
                          value: number;
                          selectedBP: BatchingPlant;
                      }
                    | { type: "onGettingProductsData"; data: any[] }
                    | { type: "getCategoriesData"; data: any[] }
                    | { type: "clearInput" }
                    | {
                          type: "sendingParams";
                          value: number;
                          selectedBP: BatchingPlant;
                      }
                    | { type: "retryGettingCategories" }
                    | { type: "retryGettingProductsData" },

                services: {} as {
                    getCategoriesData: {
                        data: any[];
                    };
                    onGettingProductsData: {
                        data: any[];
                    };
                }
            },

            context: {
                searchValue: "" as string,
                routes: [] as any,
                selectedCategories: "",
                batchingPlantId: undefined as string | undefined,
                page: 1,
                size: 10,
                productsData: [] as any[],
                loadProduct: false,
                errorMessage: "",
                distance: 0
            },

            states: {
                inputting: {
                    on: {
                        searchingProducts: [
                            {
                                target: "searching",
                                actions: "assignSearchValue",
                                cond: "searchValueLengthAccepted"
                            },
                            {
                                target: "inputting",
                                internal: true,
                                actions: "clearData"
                            }
                        ],

                        onChangeTab: {
                            target: "categoriesLoaded.gettingProducts",
                            actions: "assignIndex"
                        },

                        clearInput: {
                            target: "inputting",
                            internal: true,
                            actions: "clearData"
                        }
                    }
                },

                searching: {
                    invoke: {
                        src: "getCategoriesData",

                        onDone: {
                            target: "categoriesLoaded.gettingProducts",
                            actions: "assignCategories"
                        },

                        onError: {
                            target: "errorGettingCategories",
                            actions: "handleError"
                        }
                    }
                },

                categoriesLoaded: {
                    states: {
                        gettingProducts: {
                            invoke: {
                                src: "onGettingProductsData",

                                onDone: {
                                    target: "#search product.inputting",
                                    actions: "assignProducts"
                                },

                                onError: {
                                    target: "#search product.errorGettingProductsData",
                                    actions: "handleError"
                                }
                            },

                            entry: "enableLoadProduct"
                        }
                    }
                },

                idle: {
                    on: {
                        sendingParams: {
                            target: "inputting",
                            actions: "assignParams"
                        }
                    }
                },

                errorGettingCategories: {
                    on: {
                        retryGettingCategories: "searching"
                    }
                },

                errorGettingProductsData: {
                    on: {
                        retryGettingProductsData: {
                            target: "categoriesLoaded.gettingProducts",
                            actions: "handleRetryGettingProductsData"
                        }
                    }
                }
            },

            initial: "idle"
        },
        {
            actions: {
                assignSearchValue: assign((_context, event) => ({
                    searchValue: event?.value
                })),
                assignCategories: assign((_context, event) => {
                    const newCategoriesData = event?.data?.map((item) => ({
                        key: item?.id,
                        title: item?.display_name,
                        totalItems: item?.ProductCount,
                        chipPosition: "right"
                    }));
                    const selectedCategory =
                        _context?.selectedCategories?.length > 0
                            ? _context?.selectedCategories
                            : newCategoriesData[0]?.title;
                    return {
                        routes: newCategoriesData,
                        selectedCategories: selectedCategory
                    };
                }),
                assignProducts: assign((_context, event) => ({
                    productsData: event?.data,
                    loadProduct: false
                })),
                assignIndex: assign((context, event) => ({
                    selectedCategories: context?.routes[event?.value]?.title,
                    loadProduct: true,
                    batchingPlantId: event?.selectedBP?.id
                })),
                clearData: assign((_context, _event) => ({
                    productsData: [],
                    routes: []
                })),
                enableLoadProduct: assign((context, event) => ({
                    loadProduct: true
                })),
                assignParams: assign((context, event) => ({
                    distance: event?.value ? event.value / 1000 : 0,
                    batchingPlantId: event?.selectedBP?.id
                })),
                handleError: assign((context, event) => ({
                    loadProduct: false,
                    errorMessage: event?.data?.message
                })),
                handleRetryGettingProductsData: assign((context, event) => ({
                    loadProduct: true,
                    productsData: []
                }))
            },
            guards: {
                searchValueLengthAccepted: (_context, event) =>
                    event?.value?.length > 2
            },
            services: {
                getCategoriesData: async (context) => {
                    try {
                        const response = await getProductsCategories(
                            undefined,
                            undefined,
                            context?.searchValue,
                            undefined,
                            true
                        );
                        return response?.data?.result;
                    } catch (error) {
                        throw new Error(error);
                    }
                },
                onGettingProductsData: async (context) => {
                    try {
                        const {
                            page,
                            size,
                            selectedCategories,
                            searchValue,
                            distance,
                            batchingPlantId
                        } = context;
                        const filteredValue = searchValue
                            .split("")
                            .filter((char) => /^[A-Za-z0-9]*$/.test(char))
                            .join("");
                        const response = await getAllBrikProducts(
                            page,
                            size,
                            filteredValue,
                            selectedCategories,
                            distance,
                            batchingPlantId
                        );
                        return response?.data?.products;
                    } catch (error) {
                        throw new Error(error);
                    }
                }
            }
        }
    );

export default searchProductMachine;
