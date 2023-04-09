import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  BCommonSearchList,
  BSearchBar,
  BSpacer,
  BTextLocation,
} from '@/components';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getAllProject } from '@/redux/async-thunks/commonThunks';
import debounce from 'lodash.debounce';
import { PIC } from '@/interfaces';
import { retrying } from '@/redux/reducers/commonReducer';
import {
  setSearchQuery,
  updateDataVisitation,
  updateShouldScrollView,
} from '@/redux/reducers/VisitationReducer';
import { resScale } from '@/utils';

interface IProps {
  onSearch: (search: boolean) => void;
  isSearch: boolean;
  searchingDisable?: boolean;
  setSelectedCompany: React.Dispatch<
    React.SetStateAction<{ id: string; title: string }>
  >;
}

const SearchFlow = ({
  onSearch,
  isSearch,
  searchingDisable,
  setSelectedCompany,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [index, setIndex] = React.useState(0);
  const {
    projects,
    isProjectLoading,
    errorGettingProject,
    errorGettingProjectMessage,
  } = useSelector((state: RootState) => state.common);
  const visitationData = useSelector((state: RootState) => state.visitation);
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
    if (!isSearch && text) {
      onSearch(true);
    }
    if (visitationData.shouldScrollView) {
      dispatch(updateShouldScrollView(false));
    }
    dispatch(setSearchQuery(text));
    onChangeWithDebounce(text);
  };

  const onClear = () => {
    dispatch(setSearchQuery(''));
  };

  const onSelectProject = (item: any) => {
    if (item?.Company?.id) {
      const company = {
        id: item?.Company?.id,
        title: item?.Company?.name,
      };
      setSelectedCompany(company);
      dispatch(
        updateDataVisitation({
          type: 'companyName',
          value: company.title,
        })
      );

      if (visitationData.options?.items) {
        dispatch(
          updateDataVisitation({
            type: 'options',
            value: {
              ...visitationData.options,
              items: [...visitationData.options?.items, company],
            },
          })
        );
      } else {
        dispatch(
          updateDataVisitation({
            type: 'options',
            value: {
              ...visitationData.options,
              items: [company],
            },
          })
        );
      }
    }
    const customerType = item?.Company?.id ? 'COMPANY' : 'INDIVIDU';
    dispatch(
      updateDataVisitation({
        type: 'customerType',
        value: customerType,
      })
    );

    if (item?.Pics) {
      const picList = item?.Pics?.map((pic: PIC, index: number) => {
        return {
          ...pic,
          isSelected: index === 0 ? true : false,
        };
      });
      if (picList.length === 1) {
        picList[0].isSelected = true;
      }
      dispatch(
        updateDataVisitation({
          type: 'pics',
          value: picList,
        })
      );
    }
    dispatch(
      updateDataVisitation({
        type: 'projectName',
        value: item?.name,
      })
    );
    dispatch(
      updateDataVisitation({
        type: 'projectId',
        value: item?.id,
      })
    );

    if (item?.Visitations) {
      let order = +item?.Visitations[0]?.order;
      if (!item?.Visitations[0]?.finishDate) {
        order -= 1;
      }
      console.log(
        item?.Visitations,
        'item?.Visitations153',
        item?.Visitations[0]?.id
      );

      dispatch(
        updateDataVisitation({
          type: 'visitationId',
          value: item?.Visitations[0]?.id,
        })
      );
      dispatch(
        updateDataVisitation({
          type: 'existingOrderNum',
          value: order,
        })
      );
    }
    onClear();
    onSearch(false);
    dispatch(updateShouldScrollView(true));
  };

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

  const onRetryGettingProject = () => {
    dispatch(retrying());
    onChangeWithDebounce(visitationData.searchQuery);
  };

  return (
    <>
      <View>
        <BTextLocation
          location={visitationData.locationAddress?.formattedAddress!}
          numberOfLines={1}
        />
        <BSpacer size="extraSmall" />
      </View>
      {isSearch ? (
        <View style={{ flex: 1 }}>
          <BCommonSearchList
            index={index}
            onIndexChange={setIndex}
            routes={routes}
            placeholder="Cari Pelanggan"
            searchQuery={visitationData.searchQuery}
            autoFocus={true}
            onChangeText={onChangeSearch}
            onClearValue={() => {
              if (
                visitationData.searchQuery &&
                visitationData.searchQuery.trim() !== ''
              ) {
                onClear();
              } else {
                onSearch(false);
                dispatch(updateShouldScrollView(true));
              }
            }}
            data={projects}
            onPressList={onSelectProject}
            isError={errorGettingProject}
            loadList={isProjectLoading}
            errorMessage={errorGettingProjectMessage}
            onRetry={onRetryGettingProject}
            emptyText={`${visitationData.searchQuery} tidak ditemukan!`}
          />
        </View>
      ) : (
        <View>
          <TouchableOpacity
            style={style.touchable}
            onPress={() => onSearch(true)}
          />
          <BSearchBar
            disabled
            placeholder="Cari pelanggan"
            activeOutlineColor="gray"
            left={<TextInput.Icon forceTextInputFocus={false} icon="magnify" />}
          />
        </View>
      )}
    </>
  );
};

const style = StyleSheet.create({
  touchable: {
    position: 'absolute',
    width: '100%',
    borderRadius: resScale(4),
    height: resScale(45),
    zIndex: 2,
  },
});

export default SearchFlow;
