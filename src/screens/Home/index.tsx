/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  NativeModules,
} from 'react-native';
import colors from '@/constants/colors';
import TargetCard from './elements/TargetCard';
import resScale from '@/utils/resScale';
import DateDaily from './elements/DateDaily';
import BQuickAction from '@/components/organism/BQuickActionMenu';
import BottomSheet from '@gorhom/bottom-sheet';
import BVisitationCard from '@/components/molecules/BVisitationCard';
import moment from 'moment';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import BuatKunjungan from './elements/BuatKunjungan';
import {
  BBottomSheet,
  BSearchBar,
  BFlatlistItems,
  BSpacer,
  BText,
} from '@/components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import BTabViewScreen from '@/components/organism/BTabViewScreen';
import { fonts, layout } from '@/constants';
import BottomSheetFlatlist from './elements/BottomSheetFlatlist';
import {
  getAllVisitations,
  getVisitationTarget,
} from '@/actions/ProductivityActions';
import debounce from 'lodash.debounce';
import { Api } from '@/models';
import { visitationDataType } from '@/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { closePopUp, openPopUp } from '@/redux/reducers/modalReducer';
import { getOneVisitation } from '@/redux/async-thunks/productivityFlowThunks';
import useHeaderStyleChanged from '@/hooks/useHeaderStyleChanged';
import {
  APPOINTMENT,
  CAMERA,
  CREATE_SCHEDULE,
  CREATE_VISITATION,
  CUSTOMER_DETAIL,
  SPH,
  TAB_HOME,
} from '@/navigation/ScreenNames';
import SvgNames from '@/components/atoms/BSvg/svgName';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  customLog,
  getMinVersionUpdate,
  isDevelopment,
  isForceUpdate,
} from '@/utils/generalFunc';
import { RootState } from '@/redux/store';
import { HOME_MENU } from '../Const';

const { RNCustomConfig } = NativeModules;
const versionName = RNCustomConfig?.version_name;
const { height } = Dimensions.get('window');
const initialSnapPoints = (+height.toFixed() - 115) / 10;

const Beranda = () => {
  const {
    force_update,
    enable_appointment,
    enable_create_schedule,
    enable_customer_detail,
    enable_deposit,
    enable_po,
    enable_sph,
    enable_visitation,
  } = useSelector((state: RootState) => state.auth.remote_config);
  const dispatch = useDispatch();
  const [currentVisit, setCurrentVisit] = React.useState<{
    current: number;
    target: number;
  }>({ current: 0, target: 10 }); //temporary setCurrentVisit
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isTargetLoading, setIsTargetLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false); // setIsLoading temporary  setIsLoading
  const [isRenderDateDaily, setIsRenderDateDaily] = React.useState(true); //setIsRenderDateDaily
  const [snapPoints] = React.useState([`${initialSnapPoints}%`, '91%', '100%']); //setSnapPoints
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = React.useState(false);
  const [isHeaderShown, setIsHeaderShown] = React.useState(true);
  const [isUpdateDialogVisible, setUpdateDialogVisible] = React.useState(false);

  useHeaderStyleChanged({
    titleColor: colors.text.light,
    bgColor: colors.primary,
  });

  // fetching data
  const [data, setData] = React.useState<Api.Response>({
    totalItems: 0,
    currentPage: 0,
    totalPage: 0,
    data: [],
  });
  const [page, setPage] = React.useState<number>(0);
  const [selectedDate, setSelectedDate] = React.useState<moment.Moment>(
    moment()
  );

  const toggleModal = (key: string) => () => {
    setData({ totalItems: 0, currentPage: 0, totalPage: 0, data: [] });
    setIsHeaderShown(!isHeaderShown);
    setModalVisible(!isModalVisible);
    if (key === 'close') {
      setSearchQuery('');
    }
  };
  const bottomSheetOnchange = (index: number) => {
    if (index === 0 || index === 1) {
      //   setSnapPoints(['68%', '91%']);
      setIsRenderDateDaily(true);
    } else {
      setIsRenderDateDaily(false);
    }
    if (index === 0) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  const fetchTarget = React.useCallback(async () => {
    try {
      setIsTargetLoading(true);
      const { data: _data } = await getVisitationTarget();
      customLog(_data.data, 'fetchTarget103');
      setCurrentVisit({
        current: _data.data.totalCompleted,
        target: _data.data.visitationTarget,
      });
      setIsTargetLoading(false);
    } catch (err) {
      setIsTargetLoading(false);
      customLog(err);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchTarget();
    }, [])
  );

  const renderUpdateDialog = () => {
    return (
      <Portal>
        <Dialog
          visible={isUpdateDialogVisible}
          dismissable={!isForceUpdate(force_update)}
          onDismiss={() => setUpdateDialogVisible(!isUpdateDialogVisible)}
          style={{ backgroundColor: colors.white }}
        >
          <Dialog.Title
            style={{
              fontFamily: fonts.family.montserrat[500],
              fontSize: fonts.size.lg,
            }}
          >
            Update Aplikasi
          </Dialog.Title>
          <Dialog.Content>
            <BText bold="300">
              Aplikasi anda telah usang, silakan update sebelum melanjutkan.
            </BText>
          </Dialog.Content>
          <Dialog.Actions>
            {!isForceUpdate(force_update) && (
              <Button
                onPress={() => setUpdateDialogVisible(!isUpdateDialogVisible)}
              >
                Cancel
              </Button>
            )}
            <Button
              onPress={() =>
                Linking.openURL(
                  'https://play.google.com/store/apps/details?id=bod.app'
                )
              }
            >
              Update
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  const fetchVisitations = async (search?: string) => {
    setIsLoading(true);
    try {
      const options = {
        page,
        search: search || searchQuery,
        ...(!search &&
          !searchQuery && {
            date: selectedDate.valueOf(),
          }),
      };
      const { data: _data } = await getAllVisitations(options);

      const dispalyData =
        _data.data?.map(
          (el: {
            id: string;
            status: string;
            order: any;
            finishDate: moment.MomentInput;
            dateVisit: moment.MomentInput;
            project: { name: any };
          }) => {
            const status =
              el.status === 'VISIT' ? `Visit ke ${el.order}` : el.status;
            const pilStatus = el.finishDate ? 'Selesai' : 'Belum Selesai';
            const time = el.finishDate
              ? moment(el.finishDate).format('hh:mm')
              : null;
            const location = el.project?.locationAddress.line1;
            return {
              id: el.id,
              name: el.project?.name || '--',
              location: location ? location : '-',
              time,
              status,
              pilStatus,
            };
          }
        ) || [];

      setIsLoading(false);
      if (page > 0) {
        setData({
          ..._data,
          data: data.data.concat(dispalyData),
        });
      } else {
        setData({
          ..._data,
          data: dispalyData,
        });
      }
    } catch (error) {
      customLog(error, 'ini err apa sih??'.replace);
    }
  };

  React.useEffect(() => {
    crashlytics().log(TAB_HOME);
    fetchVisitations();

    let currentVersionName = versionName;
    if (isDevelopment())
      currentVersionName = currentVersionName?.replace('(Dev)', '');
    setUpdateDialogVisible(
      currentVersionName?.split('.').join('') <
        getMinVersionUpdate(force_update)
    );
  }, [page, selectedDate]);

  const onDateSelected = React.useCallback((dateTime: moment.Moment) => {
    setPage(0);
    setData({ totalItems: 0, currentPage: 0, totalPage: 0, data: [] });
    setSelectedDate(dateTime);
  }, []);

  const tabToRender: { tabTitle: string; totalItems: number }[] =
    React.useMemo(() => {
      return [
        {
          tabTitle: 'Proyek',
          totalItems: data.totalItems || 0,
        },
      ];
    }, [data]);

  const onEndReached = () => {
    if (data.totalPage) {
      if (data.totalPage > 0 && page < data.totalPage) {
        setPage(page + 1);
      }
    }
  };

  const getButtonsMenu = () => {
    let buttons = [
      {
        icon: SvgNames.IC_SPH,
        title: HOME_MENU.SPH,
        action: () => {
          navigation.navigate(SPH);
        },
      },
      {
        icon: SvgNames.IC_PO,
        title: HOME_MENU.PO,
        action: () => {},
      },
      {
        icon: SvgNames.IC_DEPOSIT,
        title: HOME_MENU.DEPOSIT,
        action: () => {},
      },
      {
        icon: SvgNames.IC_MAKE_SCHEDULE,
        title: HOME_MENU.SCHEDULE,
        action: () => {
          navigation.navigate(CREATE_SCHEDULE);
        },
      },
      {
        icon: SvgNames.IC_APPOINTMENT,
        title: HOME_MENU.APPOINTMENT,
        action: () => {
          navigation.navigate(APPOINTMENT);
        },
      },
    ];

    if (!enable_sph) {
      const filtered = buttons.filter((item) => {
        return item.title !== HOME_MENU.SPH;
      });
      buttons = filtered;
    }

    if (!enable_po) {
      const filtered = buttons.filter((item) => {
        return item.title !== HOME_MENU.PO;
      });
      buttons = filtered;
    }

    if (!enable_deposit) {
      const filtered = buttons.filter((item) => {
        return item.title !== HOME_MENU.DEPOSIT;
      });
      buttons = filtered;
    }

    if (!enable_create_schedule) {
      const filtered = buttons.filter((item) => {
        return item.title !== HOME_MENU.SCHEDULE;
      });
      buttons = filtered;
    }

    if (!enable_appointment) {
      const filtered = buttons.filter((item) => {
        return item.title !== HOME_MENU.APPOINTMENT;
      });
      buttons = filtered;
    }
    return buttons;
  };

  const todayMark = React.useMemo(() => {
    return [
      {
        date: moment(),
        lines: [
          {
            color: colors.primary,
          },
        ],
      },
    ];
  }, []);

  const onChangeSearch = (text: string) => {
    setSearchQuery(text);
    onChangeWithDebounce(text);
  };

  const reset = (text: string) => {
    setData({
      totalItems: 0,
      currentPage: 0,
      totalPage: 0,
      data: [],
    });
    setPage(0);
    fetchVisitations(text);
  };

  const onChangeWithDebounce = React.useCallback(debounce(reset, 500), []);

  const kunjunganAction = () => {
    // setIsLoading((curr) => !curr);
    navigation.navigate(CAMERA, {
      photoTitle: 'Kunjungan',
      navigateTo: CREATE_VISITATION,
    });
  };
  const sceneToRender = React.useCallback(() => {
    if (searchQuery.length <= 2) {
      return null;
    }
    return (
      <BFlatlistItems
        renderItem={(item) => (
          <BVisitationCard
            item={item}
            searchQuery={searchQuery}
            onPress={() => {
              customLog(item, 'sceneToRender');
            }}
          />
        )}
        searchQuery={searchQuery}
        data={data.data}
        isLoading={isLoading}
        onEndReached={onEndReached}
      />
    );
  }, [data]);

  async function visitationOnPress(
    dataItem: visitationDataType
  ): Promise<void> {
    try {
      const status = dataItem.pilStatus;

      dispatch(
        openPopUp({
          popUpType: 'loading',
          popUpText: 'Loading visitation Data...',
          outsideClickClosePopUp: false,
        })
      );
      const response = await dispatch(
        getOneVisitation({ visitationId: dataItem.id })
      ).unwrap();

      dispatch(closePopUp());
      if (status === 'Belum Selesai') {
        navigation.navigate(CAMERA, {
          photoTitle: 'Kunjungan',
          navigateTo: CREATE_VISITATION,
          existingVisitation: response,
        });
      } else {
        navigation.navigate(CUSTOMER_DETAIL, {
          existingVisitation: response,
        });
      }
    } catch (error) {
      dispatch(
        openPopUp({
          popUpType: 'error',
          highlightedText: 'Error',
          popUpText: 'Error fetching visitation Data',
          outsideClickClosePopUp: true,
        })
      );
    }
  }

  return (
    <View style={style.container}>
      <Modal
        isVisible={isModalVisible}
        backdropOpacity={1}
        backdropColor="white"
        hideModalContentWhileAnimating={true}
        coverScreen={false}
        onModalHide={() => {
          fetchVisitations();
        }}
      >
        <View style={style.modalContent}>
          <BSearchBar
            placeholder="Search"
            activeOutlineColor="gray"
            left={
              <TextInput.Icon
                onPress={kunjunganAction}
                forceTextInputFocus={false}
                icon="magnify"
              />
            }
            right={
              <TextInput.Icon
                forceTextInputFocus={false}
                onPress={toggleModal('close')}
                icon="close"
              />
            }
            value={searchQuery}
            onChangeText={onChangeSearch}
          />
          <BTabViewScreen
            screenToRender={sceneToRender}
            isLoading={isLoading}
            tabToRender={tabToRender}
          />
        </View>
      </Modal>

      <TargetCard
        isExpanded={isExpanded}
        maxVisitation={currentVisit.target}
        currentVisitaion={currentVisit.current}
        isLoading={isTargetLoading}
      />

      <BSpacer size="small" />
      <BQuickAction buttonProps={getButtonsMenu()} />

      <BBottomSheet
        onChange={bottomSheetOnchange}
        percentSnapPoints={snapPoints}
        ref={bottomSheetRef}
        enableContentPanningGesture={true}
        handleIndicatorStyle={style.handleIndicator}
        style={style.BsheetStyle}
        footerComponent={(props: any) => {
          if (!isRenderDateDaily) {
            return null;
          }

          if (enable_visitation) return BuatKunjungan(props, kunjunganAction);
        }}
      >
        <View style={style.posRelative}>
          <TouchableOpacity
            style={style.touchable}
            onPress={toggleModal('open')}
          />
          <BSearchBar
            placeholder="Cari Pelanggan"
            activeOutlineColor="gray"
            left={<TextInput.Icon icon="magnify" />}
            value={searchQuery}
          />
        </View>
        <BSpacer size={'verySmall'} />
        <DateDaily
          markedDatesArray={todayMark}
          isRender={isRenderDateDaily}
          onDateSelected={onDateSelected}
          selectedDate={selectedDate}
        />
        <BSpacer size={'extraSmall'} />
        <BottomSheetFlatlist
          isLoading={isLoading}
          data={data.data}
          searchQuery={searchQuery}
          onEndReached={onEndReached}
          onPressItem={enable_customer_detail ? visitationOnPress : undefined}
        />
      </BBottomSheet>
      {renderUpdateDialog()}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.primary,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  itemContainer: {
    padding: layout.pad.sm,
    margin: layout.pad.sm,
    backgroundColor: '#eee',
  },
  BsheetStyle: {
    paddingLeft: layout.pad.lg,
    paddingRight: layout.pad.lg,
    justifyContent: 'center',
  },
  flatListContainer: {},
  flatListLoading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListShimmer: {
    height: resScale(60),
    borderRadius: layout.radius.md,
  },
  modalContent: {
    flex: 1,
  },
  posRelative: {
    position: 'relative',
    marginBottom: layout.pad.md,
  },
  touchable: {
    position: 'absolute',
    width: '100%',
    borderRadius: layout.radius.sm,
    height: resScale(45),
    zIndex: 2,
  },
  handleIndicator: {
    height: resScale(3),
    width: resScale(40),
    backgroundColor: colors.disabled,
  },
});
export default Beranda;
