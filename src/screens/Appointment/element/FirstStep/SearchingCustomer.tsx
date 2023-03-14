import { BCommonSearchList, BFlatlistItems, BTabViewScreen, BVisitationCard } from '@/components';
import { colors, layout } from '@/constants';
import { AppointmentActionType } from '@/context/AppointmentContext';
import { useAppointmentData } from '@/hooks';
import React, { useCallback, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
const { width } = Dimensions.get('window');
import { selectedCompanyInterface } from '@/interfaces/index';
import { resScale } from '@/utils';
import debounce from 'lodash.debounce';
import { getAllProject } from '@/redux/async-thunks/commonThunks';
import { resetStates, retrying } from '@/redux/reducers/commonReducer';

const SearchingCustomer = () => {
  const [values, dispatchValue] = useAppointmentData();
  const [index,setIndex]=useState(0)
  const { searchQuery } = values;
  const {
    projects,
    isProjectLoading,
    errorGettingProject,
    errorGettingProjectMessage,
  } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch<AppDispatch>();
  const searchDispatch = useCallback(
    (text: string) => {
      dispatch(getAllProject({ search: text }));
    },
    [dispatch]
  );
  const onChangeWithDebounce = React.useMemo(() => {
    return debounce((text: string) => {
      searchDispatch(text);
    }, 500);
  }, [searchDispatch]);

  const onChangeSearch = (text: string) => {
    dispatchValue({ type: AppointmentActionType.SEARCH_QUERY, value: text });
    onChangeWithDebounce(text);
  };

  const onPressCard = useCallback(
    (item: selectedCompanyInterface) => {
      const customerType = item.Company.id ? 'company' : 'individu';
      if (values.stepOne.options.items) {
        dispatchValue({
          type: AppointmentActionType.ADD_COMPANIES,
          value: [
            ...values.stepOne.options.items,
            { id: item.Company.id, title: item.Company.name },
          ],
        });
      } else {
        dispatchValue({
          type: AppointmentActionType.ADD_COMPANIES,
          value: [{ id: item.Company.id, title: item.Company.name }],
        });
      }

      const picList = item.PIC;
      if (picList.length === 1) {
        picList[0].isSelected = true;
      }

      const companyDataToSave = {
        Company: { id: item.Company.id, title: item.Company.name },
        PIC: picList,
        Visitation: item.Visitation,
        locationAddress: item.locationAddress,
        mainPic: item.mainPic,
        id: item.id,
        name: item.name,
      };

      dispatchValue({
        type: AppointmentActionType.ON_ADD_PROJECT,
        key: customerType,
        value: companyDataToSave,
      });
    },
    [dispatchValue, values.stepOne.options.items]
  );

  const routes: { title: string; totalItems: number }[] =
    React.useMemo(() => {
      return [
        {
          key:'first',
          title: 'Proyek',
          totalItems: projects.length,
          chipPosition:'right'
        },
      ];
    }, [projects]);

  const onRetryGettingProjects = () => {
    dispatch(retrying());
    onChangeWithDebounce(searchQuery);
  };

  const onClearValue = () => {
  dispatchValue({
      type: AppointmentActionType.SEARCH_QUERY,
      value: '',
    })
  dispatchValue({
    type:AppointmentActionType.ENABLE_SEARCHING,
    value:false
  })
  }

  return (
    <View style={{ height: width + resScale(160) }}>
        <BCommonSearchList
            searchQuery={searchQuery}
            onChangeText={onChangeSearch}
            onClearValue={onClearValue}
            placeholder="Cari Pelanggan"
            index={index}
            emptyText={`Pencarian mu ${searchQuery} tidak ada. Coba cari proyek lainnya.`}
            routes={routes}
            onIndexChange={setIndex}
            loadList={isProjectLoading}
            onPressList={(item) => {
              let handlePicNull = { ...item };
              if (!handlePicNull.PIC) {
                handlePicNull.PIC = [];
              }
              onPressCard(handlePicNull);
            }}
            data={projects}
            isError={errorGettingProject}
            errorMessage={errorGettingProjectMessage}
            onRetry={onRetryGettingProjects}
          />
    </View>
  );
};

export default SearchingCustomer;
