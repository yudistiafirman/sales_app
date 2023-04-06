import {
  BBackContinueBtn,
  BDivider,
  BForm,
  BGallery,
  BHeaderIcon,
  BLocationText,
  BSpacer,
  BVisitationCard,
} from '@/components';
import { colors, fonts, layout } from '@/constants';
import { TM_CONDITION } from '@/constants/dropdown';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { Input } from '@/interfaces';
import { resScale } from '@/utils';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useCallback, useLayoutEffect } from 'react';
import {
  BackHandler,
  DeviceEventEmitter,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  CAMERA,
  GALLERY_OPERATION,
  SUBMIT_FORM,
} from '@/navigation/ScreenNames';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ENTRY_TYPE } from '@/models/EnumModel';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import {
  onChangeInputValue,
  removeOperationPhoto,
  resetOperationState,
  setOperationPhoto,
} from '@/redux/reducers/operationReducer';
import { useKeyboardActive } from '@/hooks';
import moment from 'moment';
import { updateDeliverOrder } from '@/models/updateDeliveryOrder';
import { closePopUp, openPopUp } from '@/redux/reducers/modalReducer';
import { uploadFileImage } from '@/actions/CommonActions';
import { OperationFileType } from '@/interfaces/Operation';
import {
  updateDeliveryOrder,
  updateDeliveryOrderWeight,
} from '@/actions/OrderActions';
import { FlatList } from 'react-native-gesture-handler';
import { LocalFileType } from '@/interfaces/LocalFileType';

function LeftIcon() {
  return <Text style={style.leftIconStyle}>+62</Text>;
}
const phoneNumberRegex = /^(?:0[0-9]{9,10}|[1-9][0-9]{7,11})$/;

const SubmitForm = () => {
  const route = useRoute<RootStackScreenProps>();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.auth);
  const { inputsValue, projectDetails, photoFiles, isLoading } = useSelector(
    (state: RootState) => state.operation
  );
  const { keyboardVisible } = useKeyboardActive();
  const operationType = route?.params?.operationType;
  const driversFileType = [
    OperationFileType.DO_DEPARTURE,
    OperationFileType.ARRIVAL,
    OperationFileType.TRUCK_CONDITION,
    OperationFileType.DO_SIGNED,
  ];
  const wbsFileType = [
    operationType === ENTRY_TYPE.OUT
      ? OperationFileType.WEIGHT_OUT
      : OperationFileType.WEIGHT_IN,
    operationType === ENTRY_TYPE.OUT
      ? OperationFileType.WEIGHT_OUT
      : OperationFileType.WEIGHT_IN,
  ];

  const securityDispatchFileType = [
    OperationFileType.DO_DEPARTURE_SECURITY,
    OperationFileType.DO_DRIVER_SECURITY,
    OperationFileType.DO_TRUCK_CONDITION_SECURITY,
    OperationFileType.DO_SEAL_SECURITY,
  ];
  const securityReturnFileType = [
    OperationFileType.DO_RETURN_SECURITY,
    OperationFileType.DO_RETURN_TRUCK_CONDITION_SECURITY,
  ];

  const securityFileType =
    operationType === ENTRY_TYPE.DISPATCH
      ? securityDispatchFileType
      : securityReturnFileType;

  const enableLocationHeader =
    operationType === ENTRY_TYPE.DRIVER &&
    projectDetails.address &&
    projectDetails.address?.length > 0;

  React.useEffect(() => {
    crashlytics().log(SUBMIT_FORM);
  }, []);

  const getHeaderTitle = () => {
    switch (userData?.type) {
      case ENTRY_TYPE.BATCHER:
        return 'Produksi';
      case ENTRY_TYPE.SECURITY:
        if (operationType === ENTRY_TYPE.DISPATCH) return 'Dispatch';
        else return 'Return';
      case ENTRY_TYPE.DRIVER:
        return 'Penuangan';
      case ENTRY_TYPE.WB:
        return 'Weigh Bridge';
      default:
        return '';
    }
  };

  const handleDisableContinueButton = () => {
    if (userData?.type === ENTRY_TYPE.DRIVER) {
      return (
        photoFiles.length < 5 ||
        inputsValue.recepientName.length === 0 ||
        !phoneNumberRegex.test(inputsValue.recepientPhoneNumber)
      );
    } else if (userData?.type === ENTRY_TYPE.WB) {
      return inputsValue.weightBridge.length === 0;
    } else if (operationType === ENTRY_TYPE.RETURN) {
      return inputsValue.truckMixCondition.length === 0;
    } else if (operationType === ENTRY_TYPE.DISPATCH) {
      return photoFiles.length !== 5;
    }
  };

  const handleBack = () => {
    // dispatch(resetOperationState());
    navigation.dispatch(StackActions.popToTop());
  };

  const onSubmitData = async () => {
    try {
      dispatch(
        openPopUp({
          popUpType: 'loading',
          popUpTitle: '',
          popUpText: 'Memperbarui Delivery Order',
          outsideClickClosePopUp: false,
        })
      );
      const payload = {} as updateDeliverOrder;
      const photoFilestoUpload = photoFiles
        .filter((v) => v.file !== null)
        .map((photo) => {
          return {
            ...photo.file,
            uri: photo?.file?.uri?.replace('file:', 'file://'),
          };
        });
      const responseFiles = await uploadFileImage(
        photoFilestoUpload,
        'Update Delivery Order'
      );
      if (responseFiles.data.success) {
        let responseUpdateDeliveryOrder: any;
        if (userData?.type === ENTRY_TYPE.DRIVER) {
          const newFileData = responseFiles.data.data.map((v, i) => {
            return {
              fileId: v.id,
              type: driversFileType[i],
            };
          });
          payload.doFiles = newFileData;
          payload.recepientName = inputsValue.recepientName;
          payload.recipientNumber = inputsValue.recepientPhoneNumber;
          responseUpdateDeliveryOrder = await updateDeliveryOrder(
            payload,
            projectDetails.deliveryOrderId
          );
        } else if (userData?.type === ENTRY_TYPE.WB) {
          const newFileData = responseFiles.data.data.map((v, i) => {
            return {
              fileId: v.id,
              type: wbsFileType[i],
            };
          });
          payload.doFiles = newFileData;
          payload.weight = inputsValue.weightBridge;
          responseUpdateDeliveryOrder = await updateDeliveryOrderWeight(
            payload,
            projectDetails.deliveryOrderId
          );
        } else if (userData?.type === ENTRY_TYPE.SECURITY) {
          const newFileData = responseFiles.data.data.map((v, i) => {
            return {
              fileId: v.id,
              type: securityFileType[i],
            };
          });
          payload.doFiles = newFileData;
          if (ENTRY_TYPE.RETURN) {
            payload.conditionTruck = inputsValue.truckMixCondition;
          }
          responseUpdateDeliveryOrder = await updateDeliveryOrder(
            payload,
            projectDetails.deliveryOrderId
          );
        }

        if (responseUpdateDeliveryOrder.data.success) {
          dispatch(resetOperationState());
          dispatch(
            openPopUp({
              popUpType: 'success',
              popUpText: 'Berhasil Memperbarui Delivery Order',
              outsideClickClosePopUp: true,
            })
          );
          if (navigation.canGoBack()) {
            // dispatch(resetOperationState());
            navigation.dispatch(StackActions.popToTop());
          }
        } else {
          dispatch(closePopUp());
          dispatch(
            openPopUp({
              popUpType: 'error',
              popUpText:
                responseFiles.data.message ||
                'Error Memperbarui Delivery Order',
              outsideClickClosePopUp: true,
            })
          );
        }
      } else {
        dispatch(closePopUp());
        dispatch(
          openPopUp({
            popUpType: 'error',
            popUpText:
              responseFiles.data.message || 'Error Memperbarui Delivery Order',
            outsideClickClosePopUp: true,
          })
        );
      }
    } catch (error) {
      dispatch(closePopUp());
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText: error.message || 'Error Memperbarui Delivery Order',
          outsideClickClosePopUp: true,
        })
      );
    }
  };

  const onPressContinue = () => {
    onSubmitData();
  };

  const renderHeaderLeft = useCallback(
    () => (
      <BHeaderIcon
        size={layout.pad.lg + layout.pad.md}
        iconName="arrow-left"
        marginRight={layout.pad.lg}
        onBack={handleBack}
      />
    ),
    [handleBack]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => renderHeaderLeft(),
    });
  }, [navigation, renderHeaderLeft]);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        handleBack();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
      return () => backHandler.remove();
    }, [handleBack, photoFiles, userData?.type])
  );

  useHeaderTitleChanged({ title: getHeaderTitle() });

  const weightInputs: Input[] = [
    {
      label: 'Berat',
      value: inputsValue.weightBridge,
      onChange: (e) => {
        let result: string = '' + e;
        dispatch(
          onChangeInputValue({
            inputType: 'weightBridge',
            value: result,
          })
        );
      },
      isRequire: true,
      type: 'quantity',
      quantityType: 'kg',
      placeholder: 'Masukkan berat',
      isError: !inputsValue.weightBridge,
      outlineColor: !inputsValue.weightBridge
        ? colors.text.errorText
        : undefined,
    },
  ];

  const deliveryInputs: Input[] = [
    {
      label: 'Nama Penerima',
      value: inputsValue.recepientName,
      onChange: (e) =>
        dispatch(
          onChangeInputValue({
            inputType: 'recepientName',
            value: e.nativeEvent.text,
          })
        ),
      isRequire: true,
      type: 'textInput',
      placeholder: 'Masukkan nama penerima',
      isError: !inputsValue.recepientName,
      outlineColor: !inputsValue.recepientName
        ? colors.text.errorText
        : undefined,
    },
    {
      label: 'No. Telp Penerima',
      value: inputsValue.recepientPhoneNumber,
      onChange: (e) => {
        dispatch(
          onChangeInputValue({
            inputType: 'recepientPhoneNumber',
            value: e.nativeEvent.text,
          })
        );
      },
      isError: !phoneNumberRegex.test(inputsValue.recepientPhoneNumber),
      outlineColor: !phoneNumberRegex.test(inputsValue.recepientPhoneNumber)
        ? colors.text.errorText
        : undefined,
      isRequire: true,
      keyboardType: 'numeric',
      type: 'textInput',
      placeholder: 'Masukkan nomor telp penerima',
      customerErrorMsg: 'No. Telepon harus diisi sesuai format',
      LeftIcon: inputsValue.recepientPhoneNumber ? LeftIcon : undefined,
    },
  ];

  const returnInputs: Input[] = [
    {
      label: 'Ada Muatan Tersisa di Dalam TM?',
      value: '',
      type: 'checkbox',
      isRequire: false,
      checkbox: {
        value: inputsValue.truckMixHaveLoad,
        onValueChange: (e) => {
          dispatch(
            onChangeInputValue({ inputType: 'truckMixHaveLoad', value: e })
          );
        },
      },
    },
    {
      label: 'Kondisi TM',
      isRequire: true,
      isError: false,
      type: 'dropdown',
      dropdown: {
        items: TM_CONDITION,
        placeholder: inputsValue.truckMixCondition
          ? TM_CONDITION.find((it) => {
              return it.value === inputsValue.truckMixCondition;
            })?.label ?? ''
          : 'Pilih Kondisi TM',
        onChange: (value: any) => {
          dispatch(
            onChangeInputValue({ inputType: 'truckMixCondition', value: value })
          );
        },
      },
    },
  ];

  const deleteImages = useCallback(
    (i: number) => {
      dispatch(removeOperationPhoto({ index: i + 1 }));
    },
    [photoFiles, dispatch, removeOperationPhoto]
  );

  const addMoreImages = useCallback(() => {
    let title = '';
    switch (userData?.type) {
      case ENTRY_TYPE.DRIVER:
        if (photoFiles.length > 4) {
          dispatch(
            openPopUp({
              popUpType: 'error',
              popUpText: 'Maksimum file telah tercapai',
              outsideClickClosePopUp: true,
            })
          );
        } else {
          if (photoFiles.length <= 1) {
            title = 'DO';
          } else if (photoFiles.length <= 2) {
            title = 'Penuangan';
          } else if (photoFiles.length <= 3) {
            title = 'Isi TM';
          } else if (photoFiles.length <= 4) {
            title = 'DO Saat Ditandatangan';
          }
          navigation.dispatch(
            StackActions.push(CAMERA, {
              photoTitle: title,
              closeButton: true,
              navigateTo: GALLERY_OPERATION,
            })
          );
        }
        break;
      case ENTRY_TYPE.SECURITY:
        if (operationType === ENTRY_TYPE.DISPATCH) {
          if (photoFiles.length > 4) {
            dispatch(
              openPopUp({
                popUpType: 'error',
                popUpText: 'Maksimum file telah tercapai',
                outsideClickClosePopUp: true,
              })
            );
          } else {
            if (photoFiles.length <= 1) {
              title = 'DO';
            } else if (photoFiles.length <= 2) {
              title = 'Driver';
            } else if (photoFiles.length <= 3) {
              title = 'No Polisi TM';
            } else if (photoFiles.length <= 4) {
              title = 'Segel';
            }
            navigation.dispatch(
              StackActions.push(CAMERA, {
                photoTitle: title,
                closeButton: true,
                navigateTo: GALLERY_OPERATION,
              })
            );
          }
        } else {
          if (photoFiles.length > 2) {
            dispatch(
              openPopUp({
                popUpType: 'error',
                popUpText: 'Maksimum file telah tercapai',
                outsideClickClosePopUp: true,
              })
            );
          } else {
            if (photoFiles.length <= 1) {
              title = 'DO';
            } else if (photoFiles.length <= 2) {
              title = 'Kondisi TM';
            }
            navigation.dispatch(
              StackActions.push(CAMERA, {
                photoTitle: title,
                closeButton: true,
                navigateTo: GALLERY_OPERATION,
              })
            );
          }
        }
        break;
      case ENTRY_TYPE.WB:
        if (photoFiles.length > 2) {
          dispatch(
            openPopUp({
              popUpType: 'error',
              popUpText: 'Maksimum file telah tercapai',
              outsideClickClosePopUp: true,
            })
          );
        } else {
          if (photoFiles.length <= 1) {
            title = 'DO';
          } else if (photoFiles.length <= 2) {
            title = 'Hasil';
          }
          navigation.dispatch(
            StackActions.push(CAMERA, {
              photoTitle: title,
              closeButton: true,
              navigateTo: GALLERY_OPERATION,
            })
          );
        }
        break;
    }
  }, [photoFiles, dispatch]);

  return (
    <SafeAreaView style={style.parent}>
      <FlatList
        data={null}
        renderItem={null}
        ListHeaderComponent={
          <View style={style.flexFull}>
            {enableLocationHeader && (
              <BLocationText location={projectDetails.address} />
            )}
            <BSpacer size={'extraSmall'} />
            <View style={style.top}>
              <BVisitationCard
                item={{
                  name: projectDetails.projectName,
                  location: projectDetails.address,
                }}
                isRenderIcon={false}
              />
              <BVisitationCard
                item={{
                  name: projectDetails.doNumber,
                  unit: `${projectDetails.requestedQuantity} m3`,
                  time: `${moment(projectDetails.deliveryTime).format(
                    'L'
                  )} | ${moment(projectDetails.deliveryTime).format(
                    'hh:mm A'
                  )}`,
                }}
                customStyle={{ backgroundColor: colors.tertiary }}
                isRenderIcon={false}
              />
            </View>
            <View>
              <BDivider />
              <BSpacer size={'extraSmall'} />
            </View>
            <View>
              <BGallery
                addMorePict={() => addMoreImages()}
                removePict={(pos) => deleteImages(pos)}
                picts={photoFiles}
              />
            </View>
            <View style={style.flexFull}>
              {(operationType === ENTRY_TYPE.DRIVER ||
                operationType === ENTRY_TYPE.RETURN ||
                operationType === ENTRY_TYPE.IN ||
                operationType === ENTRY_TYPE.OUT) && <BSpacer size={'small'} />}
              {operationType === ENTRY_TYPE.DRIVER && (
                <BForm titleBold="500" inputs={deliveryInputs} />
              )}
              {(operationType === ENTRY_TYPE.IN ||
                operationType === ENTRY_TYPE.OUT) && (
                <BForm titleBold="500" inputs={weightInputs} />
              )}
              {operationType === ENTRY_TYPE.RETURN && (
                <View style={{ height: resScale(300) }}>
                  <BForm
                    titleBold="500"
                    inputs={returnInputs}
                    spacer="extraSmall"
                  />
                </View>
              )}
            </View>
          </View>
        }
      />

      {!keyboardVisible && (
        <BBackContinueBtn
          onPressContinue={onPressContinue}
          disableContinue={handleDisableContinueButton()}
          onPressBack={handleBack}
          continueText={'Simpan'}
          isContinueIcon={false}
        />
      )}
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  flexFull: {
    flex: 1,
  },
  leftIconStyle: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
    color: colors.textInput.input,
  },
  parent: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: layout.pad.lg,
    paddingBottom: layout.pad.lg,
  },
  top: {
    height: resScale(120),
    marginBottom: layout.pad.lg,
  },
  headerTwo: {
    borderColor: colors.border.default,
  },
  conButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: layout.pad.lg,
    bottom: 0,
  },
  buttonOne: {
    width: '40%',
    paddingEnd: layout.pad.md,
  },
  buttonTwo: {
    width: '60%',
    paddingStart: layout.pad.md,
  },
});
export default SubmitForm;
