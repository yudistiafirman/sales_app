import debounce from "lodash.debounce";
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
    BCommonSearchList,
    BSearchBar,
    BSpacer,
    BTextLocation
} from "@/components";
import { layout } from "@/constants";
import { PIC } from "@/interfaces";
import { getAllProject } from "@/redux/async-thunks/commonThunks";
import {
    setPics,
    setProjectName,
    setSearchQuery,
    setSelectedCustomerData,
    updateDataVisitation,
    updateShouldScrollView
} from "@/redux/reducers/VisitationReducer";
import { retrying } from "@/redux/reducers/commonReducer";
import { AppDispatch, RootState } from "@/redux/store";
import { resScale } from "@/utils";

const style = StyleSheet.create({
    touchable: {
        position: "absolute",
        width: "100%",
        borderRadius: layout.radius.sm,
        height: resScale(45),
        zIndex: 2
    }
});

interface IProps {
    onSearch: (search: boolean) => void;
    isSearch: boolean;
    searchingDisable?: boolean;
    setSelectedCompany: React.Dispatch<
        React.SetStateAction<{ id: string; title: string }>
    >;
}

function SearchFlow({
    onSearch,
    isSearch,
    searchingDisable,
    setSelectedCompany
}: IProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [index, setIndex] = React.useState(0);
    const {
        projects,
        isProjectLoading,
        errorGettingProject,
        errorGettingProjectMessage
    } = useSelector((state: RootState) => state.common);
    const visitationData = useSelector((state: RootState) => state.visitation);
    const authState = useSelector((state: RootState) => state.auth);
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
        if (!isSearch && text) {
            onSearch(true);
        }
        if (visitationData.shouldScrollView) {
            dispatch(updateShouldScrollView(false));
        }
        dispatch(setSearchQuery(text));
        onChangeWithDebounce(text);
    };

    const onClear = () => {
        dispatch(setSearchQuery(""));
    };

    const onSelectProject = (item: any) => {
        const customerType = item?.Company?.id ? "COMPANY" : "INDIVIDU";
        dispatch(
            updateDataVisitation({
                type: "customerType",
                value: customerType
            })
        );

        if (item?.Customer) {
            dispatch(
                setSelectedCustomerData({
                    customerType: customerType.toLocaleLowerCase(),
                    value: {
                        id: item.Customer.id,
                        title: item.Customer.displayName,
                        paymentType: item.paymentType
                    }
                })
            );
        } else {
            dispatch(
                setSelectedCustomerData({
                    customerType: customerType.toLocaleLowerCase(),
                    value: {
                        id: null,
                        title: "",
                        paymentType: ""
                    }
                })
            );
        }

        if (item?.Pics) {
            const picList = item?.Pics?.map((pic: PIC, i: number) => ({
                ...pic,
                isSelected: i === 0
            }));
            if (picList.length === 1) {
                picList[0].isSelected = true;
            }
            dispatch(
                setPics({
                    customerType: customerType.toLocaleLowerCase(),
                    value: picList
                })
            );
        }
        dispatch(
            setProjectName({
                customerType: customerType.toLocaleLowerCase(),
                value: item?.name
            })
        );
        dispatch(
            updateDataVisitation({
                type: "projectId",
                value: item?.id
            })
        );

        if (item?.Visitations) {
            let order = item?.Visitations[0]?.order;
            if (!item?.Visitations[0]?.finishDate) {
                order -= 1;
            }
            dispatch(
                updateDataVisitation({
                    type: "visitationId",
                    value: item?.Visitations[0]?.id
                })
            );
            dispatch(
                updateDataVisitation({
                    type: "existingOrderNum",
                    value: order
                })
            );
        }
        onClear();
        onSearch(false);
        dispatch(updateShouldScrollView(true));
    };

    const routes: { title: string; totalItems: number }[] = React.useMemo(
        () => [
            {
                key: "first",
                title: "Proyek",
                totalItems: projects.length,
                chipPosition: "right"
            }
        ],
        [projects]
    );

    const onRetryGettingProject = () => {
        dispatch(retrying());
        onChangeWithDebounce(visitationData.searchQuery);
    };

    return (
        <>
            <View>
                <BTextLocation
                    location={
                        visitationData.locationAddress?.formattedAddress ?? ""
                    }
                    numberOfLines={1}
                />
                <BSpacer size="extraSmall" />
            </View>
            {isSearch ? (
                <View style={{ flex: 1 }}>
                    <BCommonSearchList
                        index={index}
                        onIndexChange={setIndex}
                        routes={routes}
                        placeholder="Cari PT / Proyek"
                        searchQuery={visitationData.searchQuery}
                        autoFocus
                        onChangeText={onChangeSearch}
                        onClearValue={() => {
                            if (
                                visitationData.searchQuery &&
                                visitationData.searchQuery.trim() !== ""
                            ) {
                                onClear();
                            } else {
                                onSearch(false);
                                dispatch(updateShouldScrollView(true));
                            }
                        }}
                        data={projects}
                        onPressList={onSelectProject}
                        isError={errorGettingProject}
                        loadList={isProjectLoading}
                        errorMessage={errorGettingProjectMessage}
                        onRetry={onRetryGettingProject}
                        emptyText={`${visitationData.searchQuery} tidak ditemukan!`}
                    />
                </View>
            ) : (
                <View>
                    <TouchableOpacity
                        style={style.touchable}
                        onPress={() => onSearch(true)}
                    />
                    <BSearchBar
                        disabled
                        placeholder="Cari PT / Proyek"
                        activeOutlineColor="gray"
                        left={
                            <TextInput.Icon
                                forceTextInputFocus={false}
                                icon="magnify"
                            />
                        }
                    />
                </View>
            )}
        </>
    );
}

export default SearchFlow;
