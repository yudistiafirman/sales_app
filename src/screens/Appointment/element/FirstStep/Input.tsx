import debounce from "lodash.debounce";
import React, { useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { BDivider, BSpacer, BText, BForm } from "@/components";
import { layout } from "@/constants";
import { Input, Styles } from "@/interfaces";
import { AppDispatch, RootState } from "@/redux/store";
import company from "@/assets/icon/Visitation/company.png";
import profile from "@/assets/icon/Visitation/profile.png";
import {
    setCustomerData,
    setSelectedCustomerData,
    setCustomerSearchQuery,
    setCustomerType,
    setPics,
    setProjectName,
    toggleModalPics
} from "@/redux/reducers/appointmentReducer";
import { COMPANY, DEBOUNCE_SEARCH, INDIVIDU } from "@/constants/general";
import { getAllCustomer } from "@/redux/async-thunks/commonThunks";
import { openPopUp } from "@/redux/reducers/modalReducer";

const styles: Styles = {
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    sheetStyle: {
        paddingLeft: layout.pad.md + layout.pad.ml,
        paddingRight: layout.pad.md + layout.pad.ml,
        backgroundColor: "red"
    },
    inputContainerStyle: {
        flex: 1
    }
};

function Inputs() {
    const appointmentState = useSelector(
        (state: RootState) => state.appoinment
    );
    const authState = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const isCompany = appointmentState?.stepOne?.customerType === "company";
    const selectedCustomerType =
        appointmentState?.stepOne?.customerType === "company"
            ? "company"
            : "individu";

    const fetchDebounce = debounce((searchQuery: string) => {
        try {
            const customerType =
                selectedCustomerType === "company" ? COMPANY : INDIVIDU;
            dispatch(getAllCustomer({ searchQuery, customerType }));
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        error?.message ||
                        "Terjadi error pengambilan data saat customer",
                    outsideClickClosePopUp: true
                })
            );
        }
    }, DEBOUNCE_SEARCH);

    useEffect(() => {
        const searchValue = isCompany
            ? appointmentState?.stepOne?.company?.customerData?.searchQuery
            : appointmentState?.stepOne?.individu?.customerData?.searchQuery;

        if (searchValue?.length > 2) {
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
            ? appointmentState?.stepOne?.company?.customerData?.searchQuery
            : appointmentState?.stepOne?.individu?.customerData?.searchQuery
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
                value: appointmentState?.stepOne?.customerType,
                options: [
                    {
                        icon: company,
                        title: "Perusahaan",
                        value: "company",
                        onChange: () => {
                            dispatch(setCustomerType({ value: "company" }));
                        }
                    },
                    {
                        icon: profile,
                        title: "Individu",
                        value: "individu",
                        onChange: () => {
                            dispatch(setCustomerType({ value: "individu" }));
                        }
                    }
                ]
            }
        ];

        if (appointmentState?.stepOne?.customerType?.length > 0) {
            const additionalInput: Input[] = [
                {
                    label: "Nama Pelanggan",
                    isRequire: true,
                    isError:
                        appointmentState?.stepOne[selectedCustomerType]
                            ?.customerData?.searchQuery.length > 1 &&
                        appointmentState?.stepOne[selectedCustomerType]
                            ?.customerData?.searchQuery.length < 3,
                    customerErrorMsg:
                        "Mohon untuk tidak menggunakan nama singkatan",
                    type: "autocomplete",
                    onChange: onChangeText,
                    onClear: () => {
                        dispatch(
                            setCustomerSearchQuery({
                                customerType: selectedCustomerType,
                                value: ""
                            })
                        );
                    },

                    value: isCompany
                        ? appointmentState?.stepOne?.company?.customerData
                              ?.searchQuery
                        : appointmentState?.stepOne?.individu?.customerData
                              ?.searchQuery,
                    itemSet: isCompany
                        ? appointmentState?.stepOne?.company?.customerData
                              ?.items
                        : appointmentState?.stepOne?.individu?.customerData
                              ?.items,
                    placeholder: "Masukan Nama Pelanggan",
                    loading: isCompany
                        ? appointmentState?.stepOne?.company?.customerData
                              ?.loading === "pending"
                        : appointmentState?.stepOne?.individu?.customerData
                              ?.loading === "pending",
                    onSelect: (item: any) => {
                        dispatch(
                            setSelectedCustomerData({
                                customerType: selectedCustomerType,
                                value: item
                            })
                        );
                    },
                    selectedItems: isCompany
                        ? appointmentState?.stepOne?.company?.selectedCustomer
                        : appointmentState?.stepOne?.individu?.selectedCustomer,
                    onPressSelected: () => {
                        dispatch(
                            setSelectedCustomerData({
                                customerType: selectedCustomerType,
                                value: { id: null, title: "", paymentType: "" }
                            })
                        );
                    }
                },
                {
                    label: "Nama Proyek",
                    isRequire: true,
                    isError:
                        appointmentState?.stepOne?.errorProject?.length > 0,
                    customerErrorMsg: appointmentState?.stepOne?.errorProject,
                    type: "textInput",
                    placeholder: "Masukan Nama Proyek",
                    onChange: (e) => {
                        dispatch(
                            setProjectName({
                                key: appointmentState?.stepOne?.customerType,
                                value: e?.nativeEvent?.text
                            })
                        );
                    },
                    value: isCompany
                        ? appointmentState?.stepOne?.company?.name
                        : appointmentState?.stepOne?.individu?.name
                },
                {
                    label: "PIC",
                    isRequire: true,
                    isError: appointmentState?.stepOne?.errorPics?.length > 0,
                    customerErrorMsg: appointmentState?.stepOne?.errorPics,
                    type: "PIC",
                    value: isCompany
                        ? appointmentState?.stepOne?.company?.Pics
                        : appointmentState?.stepOne?.individu?.Pics,
                    onChange: () => {
                        dispatch(toggleModalPics({ value: true }));
                    },
                    onSelect: (index: number) => {
                        const picsValue = isCompany
                            ? appointmentState?.stepOne?.company?.Pics
                            : appointmentState?.stepOne?.individu?.Pics;
                        const newPicList = picsValue?.map((el, _index) => ({
                            ...el,
                            isSelected: _index === index
                        }));

                        dispatch(
                            setPics({
                                key: appointmentState?.stepOne?.customerType,
                                value: newPicList
                            })
                        );
                    }
                }
            ];
            baseInput.push(...additionalInput);
        }
        return baseInput;
    }, [appointmentState]);
    return (
        <>
            <View style={styles.dividerContainer}>
                <BDivider />
                <BSpacer size="extraSmall" />
                <BText color="divider">Atau</BText>
                <BSpacer size="extraSmall" />
                <BDivider />
            </View>
            <BSpacer size="extraSmall" />
            <ScrollView
                style={styles.inputContainerStyle}
                showsVerticalScrollIndicator={false}
            >
                <BForm titleBold="500" inputs={inputs} />
                <BSpacer size="extraSmall" />
            </ScrollView>
        </>
    );
}

export default Inputs;
