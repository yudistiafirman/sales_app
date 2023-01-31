import { BDivider, BSpacer, BText, BForm } from '@/components';
import { AppointmentActionType, StepOne } from '@/context/AppointmentContext';
import { useAppointmentData } from '@/hooks';
import { Input, Styles } from '@/interfaces';
import React from 'react';
import { View } from 'react-native';
const company = require('@/assets/icon/Visitation/company.png');
const individu = require('@/assets/icon/Visitation/profile.png');

const Inputs = () => {
  const [values, dispatchValue] = useAppointmentData();
  const { stepOne: state } = values;
  const isCompany = state.customerType === 'company';
  const onFetching = (e: any) => {
    console.log('hai');
  };
  const inputs: Input[] = React.useMemo(() => {
    const baseInput: Input[] = [
      {
        label: 'Jenis Pelanggan',
        isRequire: true,
        isError: false,
        type: 'cardOption',
        value: state.customerType,
        options: [
          {
            icon: company,
            title: 'Perusahaan',
            value: 'company',
            onChange: () => {
              dispatchValue({
                type: AppointmentActionType.SET_CUSTOMER_TYPE,
                value: 'company',
              });
            },
          },
          {
            icon: individu,
            title: 'Individu',
            value: 'individu',
            onChange: () => {
              dispatchValue({
                type: AppointmentActionType.SET_CUSTOMER_TYPE,
                value: 'individu',
              });
            },
          },
        ],
      },
    ];
    if (state.customerType?.length > 0) {
      const aditionalInput: Input[] = [
        {
          label: 'Nama Perusahaan',
          isRequire: true,
          isError: state.errorCompany?.length > 0,
          errorMessage: state.errorCompany,
          type: 'autocomplete',
          onChange: onFetching,
          value: state.company.companyName,
          items: state.options.items,
          placeholder: 'Masukan Nama Perusahaan',
          loading: state.options.loading,
          onSelect: (item: any) => {
            dispatchValue({
              type: AppointmentActionType.SELECT_COMPANY,
              value: item,
            });
          },
        },
        {
          label: 'Nama Proyek',
          isRequire: true,
          isError: state.errorProject.length > 0,
          errorMessage: state.errorProject,
          type: 'textInput',
          placeholder: 'Masukan Nama Proyek',
          onChange: (e) => {
            dispatchValue({
              type: AppointmentActionType.SET_PROJECT_NAME,
              key: state.customerType as keyof StepOne,
              value: e,
            });
          },
          value: isCompany
            ? state.company.projectName
            : state.individu.projectName,
        },
        {
          label: 'PIC',
          isRequire: true,
          isError: state.errorPics.length > 0,
          errorMessage: state.errorPics,
          type: 'PIC',
          value: isCompany ? state.company.pics : state.individu.pics,
          onChange: () => {
            dispatchValue({ type: AppointmentActionType.TOGGLE_MODAL_PICS });
          },
          onSelect: (index: number) => {
            const picsValue = isCompany
              ? state.company.pics
              : state.individu.pics;
            const newPicList = picsValue.map((el, _index) => {
              return {
                ...el,
                isSelected: _index === index,
              };
            });
            dispatchValue({
              type: AppointmentActionType.SET_PICS,
              key: state.customerType as keyof StepOne,
              value: newPicList,
            });
          },
        },
      ];
      if (state.customerType === 'company') {
        baseInput.push(...aditionalInput);
      } else {
        baseInput.push(...aditionalInput.splice(1));
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
      <BSpacer size="small" />
      <View>
        <BForm inputs={inputs} />
        <BSpacer size="large" />
      </View>
    </>
  );
};

const styles: Styles = {
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetStyle: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'red',
  },
};

export default Inputs;
