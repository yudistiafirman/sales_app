import * as React from 'react';
import {
  BSearchBar,
  BContainer,
  BVisitationCard,
  BFlatlistItems,
  BSpacer,
} from '@/components';
import { TextInput } from 'react-native-paper';
import BTabViewScreen from '@/components/organism/BTabViewScreen';
import { CreateScheduleContext } from '../context/CreateScheduleContext';
import SelectedPIC from './element/SelectedPIC';

export default function FirstStep() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [createScheduleState, stateUpdate, setCurrentPosition] =
    React.useContext(CreateScheduleContext);

  function resetSearch() {
    setSearchQuery('');
  }

  const tabData: { [key: string]: any } = React.useMemo(() => {
    const mapCallback = (_: any, index: number) => {
      return {
        name: 'PT. Guna Karya Mandiri' + index,
        pilNames: [
          'Guna Karya Mandiri',
          'Proyek Bu Larguna',
          'Proyek Bu Larguna',
          'Proyek Bu Larguna',
        ],
        location: 'Jakarta',
        locationDetail: {
          label: 'Jakarta',
          latitude: 78.3952,
          longitude: -29.6235,
        },
      };
    };
    return {
      ['Semua']: Array(9).fill(0).map(mapCallback),
      ['PO']: Array(4).fill(0).map(mapCallback),
      ['Perusahaan']: Array(2).fill(0).map(mapCallback),
      ['PIC']: Array(3).fill(0).map(mapCallback),
    };
  }, []);

  const tabToRender: { tabTitle: string; totalItems: number }[] =
    React.useMemo(() => {
      return [
        {
          tabTitle: 'Semua',
          totalItems: 9,
        },
        {
          tabTitle: 'PO',
          totalItems: 4,
        },
        {
          tabTitle: 'Perusahaan',
          totalItems: 2,
        },
        {
          tabTitle: 'PIC',
          totalItems: 3,
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
              onPress={(data) => {
                console.log('visit di pencet', data);
                // setSelectedPic(data);
                if (stateUpdate) {
                  stateUpdate('selectedCompany')(data);
                }
              }}
            />
          )}
          searchQuery={searchQuery}
          initialFetch={() => {
            return tabOnEndReached({
              key,
              currentPage: 1,
              query: searchQuery,
            });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery]
  );

  return (
    <BContainer>
      {!createScheduleState?.selectedCompany && (
        <>
          <BSearchBar
            activeOutlineColor="gray"
            value={searchQuery}
            onChangeText={(text: string) => {
              setSearchQuery(text);
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
      {!createScheduleState?.selectedCompany && (
        <BTabViewScreen
          screenToRender={sceneToRender}
          tabToRender={searchQuery.length > 3 ? tabToRender : []}
        />
      )}
      {createScheduleState?.selectedCompany && (
        <SelectedPIC
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
