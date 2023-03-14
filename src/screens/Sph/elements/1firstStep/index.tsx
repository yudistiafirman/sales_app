import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  BSearchBar,
  BContainer,
  BVisitationCard,
  BFlatlistItems,
  BSpacer,
  BCommonSearchList,
} from '@/components';
import { TextInput } from 'react-native-paper';

import BTabViewScreen from '@/components/organism/BTabViewScreen';
import SelectedPic from './elements/SelectedPic';

import { SphContext } from '../context/SphContext';
import { getAllProject } from '@/redux/async-thunks/commonThunks';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { AppDispatch, RootState } from '@/redux/store';
import crashlytics from '@react-native-firebase/crashlytics';
import { SPH } from '@/navigation/ScreenNames';
import { TouchableOpacity } from 'react-native';
import { customLog } from '@/utils/generalFunc';
import { retrying } from '@/redux/reducers/commonReducer';
import {
  updateSelectedCompany,
  updateSelectedPic,
} from '@/redux/reducers/SphReducer';

export default function FirstStep() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const [index,setIndex]=useState(0)
  const [sphState, stateUpdate, setCurrentPosition] = useContext(SphContext);
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

  const routes: {title: string; totalItems: number }[] =
    useMemo(() => {
      return [
        // {
        //   tabTitle: 'Semua',
        //   totalItems: 8,
        // },
        {
          key:'first',
          title: 'Proyek',
          totalItems: projects.length,
          chipPosition:'right'
        },
        // {
        //   tabTitle: 'Proyek',
        //   totalItems: 3,
        // },
        // {
        //   tabTitle: 'PIC',
        //   totalItems: 0,
        // },
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
        onChangeText={(text:string)=> {
          setSearchQuery(text)
          onChangeWithDebounce(text)
        }}
        onClearValue={resetSearch}
        data={projects}
        onPressList={(item)=> dispatch(updateSelectedCompany(item))}
        isError={errorGettingProject}
        loadList={isProjectLoading}
        errorMessage={errorGettingProjectMessage}
        emptyText={`Pencarian mu ${searchQuery} tidak ada. Coba cari proyek lainnya.`}
        onRetry={onRetryGettingProject}
        />
      ) :(
        <SelectedPic
        onPress={() => {
          dispatch(updateSelectedCompany(null));
          dispatch(updateSelectedPic(null));
          // stateUpdate('selectedPic')(null);
          // stateUpdate('selectedCompany')(null);
        }}
        setCurrentPosition={setCurrentPosition}
      />
      ) }
    </BContainer>
  );
}

// const style = StyleSheet.create({
//   sectionTitle: {
//     borderBottomColor: colors.border.tab,
//     borderBottomWidth: 2,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingBottom: layout.pad.md,
//   },
//   title: {
//     fontFamily: fonts.family.montserrat[600],
//     fontWeight: '600',
//     color: colors.black,
//     fontSize: font.size.md,
//   },
// });
