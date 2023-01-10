/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { View } from 'react-native';
import { BDivider, BForm, BSearchBar, BSpacer, BText } from '@/components';
import { CreateVisitationSecondStep, Input, Styles } from '@/interfaces';
import { createVisitationContext } from '@/context/CreateVisitationContext';
interface IProps {
  openBottomSheet: () => void;
}

const company = require('@/assets/icon/Visitation/company.png');
const individu = require('@/assets/icon/Visitation/profile.png');

const SecondStep = ({ openBottomSheet }: IProps) => {
  const { values, action } = React.useContext(createVisitationContext);
  const { stepTwo: state } = values;
  const { updateValueOnstep } = action;

  const onChange = (key: keyof CreateVisitationSecondStep) => (e: any) => {
    updateValueOnstep('stepTwo', key, e);
  };

  // const [options, setOptions] = React.useState<{
  //   loading: boolean;
  //   items: any[] | null;
  // }>({
  //   loading: false,
  //   items: null,
  // });

  const onFetching = (e: any) => {
    console.log('masuk sini ga sih??', e);
    // setOptions({
    //   loading: true,
    //   items: null,
    // });
    updateValueOnstep('stepTwo', 'options', {
      loading: true,
      items: null,
    });
    setTimeout(() => {
      updateValueOnstep('stepTwo', 'options', {
        loading: false,
        items: [
          {
            id: '1',
            title: 'PT Satu',
          },
          {
            id: '2',
            title: 'PT Dua',
          },
          {
            id: '3',
            title: 'PT Tiga',
          },
          {
            id: '4',
            title: 'PT Empat',
          },
        ],
      });
    }, 1000);
    return;
  };

  const inputs: Input[] = React.useMemo(() => {
    console.log('rerender input');
    const baseInput: Input[] = [
      {
        label: 'Jenis Pelanggan',
        isRequire: true,
        isError: false,
        type: 'cardOption',
        onChange: onChange('customerType'),
        value: state.customerType,
        options: [
          {
            icon: company,
            title: 'Perusahaan',
            value: 'customer',
            onChange: () => {
              onChange('customerType')('customer');
            },
          },
          {
            icon: individu,
            title: 'Individu',
            value: 'individu',
            onChange: () => {
              onChange('customerType')('individu');
            },
          },
        ],
      },
    ];
    if (state.customerType.length > 0) {
      const aditionalInput: Input[] = [
        {
          label: 'Nama Perusahaan',
          isRequire: true,
          isError: false,
          type: 'autocomplete',
          onChange: onFetching,
          value: state.companyName,
          items: state.options.items,
          loading: state.options.loading,
          onSelect: (item: any) => {
            updateValueOnstep('stepTwo', 'companyName', item);
          },
        },
        {
          label: 'Nama Proyek',
          isRequire: true,
          isError: false,
          type: 'textInput',
          onChange: onChange('projectName'),
          value: state.projectName,
        },
        {
          label: 'PIC',
          isRequire: true,
          isError: false,
          type: 'PIC',
          value: state.pics,
          onChange: () => {
            openBottomSheet();
          },
          onSelect: (index: number) => {
            const newPicList = values.stepTwo.pics.map((el, _index) => {
              return {
                ...el,
                isSelected: _index === index,
              };
            });
            updateValueOnstep('stepTwo', 'pics', newPicList);
          },
        },
      ];
      baseInput.push(...aditionalInput);
    }
    return baseInput;
  }, [values]);

  return (
    <React.Fragment>
      <BSearchBar
        fontSize={0}
        color={''}
        fontFamily={''}
        backgroundColor={''}
        lineHeight={0}
      />
      <BSpacer size="medium" />
      <View style={styles.dividerContainer}>
        <BDivider />
        <BSpacer size="extraSmall" />
        <BText color="divider">Atau Buat Baru Dibawah</BText>
        <BSpacer size="extraSmall" />
        <BDivider />
      </View>
      <BSpacer size="medium" />
      <View>
        <BForm inputs={inputs} />
        <BSpacer size="large" />
      </View>
    </React.Fragment>
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

export default SecondStep;
