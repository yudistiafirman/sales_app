import crashlytics from '@react-native-firebase/crashlytics';
import debounce from 'lodash.debounce';
import React, { useContext, useMemo, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { BContainer, BCommonSearchList, BSearchBar } from '@/components';
import { layout } from '@/constants';
import { SPH } from '@/navigation/ScreenNames';
import { getAllProject } from '@/redux/async-thunks/commonThunks';
import {
  setStepperFocused,
  setUseBillingAddress,
  updateSelectedCompany,
  updateSelectedPic,
  setUseSearchAddress,
} from '@/redux/reducers/SphReducer';
import { retrying } from '@/redux/reducers/commonReducer';
import { AppDispatch, RootState } from '@/redux/store';
import { resScale } from '@/utils';
import SelectedPic from './elements/SelectedPic';
import { SphContext } from '../context/SphContext';

export default function FirstStep() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [, stateUpdate, setCurrentPosition] = useContext(SphContext);
  const [isSearching, setSearching] = useState(false);
  const { projects, isProjectLoading, errorGettingProject, errorGettingProjectMessage } =
    useSelector((state: RootState) => state.common);
  const { selectedCompany } = useSelector((state: RootState) => state.sph);
  function resetSearch() {
    setSearchQuery('');
  }

  React.useEffect(() => {
    crashlytics().log(`${SPH}-Step1`);
  }, [selectedCompany?.Pics, selectedCompany?.Pic]);

  const routes: { title: string; totalItems: number }[] = useMemo(
    () => [
      {
        key: 'first',
        title: 'Proyek',
        totalItems: projects.length,
        chipPosition: 'right',
      },
    ],
    [projects]
  );

  const searchDispatch = React.useCallback(
    (text: string) => {
      dispatch(getAllProject({ search: text }));
    },
    [dispatch]
  );
  const onChangeWithDebounce = React.useMemo(
    () =>
      debounce((text: string) => {
        searchDispatch(text);
      }, 500),
    [searchDispatch]
  );

  const onRetryGettingProject = () => {
    dispatch(retrying());
    onChangeWithDebounce(searchQuery);
  };

  return (
    <BContainer>
      {!selectedCompany ? (
        <>
          {!isSearching ? (
            <>
              <TouchableOpacity
                style={styles.touchable}
                onPress={() => setSearching(!isSearching)}
              />
              <BSearchBar
                placeholder="Cari PT / Proyek"
                activeOutlineColor="gray"
                disabled
                left={<TextInput.Icon forceTextInputFocus={false} icon="magnify" />}
              />
            </>
          ) : (
            <BCommonSearchList
              index={index}
              onIndexChange={setIndex}
              routes={routes}
              placeholder="Cari PT / Proyek"
              searchQuery={searchQuery}
              onChangeText={(text: string) => {
                setSearchQuery(text);
                onChangeWithDebounce(text);
              }}
              autoFocus
              onClearValue={() => {
                if (searchQuery && searchQuery.trim() !== '') {
                  resetSearch();
                } else {
                  setSearching(!isSearching);
                }
              }}
              data={projects}
              onPressList={item => {
                let finalPIC: any[] = [];
                let finalItem;

                if (item.Pics && item.Pics.length > 0 && !selectedCompany) {
                  finalPIC = [...item.Pics];
                  finalPIC.forEach((it, index) => {
                    finalPIC[index] = {
                      ...finalPIC[index],
                      isSelected: index === 0,
                    };
                  });
                  finalItem = { ...item };
                  if (finalItem.Pics) finalItem.Pics = finalPIC;
                  dispatch(updateSelectedPic(finalPIC[0]));
                  dispatch(updateSelectedCompany(finalItem));
                } else {
                  dispatch(updateSelectedCompany(item));
                }
              }}
              isError={errorGettingProject}
              loadList={isProjectLoading}
              errorMessage={errorGettingProjectMessage}
              emptyText={`${searchQuery} tidak ditemukan!`}
              onRetry={onRetryGettingProject}
            />
          )}
        </>
      ) : (
        <SelectedPic
          onPress={() => {
            dispatch(updateSelectedCompany(null));
            dispatch(updateSelectedPic(null));
            dispatch(setUseSearchAddress({ value: false }));
            dispatch(setUseBillingAddress({ value: false }));
          }}
          setCurrentPosition={num => {
            dispatch(setStepperFocused(1));
            setCurrentPosition(num);
          }}
        />
      )}
    </BContainer>
  );
}

const styles = StyleSheet.create({
  touchable: {
    position: 'absolute',
    width: '100%',
    borderRadius: layout.radius.sm,
    height: resScale(45),
    zIndex: 2,
  },
});
