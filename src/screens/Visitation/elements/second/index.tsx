/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { View } from 'react-native';
import { BDivider, BForm, BSpacer, BText } from '@/components';
import { CreateVisitationSecondStep, Input, Styles } from '@/interfaces';
import { createVisitationContext } from '@/context/CreateVisitationContext';
import SearchFlow from './Searching';
import { ScrollView } from 'react-native-gesture-handler';

import { resScale } from '@/utils';
import { layout } from '@/constants';
import { useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigation/navTypes';

interface IProps {
  openBottomSheet: () => void;
}

const company = require('@/assets/icon/Visitation/company.png');
const individu = require('@/assets/icon/Visitation/profile.png');

const SecondStep = ({ openBottomSheet }: IProps) => {
  const route = useRoute<RootStackScreenProps>();
  const existingVisitation = route?.params?.existingVisitation;
  const { values, action } = React.useContext(createVisitationContext);
  const { stepTwo: state } = values;
  const { updateValueOnstep } = action;

  const onChange = (key: keyof CreateVisitationSecondStep) => (e: any) => {
    updateValueOnstep('stepTwo', key, e);
  };

  const onFetching = (e: any) => {
    updateValueOnstep('stepTwo', 'companyName', { id: 1, title: e });

    // fetching then merge with the thing user type
    updateValueOnstep('stepTwo', 'options', {
      items: [{ id: 1, title: e }],
    });
    return;
  };

  const inputs: Input[] = React.useMemo(() => {
    // console.log('rerender input');
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
            value: 'COMPANY',
            onChange: () => {
              onChange('customerType')('COMPANY');
            },
          },
          {
            icon: individu,
            title: 'Individu',
            value: 'INDIVIDU',
            onChange: () => {
              onChange('customerType')('INDIVIDU');
            },
          },
        ],
        isInputDisable: !!existingVisitation,
      },
    ];
    if (state.customerType.length > 0) {
      const companyNameInput: Input = {
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
        isInputDisable: !!existingVisitation,
      };

      const aditionalInput: Input[] = [
        {
          label: 'Nama Proyek',
          isRequire: true,
          isError: false,
          type: 'textInput',
          onChange: (e: any) => {
            // console.log(e, 'event');
            onChange('projectName')(e.nativeEvent.text);
          },
          value: state.projectName,
          isInputDisable: !!existingVisitation,
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
      if (state.customerType === 'COMPANY') {
        aditionalInput.unshift(companyNameInput);
      }
      baseInput.push(...aditionalInput);
    }
    return baseInput;
  }, [values]);

  const [isSearch, setSearch] = React.useState<boolean>(false);

  const onSearch = (searching: boolean) => {
    setSearch(searching);
  };

  return (
    <>
      <SearchFlow
        searchingDisable={existingVisitation}
        isSearch={isSearch}
        onSearch={onSearch}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {!isSearch && (
          // <ScrollView>
          <React.Fragment>
            <BSpacer size="small" />
            <View style={styles.dividerContainer}>
              <BDivider />
              <BSpacer size="extraSmall" />
              <BText color="divider">Atau Buat Baru Dibawah</BText>
              <BSpacer size="extraSmall" />
              <BDivider />
            </View>
            <BSpacer size="small" />
            <View>
              <BForm inputs={inputs} />
              <BSpacer size="large" />
            </View>
          </React.Fragment>
          // </ScrollView>
        )}
      </ScrollView>
    </>
  );
};

const styles: Styles = {
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelShimmer: {
    width: resScale(335),
    height: resScale(100),
    borderRadius: layout.radius.md,
  },
};

export default SecondStep;
