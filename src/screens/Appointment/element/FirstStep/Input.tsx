import debounce from "lodash.debounce";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { BDivider, BSpacer, BText, BForm } from "@/components";
import { layout } from "@/constants";
import { Input, Styles } from "@/interfaces";
import { AppDispatch, RootState } from "@/redux/store";
import company from "@/assets/icon/Visitation/company.png";
import profile from "@/assets/icon/Visitation/profile.png";
import { projectByUserGetAction } from "@/actions/CommonActions";
import {
    addCompanies,
    selectCompany,
    setCompanyName,
    setCustomerType,
    setPics,
    setProjectName,
    toggleModalPics
} from "@/redux/reducers/appointmentReducer";

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
    const fetchDebounce = useMemo(
        () =>
            debounce((searchQuery: string) => {
                projectByUserGetAction(
                    searchQuery,
                    authState?.selectedBatchingPlant?.id
                ).then((response) => {
                    const items = response?.data?.data?.map((project: any) => ({
                        id: project?.id,
                        title: project?.display_name
                    }));
                    dispatch(addCompanies({ value: items }));
                });
            }, 500),
        [dispatch]
    );

    const onChangeText = (searchQuery: string): void => {
        dispatch(setCompanyName({ value: searchQuery }));
        fetchDebounce(searchQuery);
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
            const aditionalInput: Input[] = [
                {
                    label: "Nama Perusahaan",
                    isRequire: true,
                    isError:
                        appointmentState?.stepOne?.errorCompany?.length > 0,
                    customerErrorMsg: appointmentState?.stepOne?.errorCompany,
                    type: "autocomplete",
                    onChange: onChangeText,
                    onClear: () => {
                        dispatch(setCompanyName({ value: null }));
                    },

                    value: appointmentState?.stepOne?.company?.Company,
                    items: appointmentState?.stepOne?.options?.items,
                    placeholder: "Masukan Nama Perusahaan",
                    loading: appointmentState?.stepOne?.options?.loading,
                    onSelect: (item: any) => {
                        dispatch(
                            selectCompany({
                                key: appointmentState?.stepOne?.customerType,
                                value: item
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
            if (appointmentState?.stepOne?.customerType === "individu") {
                baseInput?.push(...aditionalInput.splice(1));
            } else {
                baseInput?.push(...aditionalInput);
            }
        }
        return baseInput;
    }, [appointmentState?.stepOne]);
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
