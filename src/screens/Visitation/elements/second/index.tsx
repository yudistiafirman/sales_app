import crashlytics from '@react-native-firebase/crashlytics';
import { useRoute } from '@react-navigation/native';
import debounce from 'lodash.debounce';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { BDivider, BForm, BSpacer, BText } from '@/components';
import { layout } from '@/constants';
import { Input, projectResponseType, Styles } from '@/interfaces';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { CREATE_VISITATION } from '@/navigation/ScreenNames';
import { getProjectsByUserThunk } from '@/redux/async-thunks/commonThunks';
import { setSearchProject, updateDataVisitation } from '@/redux/reducers/VisitationReducer';
import { RootState } from '@/redux/store';
import { resScale } from '@/utils';
import SearchFlow from './Searching';

const company = require('@/assets/icon/Visitation/company.png');
const profile = require('@/assets/icon/Visitation/profile.png');

interface IProps {
  openBottomSheet: () => void;
}

function SecondStep({ openBottomSheet }: IProps) {
  const dispatch = useDispatch();
  const route = useRoute<RootStackScreenProps>();
  const existingVisitation = route?.params?.existingVisitation;
  const visitationData = useSelector((state: RootState) => state.visitation);
  const [selectedCompany, setSelectedCompany] = useState<
    | {
        id: number;
        title: string;
      }
    | {}
  >({ id: 1, title: visitationData.companyName });

  const onChange = (key: any) => (e: any) => {
    dispatch(updateDataVisitation({ type: key, value: e }));
  };

  useEffect(() => {
    crashlytics().log(`${CREATE_VISITATION}-Step2`);

    if (visitationData.companyName) {
      dispatch(
        updateDataVisitation({
          type: 'options',
          value: {
            items: [{ id: 1, title: visitationData.companyName }],
          },
        })
      );
      setSelectedCompany({
        id: 1,
        title: visitationData.companyName,
      });
    }
  }, [visitationData.companyName]);

  const fetchDebounce = useMemo(
    () =>
      debounce((searchQuery: string) => {
        dispatch(getProjectsByUserThunk({ search: searchQuery }))
          .unwrap()
          .then((response: projectResponseType[]) => {
            const items = response.map(project => ({
              id: project.id,
              title: project.display_name,
            }));
            dispatch(
              updateDataVisitation({
                type: 'options',
                value: {
                  items,
                },
              })
            );

            if (items.length <= 0) {
              dispatch(
                updateDataVisitation({
                  type: 'companyName',
                  value: searchQuery,
                })
              );
              setSelectedCompany({
                id: 1,
                title: searchQuery,
              });
            }
          })
          .catch(() => {
            dispatch(
              updateDataVisitation({
                type: 'companyName',
                value: searchQuery,
              })
            );
            setSelectedCompany({
              id: 1,
              title: searchQuery,
            });
          });
      }, 500),
    [selectedCompany]
  );

  const onChangeText = (searchQuery: string): void => {
    fetchDebounce(searchQuery);
    // fetchDebounce(searchQuery)
    // setSelectedCompany({ id: 1, title: searchQuery });

    // fetching then merge with the thing user type
    // updateValueOnstep('stepTwo', 'options', {
    //   items: [{ id: 1, title: searchQuery }],
    // });
  };

  const inputs: Input[] = React.useMemo(() => {
    const baseInput: Input[] = [
      {
        label: 'Jenis Pelanggan',
        isRequire: true,
        isError: false,
        type: 'cardOption',
        onChange: onChange('customerType'),
        value: visitationData.customerType,
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
    if (visitationData.customerType && visitationData.customerType?.length > 0) {
      const companyNameInput: Input = {
        label: 'Nama Perusahaan',
        isRequire: true,
        isError: false,
        type: 'autocomplete',
        onChange: onChangeText,
        value: selectedCompany,
        items: visitationData.options?.items,
        loading: visitationData.options?.loading,
        onSelect: (item: { id: string; title: string }): void => {
          if (item) {
            dispatch(
              updateDataVisitation({
                type: 'companyName',
                value: item.title,
              })
            );
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
            onChange('projectName')(e.nativeEvent.text);
          },
          value: visitationData.projectName,
          placeholder: 'Masukkan Nama Proyek',
          isInputDisable: !!existingVisitation,
        },
        {
          label: 'PIC',
          isRequire: true,
          isError: false,
          type: 'PIC',
          value: visitationData.pics,
          onChange: () => {
            openBottomSheet();
          },
          onSelect: (index: number) => {
            const newPicList = visitationData.pics.map((el, _index) => ({
              ...el,
              isSelected: _index === index,
            }));
            dispatch(
              updateDataVisitation({
                type: 'pics',
                value: newPicList,
              })
            );
          },
        },
      ];
      if (visitationData.customerType === 'COMPANY') {
        aditionalInput.unshift(companyNameInput);
      }
      baseInput.push(...aditionalInput);
    }
    return baseInput;
  }, [visitationData, selectedCompany]);

  const onSearch = (searching: boolean) => {
    dispatch(setSearchProject(searching));
  };

  return (
    <SafeAreaView style={styles.flexFull}>
      <SearchFlow
        searchingDisable={!!existingVisitation}
        isSearch={visitationData.isSearchProject}
        onSearch={onSearch}
        setSelectedCompany={setSelectedCompany}
      />
      {!visitationData.isSearchProject && (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
      )}
    </SafeAreaView>
  );
}

const styles: Styles = {
  flexFull: {
    flex: 1,
  },
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
