/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { BDivider, BForm, BSpacer, BText, SVGName } from '@/components';
import {
  CreateVisitationSecondStep,
  Input,
  projectResponseType,
  Styles,
} from '@/interfaces';
import { createVisitationContext } from '@/context/CreateVisitationContext';
import SearchFlow from './Searching';
import { ScrollView } from 'react-native-gesture-handler';
import debounce from 'lodash.debounce';

import { resScale } from '@/utils';
import { layout } from '@/constants';
import { useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { useDispatch } from 'react-redux';
import { getProjectsByUserThunk } from '@/redux/async-thunks/commonThunks';
const company = require('@/assets/icon/Visitation/company.png')
const profile = require('@/assets/icon/Visitation/profile.png')

interface IProps {
  openBottomSheet: () => void;
}

const SecondStep = ({ openBottomSheet }: IProps) => {
  const dispatch = useDispatch();
  const [selectedCompany, setSelectedCompany] = useState<
    | {
        id: number;
        title: string;
      }
    | {}
  >({});
  const route = useRoute<RootStackScreenProps>();
  const existingVisitation = route?.params?.existingVisitation;
  const { values, action } = React.useContext(createVisitationContext);
  const { stepTwo: state } = values;
  const { updateValueOnstep } = action;

  const onChange = (key: keyof CreateVisitationSecondStep) => (e: any) => {
    updateValueOnstep('stepTwo', key, e);
  };

  useEffect(() => {
    if (values.stepTwo.companyName) {
      setSelectedCompany({ id: 1, title: values.stepTwo.companyName });
      updateValueOnstep('stepTwo', 'options', {
        items: [{ id: 1, title: values.stepTwo.companyName }],
      });
    }
  }, []);

  const fetchDebounce = useMemo(() => {
    return debounce((searchQuery: string) => {
      console.log('jalan di second line60', searchQuery);

      dispatch(getProjectsByUserThunk({ search: searchQuery }))
        .unwrap()
        .then((response: projectResponseType[]) => {
          const items = response.map((project) => {
            return {
              id: project.id,
              title: project.display_name,
            };
          });
          updateValueOnstep('stepTwo', 'options', {
            items: items,
          });
        });
    }, 500);
  }, []);

  const onChangeText = (searchQuery: string): void => {
    updateValueOnstep('stepTwo', 'companyName', searchQuery);
    fetchDebounce(searchQuery);
    //fetchDebounce(searchQuery)
    // setSelectedCompany({ id: 1, title: searchQuery });

    // fetching then merge with the thing user type
    // updateValueOnstep('stepTwo', 'options', {
    //   items: [{ id: 1, title: searchQuery }],
    // });
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
            icon: profile,
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
        onChange: onChangeText,
        value: selectedCompany,
        items: state.options.items,
        loading: state.options.loading,
        onSelect: (item: { id: string; title: string }): void => {
          if (item) {
            updateValueOnstep('stepTwo', 'companyName', item.title);
            setSelectedCompany(item);
          }
        },
        placeholder: 'Masukkan Nama Perusahaan',
        isInputDisable: !!existingVisitation,
        // showChevronAutoCompleted: false,
        showClearAutoCompleted: false,
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
          placeholder: 'Masukkan Nama Proyek',
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
        searchingDisable={!!existingVisitation}
        isSearch={isSearch}
        onSearch={onSearch}
        resultSpace={2}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {!isSearch && (
          <>
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
          </>
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
