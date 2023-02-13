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
import { RootState } from '@/redux/store';
import { openPopUp } from '@/redux/reducers/modalReducer';

export default function FirstStep() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [sphState, stateUpdate, setCurrentPosition] = useContext(SphContext);
  const { projects, isProjectLoading } = useSelector(
    (state: RootState) => state.common
  );
  function resetSearch() {
    setSearchQuery('');
  }

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

  const sceneToRender = useCallback(
    (key: string) => {
      if (searchQuery.length <= 3) {
        return null;
      }
      return (
        <BFlatlistItems
          renderItem={(item) => (
            <BVisitationCard
              item={{
                name: item.name,
                location: item.locationAddress.line1,
              }}
              searchQuery={searchQuery}
              onPress={(data) => {
                console.log(data, 'visit di pencet', item);
                // setSelectedPic(data);
                if (stateUpdate) {
                  stateUpdate('selectedCompany')(item);
                }
              }}
            />
          )}
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
    [searchQuery, projects]
  );

  const searchDispatch = (text: string) => {
    dispatch(getAllProject({ search: text }))
      .unwrap()
      .then()
      .catch((err) => {
        console.log(err, 'errgetAllProject');
        dispatch(
          openPopUp({
            popUpType: 'error',
            popUpText: 'Error get all project',
            outsideClickClosePopUp: true,
          })
        );
      });
  };
  const onChangeWithDebounce = React.useMemo(() => {
    return debounce((text: string) => {
      searchDispatch(text);
    }, 500);
  }, []);

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
