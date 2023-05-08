/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { SafeAreaView, View, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BEmptyState, BHeaderIcon, BSpacer } from '@/components';
import { layout } from '@/constants';
import { useMachine } from '@xstate/react';
import useCustomHeaderCenter from '@/hooks/useCustomHeaderCenter';
// import crashlytics from '@react-native-firebase/crashlytics';
import { CAMERA, FORM_SO, SEARCH_SO } from '@/navigation/ScreenNames';
import SearchSONavbar from './element/SearchSONavbar';
import SOList from './element/SOList';
import searchSOMachine from '@/machine/searchSOMachine';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const SearchSO = () => {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const navigation = useNavigation();
  const [state, send] = useMachine(searchSOMachine);
  const soData = useSelector((state: RootState) => state.salesOrder);

  const renderHeaderLeft = React.useCallback(
    () => (
      <BHeaderIcon
        size={layout.pad.xl}
        iconName="chevron-left"
        marginRight={layout.pad.xs}
        marginLeft={layout.pad.sm}
        onBack={() => {
          navigation.goBack();
        }}
      />
    ),
    [navigation]
  );

  React.useEffect(() => {
    // crashlytics().log(SEARCH_SO);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      send('assignKeyword', { payload: searchValue });
    }, [send])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => renderHeaderLeft(),
    });
  }, [navigation, renderHeaderLeft]);

  const onChangeText = (text: string) => {
    setSearchValue(text);

    if (text.length > 2) send('onRefreshList', { payload: text });
    else if (text.length < 1) send('onRefreshList', { payload: '' });
  };

  const onClearValue = () => {
    setSearchValue('');
    send('assignKeyword', { payload: '' });
  };

  const onPressItem = (item: any) => {
    const number = item?.brikNumber;
    const id = item?.id;
    if (soData.photoFiles && soData.selectedID === id) {
      navigation.navigate(FORM_SO);
    } else {
      navigation.navigate(CAMERA, {
        photoTitle: '/ File SO yang telah di TTD',
        navigateTo: FORM_SO,
        closeButton: true,
        disabledDocPicker: false,
        disabledGalleryPicker: false,
        soID: id,
        soNumber: number,
      });
    }
  };

  useCustomHeaderCenter(
    {
      customHeaderCenter: (
        <View
          style={[
            {
              width: '98%',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            },
            Platform.OS !== 'android' && { height: '80%' },
          ]}
        >
          <SearchSONavbar
            customStyle={[
              {
                width: '75%',
                justifyContent: 'center',
              },
              Platform.OS !== 'android' && { height: '80%' },
            ]}
            autoFocus={true}
            value={searchValue}
            onChangeText={onChangeText}
            onClearValue={onClearValue}
          />
        </View>
      ),
    },
    [searchValue]
  );

  const {
    soListData,
    isLoading,
    isLoadMore,
    errorMessage,
    isRefreshing,
    keyword,
  } = state.context;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BSpacer size="small" />
      {keyword !== '' && searchValue.length < 3 ? (
        <BEmptyState emptyText={'Minimal 3 huruf!'} />
      ) : (
        <View style={{ flexGrow: 1, flexDirection: 'row' }}>
          <SOList
            data={soListData}
            loadList={isLoading}
            isLoadMore={isLoadMore}
            refreshing={isRefreshing}
            onEndReached={() => send('onEndReached', { payload: searchValue })}
            onPressList={(item) => onPressItem(item)}
            onRefresh={() => send('onRefreshList', { payload: searchValue })}
            onRetry={() => send('retryGettingList', { payload: searchValue })}
            keyword={keyword}
            errorMessage={errorMessage}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchSO;
