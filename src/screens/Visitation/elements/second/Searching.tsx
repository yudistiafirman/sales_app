/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  BCommonSearchList,
  BFlatlistItems,
  BSearchBar,
  BSpacer,
  BTabViewScreen,
  BTextLocation,
  BVisitationCard,
} from '@/components';
import { TextInput } from 'react-native-paper';
import { resScale } from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getAllProject } from '@/redux/async-thunks/commonThunks';
import debounce from 'lodash.debounce';
import { PIC } from '@/interfaces';
import { retrying } from '@/redux/reducers/commonReducer';
import {
  updateDataVisitation,
  updateShouldScrollView,
} from '@/redux/reducers/VisitationReducer';

interface IProps {
  onSearch: (search: boolean) => void;
  isSearch: boolean;
  searchingDisable?: boolean;
  resultSpace?:
    | 'verySmall'
    | 'extraSmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'extraLarge'
    | number;
  setSelectedCompany: React.Dispatch<
    React.SetStateAction<{ id: string; title: string }>
  >;
}

const SearchFlow = ({
  onSearch,
  isSearch,
  searchingDisable,
  resultSpace,
  setSelectedCompany,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = React.useState('');
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
    setSearchQuery(text);
    onChangeWithDebounce(text);
  };

  const onClear = () => {
    setSearchQuery('');
    onSearch(false);
    dispatch(updateShouldScrollView(true));
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

    if (item?.PIC) {
      const picList = item?.PIC?.map((pic: PIC) => {
        return {
          ...pic,
          isSelected: false,
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
    if (item?.Visitation) {
      let order = +item?.Visitation?.order;
      if (!item?.Visitation?.finish_date) {
        order -= 1;
      }
      dispatch(
        updateDataVisitation({
          type: 'visitationId',
          value: item?.Visitation?.id,
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
    // updateValueOnstep('stepTwo', 'pics', item?.pic);
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
    onChangeWithDebounce(searchQuery);
  };

  return (
    <React.Fragment>
      <BTextLocation
        location={visitationData.locationAddress?.formattedAddress!}
        numberOfLines={1}
      />
      <BSpacer size="extraSmall" />
      <BSpacer size={resultSpace ? resultSpace : 'extraSmall'} />
      {isSearch ? (
        <View style={{ height: resScale(500) }}>
          <BCommonSearchList
            index={index}
            onIndexChange={setIndex}
            routes={routes}
            placeholder="Cari Pelanggan"
            searchQuery={searchQuery}
            onChangeText={onChangeSearch}
            onClearValue={onClear}
            data={projects}
            onPressList={onSelectProject}
            isError={errorGettingProject}
            loadList={isProjectLoading}
            errorMessage={errorGettingProjectMessage}
            onRetry={onRetryGettingProject}
            emptyText={`Pencarian mu ${searchQuery} tidak ada. Coba cari proyek lainnya.`}
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => onSearch(true)}
          disabled={searchingDisable}
        >
          <BSearchBar
            disabled
            placeholder="Cari pelanggan"
            activeOutlineColor="gray"
            left={
              <TextInput.Icon
                // onPress={onSearch}
                forceTextInputFocus={false}
                icon="magnify"
              />
            }
          />
        </TouchableOpacity>
      )}
    </React.Fragment>
  );
};

export default SearchFlow;
