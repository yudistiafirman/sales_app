/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
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
  updateShouldScrollView,
  updateStepTwo,
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
    if (visitationData?.shouldScrollView) {
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
    let stepTwo;
    if (item.Company?.id) {
      const company = {
        id: item.Company.id,
        title: item.Company.name,
      };
      stepTwo = {
        ...visitationData,
        companyName: company.title,
      };
      setSelectedCompany(company);

      if (visitationData?.stepTwo?.options?.items) {
        stepTwo = {
          ...visitationData,
          options: {
            ...visitationData?.stepTwo?.options,
            items: [...visitationData?.stepTwo?.options?.items, company],
          },
        };
      } else {
        stepTwo = {
          ...visitationData,
          options: {
            ...visitationData?.stepTwo?.options,
            items: [company],
          },
        };
      }
    }
    const customerType = item.Company?.id ? 'COMPANY' : 'INDIVIDU';
    stepTwo = {
      ...visitationData,
      customerType: customerType,
    };

    if (item.PIC) {
      const picList = item.PIC.map((pic: PIC) => {
        return {
          ...pic,
          isSelected: false,
        };
      });
      if (picList.length === 1) {
        picList[0].isSelected = true;
      }
      stepTwo = {
        ...visitationData,
        pics: picList,
      };
    }
    stepTwo = {
      ...visitationData,
      projectName: item.name,
      projectId: item.id,
    };
    if (item.Visitation) {
      let order = +item.Visitation.order;
      if (!item.Visitation.finish_date) {
        order -= 1;
      }
      stepTwo = {
        ...visitationData,
        visitationId: item.Visitation.id,
        existingOrderNum: order,
      };
    }
    dispatch(updateStepTwo(stepTwo));
    onClear();
    // updateValueOnstep('stepTwo', 'pics', item?.pic);
  };

  const tabToRender: { tabTitle: string; totalItems: number }[] =
    React.useMemo(() => {
      return [
        {
          tabTitle: 'Proyek',
          totalItems: projects.length,
        },
      ];
    }, [projects]);

  const sceneToRender = React.useCallback(() => {
    if (searchQuery.length <= 2) {
      return null;
    }

    const onRetryGettingProject = () => {
      dispatch(retrying());
      onChangeWithDebounce(searchQuery);
    };
    return (
      <BFlatlistItems
        isError={errorGettingProject}
        errorMessage={errorGettingProjectMessage}
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
                onSelectProject(item);
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
        isLoading={isProjectLoading}
        data={projects}
        onAction={onRetryGettingProject}
      />
    );
  }, [searchQuery, projects, isProjectLoading]);

  return (
    <React.Fragment>
      <BTextLocation
        location={visitationData?.stepOne?.locationAddress?.formattedAddress!}
        numberOfLines={1}
      />
      <BSpacer size="extraSmall" />
      <BSearchBar
        placeholder="Cari pelanggan"
        activeOutlineColor="gray"
        left={
          <TextInput.Icon
            // onPress={onSearch}
            forceTextInputFocus={false}
            icon="magnify"
          />
        }
        right={
          isSearch && (
            <TextInput.Icon
              forceTextInputFocus={false}
              onPress={onClear}
              icon="close"
            />
          )
        }
        value={searchQuery}
        onChangeText={onChangeSearch}
        disabled={searchingDisable}
      />
      <BSpacer size={resultSpace ? resultSpace : 'extraSmall'} />
      {searchQuery && (
        <View style={{ height: resScale(500) }}>
          <BTabViewScreen
            isLoading={false}
            screenToRender={sceneToRender}
            tabToRender={searchQuery ? tabToRender : []}
          />
        </View>
      )}
    </React.Fragment>
  );
};

export default SearchFlow;
