import { BCommonSearchList } from '@/components';
import { AppointmentActionType } from '@/context/AppointmentContext';
import { useAppointmentData } from '@/hooks';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectedCompanyInterface } from '@/interfaces/index';
import debounce from 'lodash.debounce';
import { getAllProject } from '@/redux/async-thunks/commonThunks';
import { retrying } from '@/redux/reducers/commonReducer';
import { AppDispatch, RootState } from '@/redux/store';

const SearchingCustomer = () => {
  const [values, dispatchValue] = useAppointmentData();
  const [index, setIndex] = useState(0);
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
      try {
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

        const picList = item.Pics;
        if (picList.length === 1) {
          picList[0].isSelected = true;
        }

        const companyDataToSave = {
          Company: { id: item.Company.id, title: item.Company.name },
          PIC: picList,
          Visitation: item.Visitations[0],
          locationAddress: item.LocationAddress,
          mainPic: item.Pic,
          id: item.id,
          name: item.name,
        };

        dispatchValue({
          type: AppointmentActionType.ON_ADD_PROJECT,
          key: customerType,
          value: companyDataToSave,
        });
      } catch (error) {
        console.log(error, 'errorappointment onPressCard');
      }
    },
    [dispatchValue, values.stepOne.options.items]
  );

  const routes: { title: string; totalItems: number }[] = React.useMemo(() => {
    return [
      {
        key: 'first',
        title: 'Proyek',
        totalItems: projects.length,
        chipPosition: 'right',
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
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <BCommonSearchList
        searchQuery={searchQuery}
        onChangeText={onChangeSearch}
        onClearValue={() => {
          if (searchQuery && searchQuery.trim() !== '') {
            onClearValue();
          } else {
            dispatchValue({
              type: AppointmentActionType.ENABLE_SEARCHING,
              value: false,
            });
          }
        }}
        placeholder="Cari Pelanggan"
        index={index}
        emptyText={`${searchQuery} tidak ditemukan!`}
        routes={routes}
        autoFocus={true}
        onIndexChange={setIndex}
        loadList={isProjectLoading}
        onPressList={(item) => {
          let handlePicNull = { ...item };
          if (!handlePicNull.PIC) {
            handlePicNull.PIC = [];
          }

          if (item.PIC && item.PIC.length > 0) {
            let finalPIC = [...item.PIC];
            finalPIC.forEach((it, index) => {
              finalPIC[index] = {
                ...finalPIC[index],
                isSelected: index === 0 ? true : false,
              };
            });
            if (handlePicNull.PIC) handlePicNull.PIC = finalPIC;
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
