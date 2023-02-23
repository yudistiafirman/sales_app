import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  BSearchBar,
  BContainer,
  BVisitationCard,
  BFlatlistItems,
  BSpacer,
} from '@/components';
import { TextInput } from 'react-native-paper';

import BTabViewScreen from '@/components/organism/BTabViewScreen';
import SelectedPic from './elements/SelectedPic';

import { SphContext } from '../context/SphContext';
import { getAllProject } from '@/redux/async-thunks/commonThunks';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { AppDispatch, RootState } from '@/redux/store';
import { openPopUp } from '@/redux/reducers/modalReducer';
import crashlytics from '@react-native-firebase/crashlytics';
import { SPH } from '@/navigation/ScreenNames';
import { TouchableOpacity } from 'react-native';
import { customLog } from '@/utils/generalFunc';
import { retrying } from '@/redux/reducers/commonReducer';

export default function FirstStep() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const [sphState, stateUpdate, setCurrentPosition] = useContext(SphContext);
  const {
    projects,
    isProjectLoading,
    errorGettingProject,
    errorGettingProjectMessage,
  } = useSelector((state: RootState) => state.common);
  function resetSearch() {
    setSearchQuery('');
  }

  React.useEffect(() => {
    crashlytics().log(SPH + '-Step1');
  }, []);

  const tabToRender: { tabTitle: string; totalItems: number }[] =
    useMemo(() => {
      return [
        // {
        //   tabTitle: 'Semua',
        //   totalItems: 8,
        // },
        {
          tabTitle: 'Proyek',
          totalItems: projects.length,
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

  const sceneToRender = useCallback(
    (key: string) => {
      if (searchQuery.length <= 3) {
        return null;
      }
      return (
        <BFlatlistItems
          isError={errorGettingProject}
          errorMessage={errorGettingProjectMessage}
          onAction={onRetryGettingProject}
          renderItem={(item) => {
            let picOrCompanyName = '-';
            if (item?.Company?.name) {
              picOrCompanyName = item.Company?.name;
            } else if (item?.mainPic?.name) {
              picOrCompanyName = item?.mainPic?.name;
            }
            return (
              <TouchableOpacity
                onPress={() => {
                  // setSelectedPic(data);
                  if (stateUpdate) {
                    stateUpdate('selectedCompany')(item);
                  }
                }}
              >
                <BVisitationCard
                  item={{
                    name: item.name,
                    location: item.locationAddress.line1,
                    picOrCompanyName: picOrCompanyName,
                  }}
                  searchQuery={searchQuery}
                  isRenderIcon={false}
                />
              </TouchableOpacity>
            );
          }}
          searchQuery={searchQuery}
          data={projects}
          isLoading={isProjectLoading}
          // initialFetch={() => {
          //   return tabOnEndReached({
          //     key,
          //     currentPage: 1,
          //     query: searchQuery,
          //   });
          // }}
          // onEndReached={(info) => {
          //   return tabOnEndReached({
          //     ...info,
          //     key,
          //     query: searchQuery,
          //   });
          // }}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery, projects, isProjectLoading]
  );

  return (
    <BContainer>
      {!sphState?.selectedCompany && (
        <>
          <BSearchBar
            activeOutlineColor="gray"
            value={searchQuery}
            onChangeText={(text: string) => {
              setSearchQuery(text);
              onChangeWithDebounce(text);
            }}
            placeholder="Search"
            left={<TextInput.Icon forceTextInputFocus={false} icon="magnify" />}
            right={
              <TextInput.Icon
                onPress={resetSearch}
                forceTextInputFocus={true}
                icon="close"
              />
            }
          />
          <BSpacer size={'extraSmall'} />
        </>
      )}
      {!sphState?.selectedCompany && (
        <BTabViewScreen
          screenToRender={sceneToRender}
          tabToRender={searchQuery.length > 3 ? tabToRender : []}
        />
      )}
      {sphState?.selectedCompany && (
        <SelectedPic
          onPress={() => {
            if (stateUpdate) {
              stateUpdate('selectedPic')(null);
              stateUpdate('selectedCompany')(null);
            }
          }}
          setCurrentPosition={setCurrentPosition}
        />
      )}
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
