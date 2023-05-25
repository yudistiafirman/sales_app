import debounce from "lodash.debounce";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useDispatch } from "react-redux";
import { BDivider, BSpacer, BText, BForm } from "@/components";
import { layout } from "@/constants";
import { AppointmentActionType, StepOne } from "@/context/AppointmentContext";
import { useAppointmentData } from "@/hooks";
import { Input, projectResponseType, Styles } from "@/interfaces";
import { getProjectsByUserThunk } from "@/redux/async-thunks/commonThunks";
import { AppDispatch } from "@/redux/store";
import company from "@/assets/icon/Visitation/company.png";
import profile from "@/assets/icon/Visitation/profile.png";

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
    const [values, dispatchValue] = useAppointmentData();
    const { stepOne: state } = values;
    const dispatch = useDispatch<AppDispatch>();
    const isCompany = state.customerType === "company";
    const fetchDebounce = useMemo(
        () =>
            debounce((searchQuery: string) => {
                dispatch(getProjectsByUserThunk({ search: searchQuery }))
                    .unwrap()
                    .then((response: projectResponseType[]) => {
                        const items = response.map((project) => ({
                            id: project.id,
                            title: project.display_name
                        }));
                        dispatchValue({
                            type: AppointmentActionType.ADD_COMPANIES,
                            value: items
                        });
                    });
            }, 500),
        [dispatch, dispatchValue]
    );

    const onChangeText = (searchQuery: string): void => {
        dispatchValue({
            type: AppointmentActionType.SET_COMPANIES_NAME,
            value: searchQuery
        });
        fetchDebounce(searchQuery);
    };
    const inputs: Input[] = React.useMemo(() => {
        const baseInput: Input[] = [
            {
                label: "Jenis Pelanggan",
                isRequire: true,
                isError: false,
                type: "cardOption",
                value: state.customerType,
                options: [
                    {
                        icon: company,
                        title: "Perusahaan",
                        value: "company",
                        onChange: () => {
                            dispatchValue({
                                type: AppointmentActionType.SET_CUSTOMER_TYPE,
                                value: "company"
                            });
                        }
                    },
                    {
                        icon: profile,
                        title: "Individu",
                        value: "individu",
                        onChange: () => {
                            dispatchValue({
                                type: AppointmentActionType.SET_CUSTOMER_TYPE,
                                value: "individu"
                            });
                        }
                    }
                ]
            }
        ];
        if (state.customerType?.length > 0) {
            const aditionalInput: Input[] = [
                {
                    label: "Nama Perusahaan",
                    isRequire: true,
                    isError: state.errorCompany?.length > 0,
                    customerErrorMsg: state.errorCompany,
                    type: "autocomplete",
                    onChange: onChangeText,
                    onClear: () =>
                        dispatchValue({
                            type: AppointmentActionType.SET_COMPANIES_NAME,
                            value: null
                        }),
                    value: values.stepOne.company.Company,
                    items: state.options.items,
                    placeholder: "Masukan Nama Perusahaan",
                    loading: state.options.loading,
                    onSelect: (item: any) => {
                        dispatchValue({
                            type: AppointmentActionType.SELECT_COMPANY,
                            key: state.customerType as keyof StepOne,
                            value: item
                        });
                    }
                },
                {
                    label: "Nama Proyek",
                    isRequire: true,
                    isError: state.errorProject.length > 0,
                    customerErrorMsg: state.errorProject,
                    type: "textInput",
                    placeholder: "Masukan Nama Proyek",
                    onChange: (e) => {
                        dispatchValue({
                            type: AppointmentActionType.SET_PROJECT_NAME,
                            key: state.customerType as keyof StepOne,
                            value: e.nativeEvent.text
                        });
                    },
                    value: isCompany
                        ? state.company?.name
                        : state.individu?.name
                },
                {
                    label: "PIC",
                    isRequire: true,
                    isError: state.errorPics.length > 0,
                    customerErrorMsg: state.errorPics,
                    type: "PIC",
                    value: isCompany ? state.company.PIC : state.individu.PIC,
                    onChange: () => {
                        dispatchValue({
                            type: AppointmentActionType.TOGGLE_MODAL_PICS
                        });
                    },
                    onSelect: (index: number) => {
                        const picsValue = isCompany
                            ? state.company.PIC
                            : state.individu.PIC;
                        const newPicList = picsValue.map((el, _index) => ({
                            ...el,
                            isSelected: _index === index
                        }));
                        dispatchValue({
                            type: AppointmentActionType.SET_PICS,
                            key: state.customerType as keyof StepOne,
                            value: newPicList
                        });
                    }
                }
            ];
            if (state.customerType === "individu") {
                baseInput.push(...aditionalInput.splice(1));
            } else {
                baseInput.push(...aditionalInput);
            }
        }
        return baseInput;
    }, [values]);
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
