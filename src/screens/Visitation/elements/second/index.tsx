import crashlytics from "@react-native-firebase/crashlytics";
import { useRoute } from "@react-navigation/native";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { BDivider, BForm, BSpacer, BText } from "@/components";
import { layout } from "@/constants";
import { Input, Styles } from "@/interfaces";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import { CREATE_VISITATION } from "@/navigation/ScreenNames";
import {
    setCustomerData,
    setCustomerSearchQuery,
    setPics,
    setProjectName,
    setSearchProject,
    setSelectedCustomerData,
    updateDataVisitation
} from "@/redux/reducers/VisitationReducer";
import { RootState } from "@/redux/store";
import { resScale } from "@/utils";
import company from "@/assets/icon/Visitation/company.png";
import profile from "@/assets/icon/Visitation/profile.png";
import { COMPANY, DEBOUNCE_SEARCH, INDIVIDU } from "@/constants/general";
import { getAllCustomer } from "@/redux/async-thunks/commonThunks";
import { openPopUp } from "@/redux/reducers/modalReducer";
import SearchFlow from "./Searching";

interface IProps {
    openBottomSheet: () => void;
}

const styles: Styles = {
    flexFull: {
        flex: 1
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    labelShimmer: {
        width: resScale(335),
        height: resScale(100),
        borderRadius: layout.radius.md
    }
};

function SecondStep({ openBottomSheet }: IProps) {
    const dispatch = useDispatch();
    const route = useRoute<RootStackScreenProps>();
    const existingVisitation = route?.params?.existingVisitation;
    const visitationData = useSelector((state: RootState) => state.visitation);
    const authState = useSelector((state: RootState) => state.auth);
    const isCompany = visitationData?.customerType === COMPANY;
    const selectedCustomerType =
        visitationData?.customerType === COMPANY ? "company" : "individu";
    const onChange = (key: any) => (e: any) => {
        dispatch(updateDataVisitation({ type: key, value: e }));
    };
    const fetchDebounce = debounce((searchQuery: string) => {
        try {
            const customerType =
                visitationData?.customerType === COMPANY ? COMPANY : INDIVIDU;
            dispatch(
                getAllCustomer({
                    searchQuery,
                    customerType
                })
            );
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        error?.message ||
                        "Terjadi error pengambilan data customer",
                    outsideClickClosePopUp: true
                })
            );
        }
    }, DEBOUNCE_SEARCH);

    useEffect(() => {
        crashlytics().log(`${CREATE_VISITATION}-Step2`);
    }, []);

    useEffect(() => {
        const searchValue = isCompany
            ? visitationData.company.customerData.searchQuery
            : visitationData.individu.customerData.searchQuery;
        if (searchValue.length > 2) {
            fetchDebounce(searchValue);
        } else {
            dispatch(
                setCustomerData({
                    value: [],
                    customerType: selectedCustomerType
                })
            );
        }
        return () => {
            fetchDebounce.cancel();
        };
    }, [
        isCompany
            ? visitationData.company.customerData.searchQuery
            : visitationData.individu.customerData.searchQuery
    ]);

    const onChangeText = (searchQuery: string): void => {
        dispatch(
            setCustomerSearchQuery({
                customerType: selectedCustomerType,
                value: searchQuery
            })
        );
    };

    const inputs: Input[] = React.useMemo(() => {
        const baseInput: Input[] = [
            {
                label: "Jenis Pelanggan",
                isRequire: true,
                isError: false,
                type: "cardOption",
                onChange: onChange("customerType"),
                value: visitationData?.customerType,
                options: [
                    {
                        icon: company,
                        title: "Perusahaan",
                        value: COMPANY,
                        onChange: () => {
                            onChange("customerType")(COMPANY);
                        }
                    },
                    {
                        icon: profile,
                        title: "Individu",
                        value: INDIVIDU,
                        onChange: () => {
                            onChange("customerType")(INDIVIDU);
                        }
                    }
                ],
                isInputDisable: !!existingVisitation
            },
            {
                label: "Nama Pelanggan",
                isRequire: true,
                isError: false,
                type: "autocomplete",
                onChange: onChangeText,

                isError:
                    visitationData[selectedCustomerType]?.customerData
                        ?.searchQuery?.length > 1 &&
                    visitationData[selectedCustomerType]?.customerData
                        ?.searchQuery?.length < 3,
                customerErrorMsg:
                    "Mohon untuk tidak menggunakan nama singkatan",
                value: isCompany
                    ? visitationData.company.customerData.searchQuery
                    : visitationData.individu.customerData.searchQuery,
                itemSet: isCompany
                    ? visitationData.company.customerData.items
                    : visitationData.individu.customerData.items,
                loading: isCompany
                    ? visitationData.company.customerData.loading === "pending"
                    : visitationData.individu.customerData.loading ===
                      "pending",
                onSelect: (item: { id: string; title: string }): void => {
                    dispatch(
                        setSelectedCustomerData({
                            customerType: selectedCustomerType,
                            value: item
                        })
                    );
                },
                placeholder: "Masukkan Nama Pelanggan",
                isInputDisable: !!existingVisitation,
                onPressSelected: () => {
                    dispatch(
                        setSelectedCustomerData({
                            customerType: selectedCustomerType,
                            value: { id: null, title: "", paymentType: "" }
                        })
                    );
                },
                onClear: () => {
                    dispatch(
                        setCustomerSearchQuery({
                            customerType: selectedCustomerType,
                            value: ""
                        })
                    );
                },
                showClearAutoCompleted: false,
                selectedItems: isCompany
                    ? visitationData.company.selectedCustomer
                    : visitationData.individu.selectedCustomer
            },
            {
                label: "Nama Proyek",
                isRequire: true,
                isError: false,
                type: "textInput",
                onChange: (e: any) => {
                    dispatch(
                        setProjectName({
                            customerType: selectedCustomerType,
                            value: e.nativeEvent.text
                        })
                    );
                },
                value: isCompany
                    ? visitationData.company.projectName
                    : visitationData.individu.projectName,
                placeholder: "Masukkan Nama Proyek",
                isInputDisable: !!existingVisitation
            },
            {
                label: "PIC",
                isRequire: true,
                isError: false,
                type: "PIC",
                value: isCompany
                    ? visitationData.company.pics
                    : visitationData.individu.pics,
                onChange: () => {
                    openBottomSheet();
                },
                onSelect: (index: number) => {
                    const picsValue = isCompany
                        ? visitationData.company.pics
                        : visitationData.individu.pics;
                    const newPicList = picsValue?.map((el, _index) => ({
                        ...el,
                        isSelected: _index === index
                    }));
                    dispatch(
                        setPics({
                            customerType: selectedCustomerType,
                            value: newPicList
                        })
                    );
                }
            }
        ];

        return baseInput;
    }, [visitationData]);

    const onSearch = (searching: boolean) => {
        dispatch(setSearchProject(searching));
    };

    return (
        <SafeAreaView style={styles.flexFull}>
            <SearchFlow
                searchingDisable={!!existingVisitation}
                isSearch={visitationData?.isSearchProject}
                onSearch={onSearch}
            />
            {!visitationData.isSearchProject && (
                <KeyboardAvoidingView style={{ flex: 1 }} enabled>
                    <ScrollView
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps="handled"
                        contentInsetAdjustmentBehavior="automatic"
                        contentContainerStyle={{ paddingBottom: 0 }}
                        style={{ flex: 1 }}
                    >
                        <BSpacer size={6} />
                        <View style={styles.dividerContainer}>
                            <BDivider />
                            <BSpacer size="verySmall" />
                            <BText bold="500" color="divider">
                                Atau Buat Baru Dibawah
                            </BText>
                            <BSpacer size="verySmall" />
                            <BDivider />
                        </View>
                        <BSpacer size={8} />
                        <View>
                            <BForm titleBold="500" inputs={inputs} />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
}

export default SecondStep;
