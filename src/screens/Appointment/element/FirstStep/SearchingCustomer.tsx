import { BCommonSearchList } from "@/components";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectedCompanyInterface } from "@/interfaces/index";
import debounce from "lodash.debounce";
import { getAllProject } from "@/redux/async-thunks/commonThunks";
import { retrying } from "@/redux/reducers/commonReducer";
import { AppDispatch, RootState } from "@/redux/store";
import {
    addCompanies,
    enableSearching,
    onAddProject,
    setSearchQuery,
    setSelectedCustomerData
} from "@/redux/reducers/appointmentReducer";

function SearchingCustomer() {
    const [searchIndex, setSearchIndex] = useState(0);
    const appoinmentState = useSelector((state: RootState) => state.appoinment);
    const authState = useSelector((state: RootState) => state.auth);
    const {
        projects,
        isProjectLoading,
        errorGettingProject,
        errorGettingProjectMessage
    } = useSelector((state: RootState) => state.common);
    const dispatch = useDispatch<AppDispatch>();
    const searchDispatch = useCallback(
        (text: string) => {
            dispatch(
                getAllProject({
                    search: text,
                    selectedBPId: authState.selectedBatchingPlant?.id
                })
            );
        },
        [dispatch]
    );
    const onChangeWithDebounce = React.useMemo(
        () =>
            debounce((text: string) => {
                searchDispatch(text);
            }, 500),
        [searchDispatch]
    );

    const onChangeSearch = (text: string) => {
        dispatch(setSearchQuery({ value: text }));
        onChangeWithDebounce(text);
    };

    const onPressCard = useCallback((item: selectedCompanyInterface) => {
        try {
            const customerType = item?.Company?.id ? "company" : "individu";
            const picList = item?.Pics;
            if (picList && picList?.length === 1) {
                picList[0].isSelected = true;
            }

            if (item?.Customer) {
                dispatch(
                    setSelectedCustomerData({
                        customerType,
                        value: {
                            id: item?.Customer?.id,
                            title: item?.Customer?.displayName,
                            paymentType: item?.Customer?.paymentType
                        }
                    })
                );
            } else {
                dispatch(
                    setSelectedCustomerData({
                        customerType,
                        value: {
                            id: null,
                            title: "",
                            paymentType: ""
                        }
                    })
                );
            }

            const companyDataToSave = {
                Pics: picList,
                Visitation: item?.Visitations[0],
                locationAddress: item?.LocationAddress,
                Pic: item?.Pic,
                id: item?.id,
                name: item?.name
            };

            dispatch(
                onAddProject({
                    key: customerType,
                    value: companyDataToSave
                })
            );
        } catch (error) {
            console.log(error, "errorappointment onPressCard");
        }
    }, []);

    const routes: { title: string; totalItems: number }[] = React.useMemo(
        () => [
            {
                key: "first",
                title: "Proyek",
                totalItems: projects?.length,
                chipPosition: "right"
            }
        ],
        [projects]
    );

    const onRetryGettingProjects = () => {
        dispatch(retrying());
        onChangeWithDebounce(appoinmentState?.searchQuery);
    };

    const onClearValue = () => {
        dispatch(setSearchQuery({ value: "" }));
    };

    return (
        <View style={{ flex: 1 }}>
            <BCommonSearchList
                searchQuery={appoinmentState?.searchQuery}
                onChangeText={onChangeSearch}
                onClearValue={() => {
                    if (
                        appoinmentState?.searchQuery &&
                        appoinmentState?.searchQuery?.trim() !== ""
                    ) {
                        onClearValue();
                    } else {
                        dispatch(enableSearching({ value: false }));
                    }
                }}
                placeholder="Cari PT / Proyek"
                index={searchIndex}
                emptyText={`${appoinmentState?.searchQuery} tidak ditemukan!`}
                routes={routes}
                autoFocus
                onIndexChange={setSearchIndex}
                loadList={isProjectLoading}
                onPressList={(item) => {
                    const handlePicNull = { ...item };
                    if (!handlePicNull?.PIC) {
                        handlePicNull.PIC = [];
                    }

                    if (item?.PIC && item?.PIC?.length > 0) {
                        const finalPIC = [...item.PIC];
                        finalPIC?.forEach((it, index) => {
                            finalPIC[index] = {
                                ...finalPIC[index],
                                isSelected: index === 0
                            };
                        });
                        if (handlePicNull?.PIC) handlePicNull.PIC = finalPIC;
                    }
                    onPressCard(handlePicNull);
                }}
                data={projects}
                isError={errorGettingProject}
                errorMessage={errorGettingProjectMessage}
                onRetry={onRetryGettingProjects}
            />
        </View>
    );
}

export default SearchingCustomer;
