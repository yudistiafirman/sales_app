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

interface IProps {
  onSearch: (search: boolean) => void;
  isSearch: boolean;
}

const SearchFlow = ({ onSearch, isSearch }: IProps) => {
  const { action, values } = React.useContext(createVisitationContext);
  const { updateValueOnstep, updateValue } = action;
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = (text: string) => {
    updateValue('shouldScrollView', false);
    setSearchQuery(text);
    onSearch(true);
  };

  const onClear = () => {
    setSearchQuery('');
    onSearch(false);
    updateValue('shouldScrollView', true);
  };

  const onSelectProject = (item: any) => {
    updateValueOnstep('stepTwo', 'companyName', item.name);
    updateValueOnstep('stepTwo', 'customerType', item.customerType);
    updateValueOnstep('stepTwo', 'pics', item.pic);
    updateValueOnstep('stepTwo', 'projectName', item.projectName);
    onClear();
    // updateValueOnstep('stepTwo', 'pics', item?.pic);
  };

  const tabData: { [key: string]: any } = React.useMemo(() => {
    return {
      // ['Semua']: Array(8)
      //   .fill(0)
      //   .map((_, index) => {
      //     return {
      //       name: 'PT. Guna Karya Mandiri' + index,
      //       pilNames: [
      //         'Guna Karya Mandiri',
      //         'Proyek Bu Larguna',
      //         'Proyek Bu Larguna',
      //         'Proyek Bu Larguna',
      //       ],
      //     };
      //   }),
      ['Perusahaan']: Array(8)
        .fill(0)
        .map((_, index) => {
          return {
            name: 'PT. Guna Karya Mandiri' + index,
            pilNames: [
              'Guna Karya Mandiri',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
            ],
            customerType: 'company',
            pic: [
              {
                name: 'Joko',
                phone: '890832131',
                email: 'eamil@meail.com',
                position: 'mandor',
              },
            ],
            projectName: 'Proyek coba coba',
          };
        }),
      ['Proyek']: Array(3)
        .fill(0)
        .map((_, index) => {
          return {
            name: 'PT. Guna Karya Mandiri' + index,
            pilNames: [
              'Guna Karya Mandiri',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
              'Proyek Bu Larguna',
            ],
          };
        }),
      ['PIC']: [],
    };
  }, []);

  const tabToRender: { tabTitle: string; totalItems: number }[] =
    React.useMemo(() => {
      return [
        // {
        //   tabTitle: 'Semua',
        //   totalItems: 8,
        // },
        {
          tabTitle: 'Perusahaan',
          totalItems: 3,
        },
        {
          tabTitle: 'Proyek',
          totalItems: 3,
        },
        {
          tabTitle: 'PIC',
          totalItems: 0,
        },
      ];
    }, []);

  const tabOnEndReached = React.useCallback(
    async (info: {
      distanceFromEnd?: number;
      key: string;
      currentPage: number;
      query?: string;
    }) => {
      const result = await new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve(tabData[info.key]);
        }, 3000);
      });
      return result;
    },
    [tabData]
  );

  const sceneToRender = React.useCallback(
    (key: string) => {
      if (searchQuery.length <= 3) {
        return null;
      }
      return (
        <BFlatlistItems
          renderItem={(item) => (
            <BVisitationCard
              item={item}
              searchQuery={searchQuery}
              onPress={() => {
                onSelectProject(item);
              }}
            />
          )}
          searchQuery={searchQuery}
          initialFetch={() => {
            const data = tabOnEndReached({
              key,
              currentPage: 1,
              query: searchQuery,
            });
            console.log(data, 'ini data');
            return data;
          }}
          onEndReached={(info) => {
            return tabOnEndReached({
              ...info,
              key,
              query: searchQuery,
            });
          }}
        />
      );
    },

    [searchQuery]
  );

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
