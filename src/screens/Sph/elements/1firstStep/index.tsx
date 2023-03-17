import React, { useContext, useMemo, useState } from 'react';
import { BContainer, BCommonSearchList } from '@/components';

import SelectedPic from './elements/SelectedPic';

import { SphContext } from '../context/SphContext';
import { getAllProject } from '@/redux/async-thunks/commonThunks';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { AppDispatch, RootState } from '@/redux/store';
import crashlytics from '@react-native-firebase/crashlytics';
import { SPH } from '@/navigation/ScreenNames';
import { retrying } from '@/redux/reducers/commonReducer';
import {
  setStepperFocused,
  updateSelectedCompany,
  updateSelectedPic,
} from '@/redux/reducers/SphReducer';

export default function FirstStep() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [, stateUpdate, setCurrentPosition] = useContext(SphContext);
  const {
    projects,
    isProjectLoading,
    errorGettingProject,
    errorGettingProjectMessage,
  } = useSelector((state: RootState) => state.common);
  const { selectedCompany } = useSelector((state: RootState) => state.sph);
  function resetSearch() {
    setSearchQuery('');
  }

  React.useEffect(() => {
    crashlytics().log(SPH + '-Step1');
  }, []);

  const routes: { title: string; totalItems: number }[] = useMemo(() => {
    return [
      {
        key: 'first',
        title: 'Proyek',
        totalItems: projects.length,
        chipPosition: 'right',
      },
    ];
  }, [projects]);

  const searchDispatch = React.useCallback(
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

  const onRetryGettingProject = () => {
    dispatch(retrying());
    onChangeWithDebounce(searchQuery);
  };

  return (
    <BContainer>
      {!selectedCompany ? (
        <BCommonSearchList
          index={index}
          onIndexChange={setIndex}
          routes={routes}
          placeholder="Cari Pelanggan"
          searchQuery={searchQuery}
          onChangeText={(text: string) => {
            setSearchQuery(text);
            onChangeWithDebounce(text);
          }}
          onClearValue={resetSearch}
          data={projects}
          onPressList={(item) => dispatch(updateSelectedCompany(item))}
          isError={errorGettingProject}
          loadList={isProjectLoading}
          errorMessage={errorGettingProjectMessage}
          emptyText={`Pencarian mu ${searchQuery} tidak ada. Coba cari proyek lainnya.`}
          onRetry={onRetryGettingProject}
        />
      ) : (
        <SelectedPic
          onPress={() => {
            dispatch(updateSelectedCompany(null));
            dispatch(updateSelectedPic(null));
          }}
          setCurrentPosition={(num) => {
            dispatch(setStepperFocused(1));
            setCurrentPosition(num);
          }}
        />
      )}
    </BContainer>
  );
}
