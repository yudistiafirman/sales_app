import * as React from 'react';
import { DeviceEventEmitter, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import resScale from '@/utils/resScale';
import { BHeaderIcon, BSpacer, BTabSections, POList } from '@/components';
import { colors, layout } from '@/constants';
import { useMachine } from '@xstate/react';
import SearchPONavbar from './element/SearchPONavbar';
import { searchPOMachine } from '@/machine/searchPOMachine';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import SelectedPOModal from './element/SelectedPOModal';

const SearchPO = () => {
  const [index, setIndex] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const navigation = useNavigation();
  const [state, send] = useMachine(searchPOMachine);
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  const [selectedData, setSelectedData] = React.useState(undefined);

  useCustomHeaderLeft({
    customHeaderLeft: (
      <BHeaderIcon
        size={resScale(23)}
        onBack={() => navigation.goBack()}
        iconName="x"
      />
    ),
  });

  const onChangeText = (text: string) => {
    setSearchValue(text);

    if (text.length === 0) {
      send('clearInput');
    } else {
      send('searchingPO', { value: text });
    }
  };

  const onClearValue = () => {
    setSearchValue('');
    send('clearInput');
  };

  const onTabPress = ({ route }) => {
    if (routes[index].key && route.key !== routes[index].key) {
      send('onChangeTab', { value: index });
    }
  };

  const onSubmitData = (productData: any) => {
    DeviceEventEmitter.emit('SearchPO.data', {
      parent: selectedData,
      data: productData,
    });
    navigation.goBack();
  };

  const openSelectedModel = (data: any) => {
    setSelectedData(data);
    setIsModalVisible(true);
  };

  const { routes, poData, loadPO } = state.context;
  return (
    <SafeAreaView style={styles.safeArea}>
      {selectedData && (
        <SelectedPOModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          data={selectedData}
          onPressCompleted={(data) => onSubmitData(data)}
        />
      )}

      <SearchPONavbar
        customStyle={styles.search}
        value={searchValue}
        onChangeText={onChangeText}
        onClearValue={onClearValue}
      />
      {routes.length > 0 && (
        <>
          <BSpacer size={'extraSmall'} />
          <BTabSections
            swipeEnabled={false}
            tabStyle={styles.tabStyle}
            indicatorStyle={styles.tabIndicator}
            navigationState={{ index, routes }}
            onTabPress={onTabPress}
            renderScene={() => (
              <POList
                poDatas={poData}
                loadPO={loadPO}
                emptyPOName={searchValue}
                onPress={(data) => {
                  openSelectedModel(data);
                }}
              />
            )}
            onIndexChange={setIndex}
            tabBarStyle={styles.tabBarStyle}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  search: { paddingHorizontal: layout.pad.lg },
  tabIndicator: {
    height: 2,
    backgroundColor: colors.primary,
    marginLeft: resScale(15.5),
  },
  tabStyle: {
    width: 'auto',
    paddingHorizontal: layout.pad.lg,
  },
  tabBarStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: layout.pad.lg,
  },
});

export default SearchPO;
