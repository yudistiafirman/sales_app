/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { View } from 'react-native';
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
import { createVisitationContext } from '@/context/CreateVisitationContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAllProject } from '@/redux/async-thunks/commonThunks';
import debounce from 'lodash.debounce';
import { PIC } from '@/interfaces';

interface IProps {
  onSearch: (search: boolean) => void;
  isSearch: boolean;
  searchingDisable?: boolean;
}

const SearchFlow = ({ onSearch, isSearch, searchingDisable }: IProps) => {
  const dispatch = useDispatch();
  const { action, values } = React.useContext(createVisitationContext);
  const { updateValueOnstep, updateValue } = action;
  const [searchQuery, setSearchQuery] = React.useState('');
  const { projects, isProjectLoading } = useSelector(
    (state: RootState) => state.common
  );

  // useEffect(() => {
  //   return () => {
  //     console.log('debounce cleanup');
  //     onChangeWithDebounce.cancel();
  //   };
  // }, []);

  const searchDispatch = (text: string) => {
    dispatch(getAllProject({ search: text }));
  };
  const onChangeWithDebounce = React.useMemo(() => {
    return debounce((text: string) => {
      searchDispatch(text);
    }, 500);
  }, []);

  const onChangeSearch = (text: string) => {
    // console.log(isSearch, 'isSearch53');

    if (!isSearch && text) {
      onSearch(true);
    }
    if (values.shouldScrollView) {
      updateValue('shouldScrollView', false);
    }
    setSearchQuery(text);
    onChangeWithDebounce(text);
  };

  const onClear = () => {
    setSearchQuery('');
    onSearch(false);
    updateValue('shouldScrollView', true);
  };

  const onSelectProject = (item: any) => {
    if (item.Company) {
      const company = {
        id: item.Company.id,
        title: item.Company.name,
      };

      updateValueOnstep('stepTwo', 'companyName', company);

      if (values.stepTwo.options.items) {
        updateValueOnstep('stepTwo', 'options', {
          items: [...values.stepTwo.options.items, company],
        });
      } else {
        updateValueOnstep('stepTwo', 'options', {
          items: [company],
        });
      }
    }
    const customerType = item.Company ? 'COMPANY' : 'INDIVIDU';
    updateValueOnstep('stepTwo', 'customerType', customerType);

    if (item.PIC) {
      const picList = item.PIC.map((pic: PIC) => {
        return {
          ...pic,
          isSelected: false,
        };
      });
      updateValueOnstep('stepTwo', 'pics', picList);
    }
    updateValueOnstep('stepTwo', 'projectName', item.name);
    if (item.Visitation) {
      updateValueOnstep('stepTwo', 'visitationId', item.Visitation.id);
      updateValueOnstep('stepTwo', 'existingOrderNum', item.Visitation.order);
    }
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
    if (searchQuery.length <= 3) {
      return null;
    }
    return (
      <BFlatlistItems
        renderItem={(item) => (
          <BVisitationCard
            item={{
              name: item.name,
              location: item.locationAddress.city,
            }}
            searchQuery={searchQuery}
            onPress={() => {
              onSelectProject(item);
            }}
          />
        )}
        searchQuery={searchQuery}
        isLoading={isProjectLoading}
        data={projects}
      />
    );
  }, [searchQuery, projects]);

  return (
    <React.Fragment>
      <BTextLocation
        location={values.stepOne.locationAddress.formattedAddress!}
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
      <BSpacer size="extraSmall" />
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
